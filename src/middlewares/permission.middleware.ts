import { AuthRequest } from "types/types"
import { Response, NextFunction } from "express"
import { getOrgId, per } from "models/Permission.model";

export const requirePermission = (permissionName: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userId = req.user.id;
            const orgId = await getOrgId(req.user.id)
            if (!orgId) {
                return res.status(403).json({ message: "Organization not found for user" });
            }
            const result = await per(userId, orgId, permissionName)
            if (result === 0) return res.status(403).json({ message: "forbidden" });
            return next();
        } catch (err) {
            return res.status(500).json({ message: "Permission check failed" });
        }
    };
};
