"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const db_1 = require("../config/db");
const apiError_1 = require("../extensions/apiError");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const userDTO_1 = require("../dto/userDTO");
const verifyEmail_1 = require("../extensions/verifyEmail");
const tokenService_1 = __importDefault(require("./tokenService"));
class UserService {
    signUp(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.getUserByEmail(email);
            if (existingUser) {
                throw apiError_1.ApiError.Conflict('User with this email already exists!!');
            }
            const hashedPassword = yield bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
            const candidate = {
                userId: (0, uuid_1.v4)(),
                email: email,
                password: hashedPassword
            };
            const createUserParams = {
                TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
                Item: (0, util_dynamodb_1.marshall)(candidate)
            };
            const createdUser = yield db_1.db.send(new client_dynamodb_1.PutItemCommand(createUserParams));
            const userDTO = new userDTO_1.UserDTO(candidate);
            // verifying user email address
            const emailResponse = yield (0, verifyEmail_1.verifyEmailAddress)(userDTO.email);
            const tokens = yield tokenService_1.default.generateTokens(Object.assign({}, userDTO));
            yield tokenService_1.default.saveTokens(userDTO.userId, tokens.refreshToken);
            return Object.assign({ user: userDTO }, tokens);
        });
    }
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserByEmail(email);
            if (!user) {
                throw apiError_1.ApiError.Conflict('Unknown email or password!');
            }
            const isPasswordsEqual = yield bcrypt.compare(password, user.password);
            if (!isPasswordsEqual) {
                throw apiError_1.ApiError.Unauthorized('Unknown email or password!');
            }
            const userDTO = new userDTO_1.UserDTO(user);
            const tokens = yield tokenService_1.default.generateTokens(Object.assign({}, userDTO));
            yield tokenService_1.default.saveTokens(userDTO.userId, tokens.refreshToken);
            return Object.assign({ user: userDTO }, tokens);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUserParams = {
                TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
                FilterExpression: "email = :email",
                ExpressionAttributeValues: {
                    ":email": { S: `${email}` }
                }
            };
            const { Items } = yield db_1.db.send(new client_dynamodb_1.ScanCommand(findUserParams));
            if (!(Items === null || Items === void 0 ? void 0 : Items.length)) {
                return null;
            }
            const user = (0, util_dynamodb_1.unmarshall)(Items[0]);
            return user;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUserParams = {
                TableName: process.env.DYNAMODB_USERS_TABLE_NAME,
                FilterExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": { S: `${userId}` },
                }
            };
            const getUserResponse = yield db_1.db.send(new client_dynamodb_1.ScanCommand(getUserParams));
            console.log("getUserResponse", getUserResponse);
            const userItems = getUserResponse.Items;
            if (!(userItems === null || userItems === void 0 ? void 0 : userItems.length)) {
                return null;
            }
            const user = (0, util_dynamodb_1.unmarshall)(userItems[0]);
            return user;
        });
    }
}
const userService = new UserService();
exports.default = userService;
