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
const ses_1 = require("../config/ses");
const client_ses_1 = require("@aws-sdk/client-ses");
const handlerFunc = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('here ses');
    try {
        const { body } = event.Records[0];
        console.log('sqsbody:', body);
        const { message, email } = JSON.parse(body);
        const emailParams = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `${message}`,
                    },
                },
                Subject: {
                    Data: 'Link deactivating alert',
                },
            },
            Source: String(process.env.SENDER_EMAIL)
        };
        console.log('in sqs');
        yield ses_1.ses.send(new client_ses_1.SendEmailCommand(emailParams));
    }
    catch (err) {
        console.error(err);
    }
});
exports.handlerFunc = handlerFunc;
