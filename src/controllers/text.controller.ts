import { Request, Response, NextFunction } from "express"
import { getUserPermissions } from "services/permissions.service"
import { buildPermsSet } from "utils/permissions"

export async function userPermissions(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await getUserPermissions('1', '1')
        if (!result) {
            return res.status(409).json({ message: 'no result' })
        }
        res.status(201).json(result)
    } catch (err) {
        return next(err)
    }
}


export async function getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
        const rows = await getUserPermissions('1', '1')
        const perms = buildPermsSet(rows)
        return res.status(200).json([...perms])
    } catch (error) {
        next(error)
    }
}