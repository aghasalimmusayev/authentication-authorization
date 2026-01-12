import { Request, Response, NextFunction } from "express";
import { AuthModel } from "models/AuthModel";
import { AuthRequest } from "types/types";

export const privateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id ?? req.user?.id
        if (!userId) return res.status(400).json({
            type: "application/problem+json",
            status: 400,
            title: "Bad Request",
            detail: "User Id is required"
        })
        const myUser = req.user
        if (!myUser) return res.status(401).json({
            type: "application/problem+json",
            status: 401,
            title: "Unauthorized",
            detail: "Unauthorized"
        })
        if (userId === myUser?.id) return next()
        const user = await AuthModel.findUserById(userId)
        if (!user) return res.status(404).json({
            type: "application/problem+json",
            status: 401,
            title: "Not found",
            detail: "User not found"
        })
        if (user.is_private) return res.status(403).json({
            type: "application/problem+json",
            status: 403,
            title: "Forbidden",
            detail: "This profile is Private"
        })
        return next()
    } catch (err) {
        next(err)
    }
}



