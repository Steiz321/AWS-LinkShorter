import { ApiError } from "../../extensions/apiError";
import tokenService from "../../services/tokenService";
import { UserJwtPayload } from "../../types/user";


export const handlerFunc = async (event: any): Promise<any> => {
    try {
        if (!event.authorizationToken) {
            throw ApiError.Unauthorized('User unauthorized!');
        }
    
        const accessToken = event.authorizationToken.split(' ')[1];
        if(!accessToken) {
            throw ApiError.Unauthorized('User unauthorized!');
        }
    
        const userData = await tokenService.validateAccessToken(accessToken) as UserJwtPayload;
        if(!userData) {
            throw ApiError.Unauthorized('User unauthorized!');
        }
            
        return {
            principalId: "user",
            policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: event.methodArn,
                }
            ],
            },
        };
    } catch(err: any) {
        return {
            principalId: "user",
            policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Deny',
                    Resource: event.methodArn,
                }
            ],
            },
        };
    }
    
}