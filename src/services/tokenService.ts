import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { ScanCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from '../dto/userDTO';
import { UserJwtPayload } from '../types/user';

class TokenService {
    async generateTokens(dto: UserDTO): Promise<{accessToken: string, refreshToken: string}> {
        const accessToken = jwt.sign(dto, String(process.env.JWT_ACCESS_SECRET), {expiresIn: String(process.env.TTL_ACCESS)});
        const refreshToken = jwt.sign(dto, String(process.env.JWT_RESFRESH_SECRET), {expiresIn: String(process.env.TTL_REFRESH)});

        return {
            accessToken,
            refreshToken
        }
    }

    async saveTokens(userId: string, refreshToken: string): Promise<string | any> {
        const findTokenParams = {
            TableName: process.env.DYNAMODB_TOKENS_TABLE_NAME,
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": { S: `${userId}`}
            }
        }

        const { Items } = await db.send(new ScanCommand(findTokenParams));

        if(Items?.length) {
            const tokenItem = unmarshall(Items[0]);
            const updateTokenParams = {
                TableName: process.env.DYNAMODB_TOKENS_TABLE_NAME,
            Key: {
                tokenId: { S: tokenItem.tokenId}
            },
            UpdateExpression: "SET refreshToken = :refreshToken",
            ExpressionAttributeValues: {
                ":refreshToken": {
                    S: tokenItem.refreshToken
                }
            },
            ReturnValues: "ALL_NEW",
            }

            return db.send(new UpdateItemCommand(updateTokenParams));
        }

        const tokenItem = {
            tokenId: uuidv4(),
            refreshToken,
            userId
        }
    
        const tokenCreateParams = {
            TableName: process.env.DYNAMODB_TOKENS_TABLE_NAME,
            Item: marshall(tokenItem),
        }

        const createdToken = await db.send(new PutItemCommand(tokenCreateParams));

        return refreshToken;
    }

    async validateAccessToken(token: string): Promise<UserJwtPayload | null> {
        try {
            const userData = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET)) as UserJwtPayload;
            return userData;
        } catch(err) {
            return null;
        }
    }
}

const tokenService = new TokenService();
export default tokenService;