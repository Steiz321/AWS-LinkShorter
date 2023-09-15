"use strict";
// import { sqs } from "../config/sqs";
// import { SendMessageCommand } from "@aws-sdk/client-sqs";
// export const deactivateEmail = async (queueUrl: string, email: string, linkId: string) => {
//     //send an email
//     const sqsParams = {
//         QueueUrl: `${queueUrl}`,
//         MessageBody: JSON.stringify({
//             email: email,
//             message: `Your link with id: "${linkId}" has been deactivated!`
//         })
//     }
//     return sqs.send(new SendMessageCommand(sqsParams));
// }
