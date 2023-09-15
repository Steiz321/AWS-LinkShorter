import { ses } from '../../config/ses';
import { SendEmailCommand} from '@aws-sdk/client-ses'
import emailService from '../../services/emailService';

export const handlerFunc = async (event: any): Promise<any> => {
    try {
        for (const record of event.Records) {
            const { email, message } = JSON.parse(record.body);

            await emailService.sendDeactivateMail(email, message);
        }
    } catch(err) {
        console.error(err);
    }
};