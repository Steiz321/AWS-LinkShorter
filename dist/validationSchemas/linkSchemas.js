"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkSchema = void 0;
const zod_1 = require("zod");
exports.createLinkSchema = zod_1.z.object({
    originalLink: zod_1.z.string().url({ message: "Invalid url" }),
    expireTime: zod_1.z.string()
});
