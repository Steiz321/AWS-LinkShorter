import { ListIdentitiesCommand, SendEmailCommand, VerifyEmailAddressCommand } from "@aws-sdk/client-ses";
import { ses } from "../config/ses";
import { ApiError } from "../extensions/apiError";


class EmailService {
    async getVerifyedEmails() {
        const listIdentitiesCommand = new ListIdentitiesCommand({});
        
        const result = await ses.send(listIdentitiesCommand);

        if(!result || !result.Identities) {
            throw ApiError.NotFound('list is empty!');
        }

        return result.Identities;
    }

    async verifyEmail(email: string) {
        const params = {
            EmailAddress: email,
        };

        await ses.send(new VerifyEmailAddressCommand(params));
    }

    async sendDeactivateMail(email: string, message: string) {
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
        }
        
        await ses.send(new SendEmailCommand(emailParams));
    }
}

const emailService = new EmailService();
export default emailService;