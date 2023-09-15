import { VerifyEmailAddressCommand } from "@aws-sdk/client-ses";
import { ses } from "../config/ses";
import { ApiError } from "../extensions/apiError";
import { isEmailVerified } from "../extensions/isEmailVerified";
import emailService from "../services/emailService";


export const verifyEmail = async () => {
    try {
        const email = String(process.env.SENDER_EMAIL);

        const isVerified = await isEmailVerified(email);
        
        if(!isVerified) {
            await emailService.verifyEmail(email);
            console.log(`Email address ${email} verification initiated.`);
        } else {
            console.log('user already verificated')
        }
    } catch(err) {
        console.error(`Error verifying sender email address`)
        throw ApiError.BadRequest(`Error verifying sender email address`);
    }
    console.log('from hook');
}

verifyEmail();