import { Response, NextFunction } from "express"
import { getUserPermissions } from "services/permissions.service"
import { AuthRequest, Role } from "types/types"
import { buildPermsSet, checkPermission } from "utils/permissions"

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

export const requirePermission = (resource: string, action: string) =>
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.orgId) return res.status(401).json({ message: "Unauthorized" })
            const perms = await getUserPermissions(req.user.id, req.orgId)
            const permsSet = buildPermsSet(perms)
            if (!checkPermission(permsSet, resource, action)) return res.status(403).json({ message: "forbidden" })
            return next()
        } catch (error) {
            return next(error)
        }
    }