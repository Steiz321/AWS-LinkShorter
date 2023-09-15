import emailService from "../services/emailService";

export const isEmailVerified = async (email: string) => {
    try {
        const verifiedEmails = await emailService.getVerifyedEmails();
        
        return verifiedEmails.includes(email);
      } catch (error) {
        console.error('Error checking email verification status:', error);
        throw error;
      }
}