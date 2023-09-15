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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerFunc = void 0;
const emailService_1 = __importDefault(require("../../services/emailService"));
const handlerFunc = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const record of event.Records) {
            const { email, message } = JSON.parse(record.body);
            yield emailService_1.default.sendDeactivateMail(email, message);
        }
    }
    catch (err) {
        console.error(err);
    }
});
exports.handlerFunc = handlerFunc;
