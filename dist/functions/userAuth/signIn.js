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
const userSchemas_1 = require("../../validationSchemas/userSchemas");
const userService_1 = __importDefault(require("../../services/userService"));
const handlerFunc = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response = {
        statusCode: 200
    };
    try {
        const body = JSON.parse(event.body || "");
        // validateing body
        userSchemas_1.signInSchema.parse(body);
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
        const user = yield userService_1.default.signIn(body.email, body.password);
        response.body = JSON.stringify({
            message: 'User successfully logged!',
            data: Object.assign({}, user)
        });
    }
    catch (err) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to sign in!',
            errorMsg: err.message,
            errStack: err.stack
        });
    }
    return response;
});
exports.handlerFunc = handlerFunc;
