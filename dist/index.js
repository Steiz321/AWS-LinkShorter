"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const start = (event) => {
    let response = { statusCode: 200 };
    try {
        response.body = {
            message: 'API started!!'
        };
    }
    catch (err) {
        response.statusCode = 500;
        response.body = {
            message: 'Error starting API!'
        };
    }
    return response;
};
exports.start = start;
