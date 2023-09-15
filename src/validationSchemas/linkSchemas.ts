import { z } from 'zod';

export const createLinkSchema = z.object({
    originalLink: z.string().url({ message: "Invalid url" }),
    expireTime: z.string()
})