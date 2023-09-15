import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { db } from "../config/db";
import { ApiError } from "../extensions/apiError";
import { IUser, IUserResponse } from "../types/user";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserDTO } from "../dto/userDTO";
import { verifyEmailAddress } from "../extensions/verifyEmail";
import tokenService from "./tokenService";


class UserService {

    async signUp(email: string, password: string): Promise <IUserResponse> {
        const existingUser = await this.getUserByEmail(email);
        if(existingUser) {
            throw ApiError.Conflict('User with this email already exists!!');
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

        const candidate = {
            userId: uuidv4(),
            email: email,
            password: hashedPassword
        }

        const createUserParams = {
            TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
            Item: marshall(candidate)
        }

        const createdUser = await db.send(new PutItemCommand(createUserParams));

        const userDTO = new UserDTO(candidate);

        // verifying user email address
        const emailResponse = await verifyEmailAddress(userDTO.email);

        const tokens = await tokenService.generateTokens({...userDTO});
        await tokenService.saveTokens(userDTO.userId, tokens.refreshToken);

        return {user: userDTO, ...tokens}
    }

    async signIn(email: string, password: string): Promise<IUserResponse> {
        const user = await this.getUserByEmail(email);
        if(!user) {
            throw ApiError.Conflict('Unknown email or password!');
        }

        const isPasswordsEqual = await bcrypt.compare(password, user.password);
        if(!isPasswordsEqual) {
            throw ApiError.Unauthorized('Unknown email or password!');
        }

        const userDTO = new UserDTO(user);
        const tokens = await tokenService.generateTokens({...userDTO});
        await tokenService.saveTokens(userDTO.userId, tokens.refreshToken);

        return {user: userDTO, ...tokens};
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const findUserParams = {
            TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": { S: `${email}`}
            }
        }

        const { Items } = await db.send(new ScanCommand(findUserParams));
        if(!Items?.length) {
            return null;
        }

        const user = unmarshall(Items[0]) as IUser;
        return user;
    }

    async getUserById(userId: string): Promise<IUser | null> {
        const getUserParams = {
            TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": { S: `${userId}`},
            }
        }

        const getUserResponse = await db.send(new ScanCommand(getUserParams));
        console.log("getUserResponse", getUserResponse)

        const userItems = getUserResponse.Items;
        if(!userItems?.length) {
            return null
        }

        const user = unmarshall(userItems[0]) as IUser;
        return user;
    }

}

const userService = new UserService();
export default userService;