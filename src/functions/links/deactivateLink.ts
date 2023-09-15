import tokenService from "../../services/tokenService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserJwtPayload } from "../../types/user";
import { ApiError } from "../../extensions/apiError";
import linkService from "../../services/linkService";

export const handlerFunc = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: any = { statusCode: 202 }

    try {
        const accessToken = event.headers.Authorization!.split(" ")[1];
        const userData = await tokenService.validateAccessToken(accessToken) as UserJwtPayload;
        if(userData === null) {
            throw ApiError.Unauthorized('Unauthorized!');
        }
        
        const shortedLink = `${process.env.API_URL}/${event.pathParameters!.linkParams}`;

        const deactivatedLink = await linkService.deactivateLink(shortedLink, userData);
 
        response.body = JSON.stringify({
            message: `Link with id: ${deactivatedLink.linkId} has been deactivated!`,
            data: {
                deactivatedLink
            }
        });
        return response;
    } catch (err: any) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to deactivate link',
            errorMsg: err.message,
            errStack: err.stack
        })
        return response;
    }

}