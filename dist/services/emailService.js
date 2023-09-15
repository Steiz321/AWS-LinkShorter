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
const client_ses_1 = require("@aws-sdk/client-ses");
const ses_1 = require("../config/ses");
const apiError_1 = require("../extensions/apiError");
class EmailService {
    getVerifyedEmails() {
        return __awaiter(this, void 0, void 0, function* () {
            const listIdentitiesCommand = new client_ses_1.ListIdentitiesCommand({});
            const result = yield ses_1.ses.send(listIdentitiesCommand);
            if (!result || !result.Identities) {
                throw apiError_1.ApiError.NotFound('list is empty!');
            }
            return result.Identities;
        });
    }
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                EmailAddress: email,
            };
            yield ses_1.ses.send(new client_ses_1.VerifyEmailAddressCommand(params));
        });
    }
    sendDeactivateMail(email, message) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield ses_1.ses.send(new client_ses_1.SendEmailCommand(emailParams));
        });
    }
}
const emailService = new EmailService();
exports.default = emailService;
