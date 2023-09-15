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
const client_scheduler_1 = require("@aws-sdk/client-scheduler");
class ShedulerService {
    linkDeactivateScheduler(funcArn, roleArn, link, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new client_scheduler_1.SchedulerClient({});
            const scheduleParams = {
                Name: `deactivateScheduler-${link.linkId}`,
                ScheduleExpression: `at(${link.expireDate})`,
                Target: {
                    Arn: `${funcArn}`,
                    RoleArn: `${roleArn}`,
                    Input: JSON.stringify({ shortedLink: link.shortedLink, user }),
                },
                FlexibleTimeWindow: {
                    Mode: "OFF",
                },
                State: "ENABLED",
            };
            return client.send(new client_scheduler_1.CreateScheduleCommand(scheduleParams));
        });
    }
}
const shedulerService = new ShedulerService();
exports.default = shedulerService;
