import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../../config/db";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import bcrypt from 'bcryptjs';
import { UserDTO } from "../../dto/userDTO";
import tokenService from "../../services/tokenService";
import { signInSchema } from "../../validationSchemas/userSchemas";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { IUser } from "../../types/user";
import { ApiError } from "../../extensions/apiError";
import userService from "../../services/userService";


export const handlerFunc = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: any = {
        statusCode: 200
    }

    try {
        const body = JSON.parse(event.body || "");
        // validateing body
        signInSchema.parse(body);

        // const findUserParams = {
        //     TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
        //     FilterExpression: "email = :email",
        //     ExpressionAttributeValues: {
        //         ":email": { S: `${body.email}`}
        //     }
        // }

        // const { Items } = await db.send(new ScanCommand(findUserParams));
        // if(!Items?.length) {
        //     throw ApiError.Unauthorized('Uknown email or password!');
        // }

        // const user = unmarshall(Items[0]) as IUser;

        // const isPasswordsEqual = await bcrypt.compare(body.password, user.password);
        // if(!isPasswordsEqual) {
        //     throw ApiError.Unauthorized('Uknown email or password!');
        // }

        // const userDTO = new UserDTO(user);
        // const tokens = await tokenService.generateTokens({...userDTO});
        // await tokenService.saveTokens(userDTO.userId, tokens.refreshToken);    

        const user = await userService.signIn(body.email, body.password);

        response.body = JSON.stringify({
            message: 'User successfully logged!',
            data: {
                ...user
            }
        })

    } catch (err: any) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to sign in!',
            errorMsg: err.message,
            errStack: err.stack
        })
    }

    return response;
}