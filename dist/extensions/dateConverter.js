"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateConvert = void 0;
const dateConvert = (expireTime) => {
    let creationDate = new Date(Date.now()).toISOString();
    let multiplyer;
    switch (expireTime) {
        case '1m':
            let expireDate = new Date(Date.now() + 1000 * 60).toISOString().substring(0, 19);
            return {
                creationDate,
                expireDate
            };
            break;
        case '1d':
            multiplyer = 1;
            break;
        case '3d':
            multiplyer = 3;
            break;
        case '7d':
            multiplyer = 7;
            break;
        case 'one-time':
            return {
                creationDate: 'null',
                expireDate: 'null'
            };
            break;
        default:
            throw new Error('invalid link lifetime!');
            break;
    }
    let expireDate = new Date(Date.now() + multiplyer * 1000 * 60 * 60 * 24).toISOString().substring(0, 19);
    return {
        creationDate,
        expireDate
    };
};
exports.dateConvert = dateConvert;
