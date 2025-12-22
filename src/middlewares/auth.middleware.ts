import { Response, NextFunction } from "express";
import { AuthRequest } from "types/types";
import { verifyToken } from "utils/jwt";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({
        type: "application/problem+json",
        status: 401,
        title: "Unauthorized",
        detail: "Authorization header missing"
    })
    const [type, token] = auth.split(" ")
    // auth string-bele olur: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    // split[1] onu bosluga gore parcalayib goturur
    if (type !== "Bearer" || !token) return res.status(401).json({
        type: "application/problem+json",
        status: 401,
        title: "Unauthorized",
        detail: "Invalid authorization format"
    })
    try {
        const decoded = verifyToken(token) // accesstoken
        req.user = decoded
        req.organization_id = decoded.organization_id
        next()
    } catch (err) {
        return res.status(401).json({
            type: "application/problem+json",
            status: 401,
            title: "Unauthorized",
            detail: "Invalid or expired token"
        })
    }
}