import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import tokenService from "../../services/tokenService";
import { createLinkSchema } from "../../validationSchemas/linkSchemas";
import { ICreateLink } from '../../types/link';
import { UserJwtPayload } from '../../types/user';
import { ApiError } from '../../extensions/apiError';
import linkService from '../../services/linkService';

export const handlerFunc = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: any = { statusCode: 200 }

    try {
        const accessToken: string = event.headers.Authorization!.split(" ")[1];
        const userData = await tokenService.validateAccessToken(accessToken) as UserJwtPayload;
        if(userData === null) {
            throw ApiError.Unauthorized('Unauthorized!');
        }

        const body: ICreateLink = JSON.parse(event.body || "");
        //validating body
        createLinkSchema.parse(body);

        const createdLink = await linkService.createLink(body, userData);

        response.body = JSON.stringify({
            message: 'Successfully created a link',
            data: {
                createdLink
            }
        })
    } catch (err: any) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to create a link',
            errorMsg: err.message,
            errStack: err.stack
        })
    }

    return response;
}