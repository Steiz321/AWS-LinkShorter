import { PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../config/db";
import { ApiError } from "../extensions/apiError";
import { ICreateLink, ILink } from "../types/link";
import { v4 as uuidv4 } from 'uuid';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UserJwtPayload } from "../types/user";
import crypto from 'crypto';
import { dateConvert } from "../extensions/dateConverter";
// import { linkDeactivateScheduler } from "../schedulers/linkDeactivateScheduler";
import userService from "./userService";
import sqsService from "./sqsService";
import shedulerService from "./shedulerService";


class LinkService {

    async getUserLinks(user: UserJwtPayload): Promise<ILink[]> {
        const params = {
            TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": { S: `${user.userId}`}
            }
        }

        const { Items } = await db.send(new ScanCommand(params));

        const links: any[] = [];
        Items?.map((item) => links.push(unmarshall(item)));
        return links;
    }

    async createLink(body: ICreateLink, user: UserJwtPayload): Promise<ILink> {

        const existsLink = await linkService.getLinkByOrig(body.originalLink, user.userId);

        if(existsLink) {
            throw ApiError.Conflict('link is already exists!');
        }

        const randomString = crypto.randomBytes(3).toString('hex');
        const shortedLink = `${process.env.API_URL}/${randomString}`;

        let oneTime = (body.expireTime === 'one-time') ? true : false;
        const {creationDate, expireDate} = await dateConvert(body.expireTime);

        const newLinkItem: ILink = {
            linkId: uuidv4(),
            userId: user.userId,
            originalLink: body.originalLink,
            shortedLink,
            oneTime, 
            creationDate,
            expireDate,
            isActive: true,
            visits: 0
        }

        const params = {
            TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
            Item: marshall(newLinkItem || {})
        }

        const createResult = await db.send(new PutItemCommand(params));

        if(!createResult) {
            throw ApiError.BadRequest('Something went wrong');
        }

        if(!newLinkItem.oneTime) {
            await shedulerService.linkDeactivateScheduler(String(process.env.FUNC_ARN), String(process.env.ROLE_ARN), newLinkItem, user)
        }

        return newLinkItem;
    }

    async redirectLink(shortedLink: string): Promise<ILink> {
        const link = await this.getLinkByShort(shortedLink);
        if(!link) {
            throw ApiError.NotFound("Link not found!!");
        }

        const user = await userService.getUserById(link.userId);
        if(!user) {
            throw ApiError.NotFound("Link owner not found!!");
        }

        if(link.isActive === false) {
            throw ApiError.BadRequest('Link is not active!')
        }

        // update visits count
        const updatedVisitsLink = await this.updateLinkVisits(link);

        if(link.oneTime) {
            const deactivatedLink = await this.deactivateLink(link.shortedLink, user);

            //send an email
            await sqsService.deactivateEmail(String(process.env.QUEUE_URL), user.email, link.linkId);
        }

        return link;
    }

    async deactivateLink(shortedLink: string, user: UserJwtPayload): Promise<ILink> {
        const link = await this.getLinkByShort(shortedLink);
        if(!link) {
            throw ApiError.NotFound("Link not found!!");
        }

       // deactivate link
       const updateParams = {
        TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
        Key: {
            linkId: { S: link.linkId}
        },
        UpdateExpression: "SET isActive = :isActive,expireDate = :expireDate",
        ExpressionAttributeValues: {
            ":isActive": {
                BOOL: false
            },
            ":expireDate": {
                S: "null"
            }
        },
        ReturnValues: "ALL_NEW",
        }

        const updatedLink = await db.send(new UpdateItemCommand(updateParams));
        if(!updatedLink.Attributes) {
            throw ApiError.BadRequest('Something went wrong!');
        }

        const deactivatedLink = unmarshall(updatedLink.Attributes) as ILink;

        await sqsService.deactivateEmail(String(process.env.QUEUE_URL), user.email, link.linkId);

        return deactivatedLink;
    }

    async reactiveLink(shortedLink: string, expireTime: string, user: UserJwtPayload): Promise<ILink> {
        const link = await this.getLinkByShort(shortedLink);
        if(!link) {
            throw ApiError.NotFound('Link not found!');
        }

        if(!link.oneTime && expireTime === 'one-time') {
            throw ApiError.BadRequest('Invalid expireTime for not one-time link');
        }

        const {creationDate, expireDate} = await dateConvert(expireTime);

        const updateParams = {
            TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
            Key: {
                linkId: { S: link.linkId}
            },
            UpdateExpression: "SET isActive = :isActive, expireDate = :expireDate",
            ExpressionAttributeValues: {
                ":isActive": {
                    BOOL: true
                },
                ":expireDate": {
                    S: `${expireDate}`
                }
            },
            ReturnValues: "ALL_NEW",
        }
        
        const updatedLink = await db.send(new UpdateItemCommand(updateParams));
        if(!updatedLink.Attributes) {
            throw ApiError.BadRequest('Something went wrong!');
        }

        const reactivatedLink = unmarshall(updatedLink.Attributes) as ILink;
    
        return reactivatedLink;
    }

    async getLinkByOrig(originalLink: string, userId: string): Promise<ILink | null> {
        const existsLinkParams = {
            TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
            FilterExpression: "originalLink = :originalLink AND userId = :userId",
            ExpressionAttributeValues: {
                ":originalLink": { S: `${originalLink}`},
                ":userId": { S: `${userId}`}
            }
        }

        const { Items } = await db.send(new ScanCommand(existsLinkParams));

        if(!Items?.length) {
            return null;
        }

        const linkItem = unmarshall(Items[0]) as ILink;
        return linkItem;
    }

    async getLinkByShort(shortedLink: string): Promise<ILink | null> {
        const params = {
            TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
            FilterExpression: "shortedLink = :shortedLink",
            ExpressionAttributeValues: {
                ":shortedLink": { S: `${shortedLink}`}
            }
        }

        const { Items } = await db.send(new ScanCommand(params));
        if(!Items?.length) {
            return null;
        }

        const linkItem = unmarshall(Items[0]) as ILink;
        return linkItem;
    }

    async updateLinkVisits(link: ILink): Promise<ILink> {
        const updateVisitsParams = {
            TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
            Key: {
                linkId: { S: link.linkId}
            },
            UpdateExpression: "SET visits = :visits",
            ExpressionAttributeValues: {
                ":visits": {
                    N: `${link.visits + 1}`
                }
            },
            ReturnValues: "ALL_NEW",
        }

        const updatedVisits =  await db.send(new UpdateItemCommand(updateVisitsParams));
        if(!updatedVisits.Attributes) {
            throw ApiError.BadRequest('Something went wrong!');
        }

        const updatedVisitsLink = unmarshall(updatedVisits.Attributes) as ILink;
        return updatedVisitsLink;
    }
}

const linkService = new LinkService();
export default linkService;
