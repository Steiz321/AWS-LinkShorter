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
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const db_1 = require("../config/db");
const apiError_1 = require("../extensions/apiError");
const uuid_1 = require("uuid");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const crypto_1 = __importDefault(require("crypto"));
const dateConverter_1 = require("../extensions/dateConverter");
// import { linkDeactivateScheduler } from "../schedulers/linkDeactivateScheduler";
const userService_1 = __importDefault(require("./userService"));
const sqsService_1 = __importDefault(require("./sqsService"));
const shedulerService_1 = __importDefault(require("./shedulerService"));
class LinkService {
    getUserLinks(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
                FilterExpression: "userId = :userId",
                ExpressionAttributeValues: {
                    ":userId": { S: `${user.userId}` }
                }
            };
            const { Items } = yield db_1.db.send(new client_dynamodb_1.ScanCommand(params));
            const links = [];
            Items === null || Items === void 0 ? void 0 : Items.map((item) => links.push((0, util_dynamodb_1.unmarshall)(item)));
            return links;
        });
    }
    createLink(body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existsLink = yield linkService.getLinkByOrig(body.originalLink, user.userId);
            if (existsLink) {
                throw apiError_1.ApiError.Conflict('link is already exists!');
            }
            const randomString = crypto_1.default.randomBytes(3).toString('hex');
            const shortedLink = `${process.env.API_URL}/${randomString}`;
            let oneTime = (body.expireTime === 'one-time') ? true : false;
            const { creationDate, expireDate } = yield (0, dateConverter_1.dateConvert)(body.expireTime);
            const newLinkItem = {
                linkId: (0, uuid_1.v4)(),
                userId: user.userId,
                originalLink: body.originalLink,
                shortedLink,
                oneTime,
                creationDate,
                expireDate,
                isActive: true,
                visits: 0
            };
            const params = {
                TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
                Item: (0, util_dynamodb_1.marshall)(newLinkItem || {})
            };
            const createResult = yield db_1.db.send(new client_dynamodb_1.PutItemCommand(params));
            if (!createResult) {
                throw apiError_1.ApiError.BadRequest('Something went wrong');
            }
            if (!newLinkItem.oneTime) {
                yield shedulerService_1.default.linkDeactivateScheduler(String(process.env.FUNC_ARN), String(process.env.ROLE_ARN), newLinkItem, user);
            }
            return newLinkItem;
        });
    }
    redirectLink(shortedLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield this.getLinkByShort(shortedLink);
            if (!link) {
                throw apiError_1.ApiError.NotFound("Link not found!!");
            }
            const user = yield userService_1.default.getUserById(link.userId);
            if (!user) {
                throw apiError_1.ApiError.NotFound("Link owner not found!!");
            }
            if (link.isActive === false) {
                throw apiError_1.ApiError.BadRequest('Link is not active!');
            }
            // update visits count
            const updatedVisitsLink = yield this.updateLinkVisits(link);
            if (link.oneTime) {
                const deactivatedLink = yield this.deactivateLink(link.shortedLink, user);
                //send an email
                yield sqsService_1.default.deactivateEmail(String(process.env.QUEUE_URL), user.email, link.linkId);
            }
            return link;
        });
    }
    deactivateLink(shortedLink, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield this.getLinkByShort(shortedLink);
            if (!link) {
                throw apiError_1.ApiError.NotFound("Link not found!!");
            }
            // deactivate link
            const updateParams = {
                TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
                Key: {
                    linkId: { S: link.linkId }
                },
                UpdateExpression: "SET isActive = :isActive,expireDate = :expireDate",
                ExpressionAttributeValues: {
                    ":isActive": {
                        BOOL: false
                    },
                    ":expireDate": {
                        S: "null"
                    }
                },
                ReturnValues: "ALL_NEW",
            };
            const updatedLink = yield db_1.db.send(new client_dynamodb_1.UpdateItemCommand(updateParams));
            if (!updatedLink.Attributes) {
                throw apiError_1.ApiError.BadRequest('Something went wrong!');
            }
            const deactivatedLink = (0, util_dynamodb_1.unmarshall)(updatedLink.Attributes);
            yield sqsService_1.default.deactivateEmail(String(process.env.QUEUE_URL), user.email, link.linkId);
            return deactivatedLink;
        });
    }
    reactiveLink(shortedLink, expireTime, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield this.getLinkByShort(shortedLink);
            if (!link) {
                throw apiError_1.ApiError.NotFound('Link not found!');
            }
            if (!link.oneTime && expireTime === 'one-time') {
                throw apiError_1.ApiError.BadRequest('Invalid expireTime for not one-time link');
            }
            const { creationDate, expireDate } = yield (0, dateConverter_1.dateConvert)(expireTime);
            const updateParams = {
                TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
                Key: {
                    linkId: { S: link.linkId }
                },
                UpdateExpression: "SET isActive = :isActive, expireDate = :expireDate",
                ExpressionAttributeValues: {
                    ":isActive": {
                        BOOL: true
                    },
                    ":expireDate": {
                        S: `${expireDate}`
                    }
                },
                ReturnValues: "ALL_NEW",
            };
            const updatedLink = yield db_1.db.send(new client_dynamodb_1.UpdateItemCommand(updateParams));
            if (!updatedLink.Attributes) {
                throw apiError_1.ApiError.BadRequest('Something went wrong!');
            }
            const reactivatedLink = (0, util_dynamodb_1.unmarshall)(updatedLink.Attributes);
            return reactivatedLink;
        });
    }
    getLinkByOrig(originalLink, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existsLinkParams = {
                TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
                FilterExpression: "originalLink = :originalLink AND userId = :userId",
                ExpressionAttributeValues: {
                    ":originalLink": { S: `${originalLink}` },
                    ":userId": { S: `${userId}` }
                }
            };
            const { Items } = yield db_1.db.send(new client_dynamodb_1.ScanCommand(existsLinkParams));
            if (!(Items === null || Items === void 0 ? void 0 : Items.length)) {
                return null;
            }
            const linkItem = (0, util_dynamodb_1.unmarshall)(Items[0]);
            return linkItem;
        });
    }
    getLinkByShort(shortedLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
                FilterExpression: "shortedLink = :shortedLink",
                ExpressionAttributeValues: {
                    ":shortedLink": { S: `${shortedLink}` }
                }
            };
            const { Items } = yield db_1.db.send(new client_dynamodb_1.ScanCommand(params));
            if (!(Items === null || Items === void 0 ? void 0 : Items.length)) {
                return null;
            }
            const linkItem = (0, util_dynamodb_1.unmarshall)(Items[0]);
            return linkItem;
        });
    }
    updateLinkVisits(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateVisitsParams = {
                TableName: process.env.DYNAMODB_LINKS_TABLE_NAME,
                Key: {
                    linkId: { S: link.linkId }
                },
                UpdateExpression: "SET visits = :visits",
                ExpressionAttributeValues: {
                    ":visits": {
                        N: `${link.visits + 1}`
                    }
                },
                ReturnValues: "ALL_NEW",
            };
            const updatedVisits = yield db_1.db.send(new client_dynamodb_1.UpdateItemCommand(updateVisitsParams));
            if (!updatedVisits.Attributes) {
                throw apiError_1.ApiError.BadRequest('Something went wrong!');
            }
            const updatedVisitsLink = (0, util_dynamodb_1.unmarshall)(updatedVisits.Attributes);
            return updatedVisitsLink;
        });
    }
}
const linkService = new LinkService();
exports.default = linkService;
