import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../../config/db";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { marshall } from "@aws-sdk/util-dynamodb";
import tokenService from "../../services/tokenService";
import { UserDTO } from "../../dto/userDTO";
import { verifyEmailAddress } from "../../extensions/verifyEmail";
import { signUpSchema } from "../../validationSchemas/userSchemas";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import userService from "../../services/userService";

export const handlerFunc = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: any = {
        statusCode: 200
    }

    try {
        const body = JSON.parse(event.body || "");
        // validating body
        signUpSchema.parse(body);

        const createdUser = await userService.signUp(body.email, body.password);

        response.body = JSON.stringify({
            message: 'User successfully created!',
            data: {
                ...createdUser
            }
        })

    } catch (err: any) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to create a user',
            errorMsg: err.message,
            errStack: err.stack
        })
    }

    return response;
}