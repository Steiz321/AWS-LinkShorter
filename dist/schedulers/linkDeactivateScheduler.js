"use strict";
// import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler";
// import { UserJwtPayload } from "../types/user";
// import { ILink } from "../types/link";
// export const linkDeactivateScheduler = async (funcArn: string, roleArn: string, link: ILink, user: UserJwtPayload): Promise<any> => {
//     const client = new SchedulerClient({});
//     const scheduleParams = {
//         Name: `deactivateScheduler-${link.linkId}`,
//         ScheduleExpression: `at(${link.expireDate})`,
//         Target: {
//             Arn: `${funcArn}`,
//             RoleArn: `${roleArn}`,
//             Input: JSON.stringify({shortedLink: link.shortedLink, user}),
//         },
//         FlexibleTimeWindow: {
//             Mode: "OFF",
//         },
//         State: "ENABLED",
//     }
//     return client.send(new CreateScheduleCommand(scheduleParams));
// }
