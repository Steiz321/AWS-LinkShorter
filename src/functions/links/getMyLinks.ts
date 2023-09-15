import tokenService from "../../services/tokenService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ApiError } from "../../extensions/apiError";
import linkService from "../../services/linkService";

export const handlerFunc = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: any = { statusCode: 200 }

    try {
        const accessToken = event.headers.Authorization!.split(" ")[1];
        const userData = await tokenService.validateAccessToken(accessToken);
        if(userData === null) {
            throw ApiError.Unauthorized('Unauthorized!');
        }
        
        const links = await linkService.getUserLinks(userData);

        response.body = JSON.stringify({
            message: 'Successfully got all links',
            data: links,
        })
    } catch (err: any) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to get all links',
            errorMsg: err.message,
            errStack: err.stack
        })
    }

    return response;
}