import { AuthRequest } from "types/types"
import { Response, NextFunction } from "express"
import { profile } from "services/auth.service"
import { changePass, forgetPasswordService, resetPasswordService } from "services/password.service"

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { newPassword, oldPassword } = req.body
        const user = await profile(req.user!.id)
        if (!user) return res.status(401).json({
            type: "application/problem+json",
            status: 401,
            title: "Unauthorized",
            detail: "You didn`t logged in"
        })
        const result = await changePass(user.id, newPassword, oldPassword)
        return res.status(200).json(result)
    } catch (err) {
        return next(err)
    }
}

export async function forgetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ messaje: 'Email is require' })
        const result = await forgetPasswordService(email)
        if (!result.success) return res.status(409).json({ message: 'Sending mail failed' })
        return res.status(200).json(result)
    } catch (err) {
        return next(err)
    }
}

export async function resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { resetCode, newPassword } = req.body
        if (!resetCode || !newPassword) return res.status(400).json({ message: 'ResetCode or NewPassword required' })
        const result = await resetPasswordService(resetCode, newPassword)
        if (!result.success) return res.status(409).json({ message: 'Updating new password failed' })
        return res.status(200).json(result)
    } catch (err) {
        return next(err)
    }
}
