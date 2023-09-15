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
const userSchemas_1 = require("../../validationSchemas/userSchemas");
const userService_1 = __importDefault(require("../../services/userService"));
const handlerFunc = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let response = {
        statusCode: 200
    };
    try {
        const body = JSON.parse(event.body || "");
        // validating body
        userSchemas_1.signUpSchema.parse(body);
        const createdUser = yield userService_1.default.signUp(body.email, body.password);
        response.body = JSON.stringify({
            message: 'User successfully created!',
            data: Object.assign({}, createdUser)
        });
    }
    catch (err) {
        console.error(err);
        response.statusCode = err.status || 500;
        response.body = JSON.stringify({
            message: 'failed to create a user',
            errorMsg: err.message,
            errStack: err.stack
        });
    }
    return response;
});
exports.handlerFunc = handlerFunc;
