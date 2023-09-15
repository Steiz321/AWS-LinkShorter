"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ses = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
exports.ses = new client_ses_1.SESClient({});
