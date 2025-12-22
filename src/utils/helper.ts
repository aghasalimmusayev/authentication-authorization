import { per } from "models/Permission.model"
import rateLimit from "express-rate-limit"

export async function hasPerm(userId: string, orgId: number, permissionName: string): Promise<boolean> {
    const result = await per(userId, orgId, permissionName)
    return result > 0
}

export const rateLimiter = (second: number, maxRequest: number) => {
    return rateLimit({
        windowMs: second * 1000,
        max: maxRequest,
        message: `Too many request. Try again ${second} sec later`,
        standardHeaders: true,
        legacyHeaders: true
    })
}