import { JwtPayload } from "jsonwebtoken";
import { UserDTO } from "../dto/userDTO";

export interface UserJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    password: string;
}

export interface IUser {
    userId: string;
    email: string;
    password: string;
}

export interface IUserResponse {
    user: UserDTO;
    accessToken: string;
    refreshToken: string;
}