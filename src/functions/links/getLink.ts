import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import linkService from "../../services/linkService";

export const handlerFunc = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    let response: any = { statusCode: 200 }

    try {

        const shortedLink = `${process.env.API_URL}/${event.pathParameters!.linkParams}`;

        const link = await linkService.redirectLink(shortedLink);

        return {
            statusCode: 302,
            headers: {
                Location: link.originalLink
            }
        }
    } catch (err: any) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to get/redirect link',
            errorMsg: err.message,
            errStack: err.stack
        })
        return response;
    }

}