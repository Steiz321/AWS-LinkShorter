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
const client_sqs_1 = require("@aws-sdk/client-sqs");
const sqs_1 = require("../config/sqs");
class SqsService {
    deactivateEmail(queueUrl, email, linkId) {
        return __awaiter(this, void 0, void 0, function* () {
            //send an email
            const sqsParams = {
                QueueUrl: `${queueUrl}`,
                MessageBody: JSON.stringify({
                    email: email,
                    message: `Your link with id: "${linkId}" has been deactivated!`
                })
            };
            return sqs_1.sqs.send(new client_sqs_1.SendMessageCommand(sqsParams));
        });
    }
}
const sqsService = new SqsService();
exports.default = sqsService;
