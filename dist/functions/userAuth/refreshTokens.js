"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerFunc = void 0;
const tokenService_1 = __importDefault(require("../../services/tokenService"));
const handlerFunc = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response = { statusCode: 200 };
    try {
        const body = JSON.parse(event.body || "");
        console.log('body', body);
        const userData = tokenService_1.default.validateRefreshToken(body.refreshToken);
        console.log('userData', userData);
        // const findTokenParams = {
        //     TableName: process.env.DYNAMODB_TOKENS_TABLE_NAME,
        //     FilterExpression: "refreshToken = :refreshToken",
        //     ExpressionAttributeValues: {
        //         ":refreshToken": { S: `${body.refreshToken}`}
        //     }
        // }
        // const { Items } = await db.send(new ScanCommand(findTokenParams));
        // if(!Items?.length || !userData) {
        //     throw ApiError.Unauthorized('invalid token')
        // }
        // const findUserParams = {
        //     TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
        //     FilterExpression: "userId = :userId",
        //     ExpressionAttributeValues: {
        //         ":userId": { S: `${userData.userId}`}
        //     }
        // }
        // const userResponse = await db.send(new ScanCommand(findUserParams));
        // if(!userResponse?.Items?.length) {
        //     throw ApiError.Unauthorized('Uknown email or password!');
        // }
        // const user = userResponse.Items[0];
        // console.log('user', user);
        // const userDTO = new UserDTO(user);
        // const tokens = await tokenService.generateTokens({...userDTO});
        // await tokenService.saveTokens(userDTO.userId, tokens.refreshToken);
        response.body = JSON.stringify({
            message: "Tokens successfully refreshed!",
        });
    }
    catch (err) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to get all links',
            errorMsg: err.message,
            errStack: err.stack
        });
    }
    return response;
});
exports.handlerFunc = handlerFunc;
