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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerFunc = void 0;
const db_1 = require("../../config/db");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const handlerFunc = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response = { statusCode: 200 };
    try {
        const params = {
            TableName: process.env.DYNAMODB_LINKS_TABLE_NAME
        };
        const { Items } = yield db_1.db.send(new client_dynamodb_1.ScanCommand(params));
        response.body = JSON.stringify({
            message: 'Successfully got all links',
            data: Items === null || Items === void 0 ? void 0 : Items.map((item) => (0, util_dynamodb_1.unmarshall)(item)),
            Items
        });
    }
    catch (err) {
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'failed to get all links',
            errorMsg: err.message,
            errStack: err.stack
        });
    }
    return response;
});
exports.handlerFunc = handlerFunc;
