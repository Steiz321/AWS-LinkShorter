import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqs } from "../config/sqs";


class SqsService {
    async deactivateEmail(queueUrl: string, email: string, linkId: string) {
        //send an email
        const sqsParams = {
            QueueUrl: `${queueUrl}`,
            MessageBody: JSON.stringify({
                email: email,
                message: `Your link with id: "${linkId}" has been deactivated!`
            })
        }

        return sqs.send(new SendMessageCommand(sqsParams));
    }
}

const sqsService = new SqsService();
export default sqsService;