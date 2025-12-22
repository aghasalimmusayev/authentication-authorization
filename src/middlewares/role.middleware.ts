import { Response, NextFunction } from "express"
import { AuthRequest, Role } from "types/types"

export function requireRole(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        if (!req.user.role) return res.status(403).json({ message: "Forbidden" })
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" })
        }
        next()
    }
}

