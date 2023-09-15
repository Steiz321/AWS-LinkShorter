"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqs = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
exports.sqs = new client_sqs_1.SQSClient({});
