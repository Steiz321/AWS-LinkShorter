import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import tokenService from "../../services/tokenService";
import { UserJwtPayload } from "../../types/user";
import { ApiError } from "../../extensions/apiError";
import { IReactiveLink } from "../../types/link";
import linkService from "../../services/linkService";


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: any = { statusCode: 200 }

    try {
        const accessToken = event.headers.Authorization!.split(" ")[1];
        const userData = await tokenService.validateAccessToken(accessToken) as UserJwtPayload;
        if(userData === null) {
            throw ApiError.Unauthorized('Unauthorized!');
        }

        const shortedLink = `${process.env.API_URL}/${event.pathParameters!.linkParams}`;

        const body: IReactiveLink = JSON.parse(event.body || "");

        const reactivatedLink = await linkService.reactiveLink(shortedLink, body.expireTime, userData);

        response.body = JSON.stringify({
            message: `Link with id: ${reactivatedLink.linkId} has been deactivated!`,
            data: {
                reactivatedLink
            }
        });
        return response;
    } catch(err: any) { 
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