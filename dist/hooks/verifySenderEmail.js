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
exports.verifyEmail = void 0;
const apiError_1 = require("../extensions/apiError");
const isEmailVerified_1 = require("../extensions/isEmailVerified");
const emailService_1 = __importDefault(require("../services/emailService"));
const verifyEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = String(process.env.SENDER_EMAIL);
        const isVerified = yield (0, isEmailVerified_1.isEmailVerified)(email);
        if (!isVerified) {
            yield emailService_1.default.verifyEmail(email);
            console.log(`Email address ${email} verification initiated.`);
        }
        else {
            console.log('user already verificated');
        }
    }
    catch (err) {
        console.error(`Error verifying sender email address`);
        throw apiError_1.ApiError.BadRequest(`Error verifying sender email address`);
    }
    console.log('from hook');
});
exports.verifyEmail = verifyEmail;
(0, exports.verifyEmail)();
