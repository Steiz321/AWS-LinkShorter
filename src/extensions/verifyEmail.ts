import { ses } from "../config/ses";
import { VerifyEmailAddressCommand } from '@aws-sdk/client-ses'
import emailService from "../services/emailService";

export const verifyEmailAddress = async (email: string) => {
    try {
        await emailService.verifyEmail(email);
        console.log(`Email address ${email} verification initiated.`);
    } catch (error) {
        console.error(`Error verifying email address ${email}:`, error);
    }
};