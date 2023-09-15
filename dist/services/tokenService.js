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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const uuid_1 = require("uuid");
class TokenService {
    generateTokens(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign(dto, String(process.env.JWT_ACCESS_SECRET), { expiresIn: String(process.env.TTL_ACCESS) });
            const refreshToken = jsonwebtoken_1.default.sign(dto, String(process.env.JWT_RESFRESH_SECRET), { expiresIn: String(process.env.TTL_REFRESH) });
            return {
                accessToken,
                refreshToken
            };
        });
    }
    saveTokens(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const findTokenParams = {
                TableName: process.env.DYNAMODB_TOKENS_TABLE_NAME,
                FilterExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": { S: `${userId}` }
                }
            };
            const { Items } = yield db_1.db.send(new client_dynamodb_1.ScanCommand(findTokenParams));
            if (Items === null || Items === void 0 ? void 0 : Items.length) {
                const tokenItem = (0, util_dynamodb_1.unmarshall)(Items[0]);
                const updateTokenParams = {
                    TableName: process.env.DYNAMODB_TOKENS_TABLE_NAME,
                    Key: {
                        tokenId: { S: tokenItem.tokenId }
                    },
                    UpdateExpression: "SET refreshToken = :refreshToken",
                    ExpressionAttributeValues: {
                        ":refreshToken": {
                            S: tokenItem.refreshToken
                        }
                    },
                    ReturnValues: "ALL_NEW",
                };
                return db_1.db.send(new client_dynamodb_1.UpdateItemCommand(updateTokenParams));
            }
            const tokenItem = {
                tokenId: (0, uuid_1.v4)(),
                refreshToken,
                userId
            };
            const tokenCreateParams = {
                TableName: process.env.DYNAMODB_TOKENS_TABLE_NAME,
                Item: (0, util_dynamodb_1.marshall)(tokenItem),
            };
            const createdToken = yield db_1.db.send(new client_dynamodb_1.PutItemCommand(tokenCreateParams));
            return refreshToken;
        });
    }
    validateAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = jsonwebtoken_1.default.verify(token, String(process.env.JWT_ACCESS_SECRET));
                return userData;
            }
            catch (err) {
                return null;
            }
        });
    }
}
const tokenService = new TokenService();
exports.default = tokenService;
