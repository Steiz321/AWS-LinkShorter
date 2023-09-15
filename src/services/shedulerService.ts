import { CreateScheduleCommand, SchedulerClient } from "@aws-sdk/client-scheduler";
import { ILink } from "../types/link";
import { UserJwtPayload } from "../types/user";


class ShedulerService {
    async linkDeactivateScheduler(funcArn: string, roleArn: string, link: ILink, user: UserJwtPayload): Promise<any> {
        const client = new SchedulerClient({});
    
        const scheduleParams = {
            Name: `deactivateScheduler-${link.linkId}`,
            ScheduleExpression: `at(${link.expireDate})`,
            Target: {
                Arn: `${funcArn}`,
                RoleArn: `${roleArn}`,
                Input: JSON.stringify({shortedLink: link.shortedLink, user}),
            },
            FlexibleTimeWindow: {
                Mode: "OFF",
            },
            State: "ENABLED",
        }
    
        return client.send(new CreateScheduleCommand(scheduleParams));
    }
}

const shedulerService = new ShedulerService();
export default shedulerService;