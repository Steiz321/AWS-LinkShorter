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
const apiError_1 = require("../../extensions/apiError");
const tokenService_1 = __importDefault(require("../../services/tokenService"));
const handlerFunc = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!event.authorizationToken) {
            throw apiError_1.ApiError.Unauthorized('User unauthorized!');
        }
        const accessToken = event.authorizationToken.split(' ')[1];
        if (!accessToken) {
            throw apiError_1.ApiError.Unauthorized('User unauthorized!');
        }
        const userData = yield tokenService_1.default.validateAccessToken(accessToken);
        if (!userData) {
            throw apiError_1.ApiError.Unauthorized('User unauthorized!');
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
    }
    catch (err) {
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
});
exports.handlerFunc = handlerFunc;
