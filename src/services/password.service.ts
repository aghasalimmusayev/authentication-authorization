import { AppError } from "errors/error"
import { AuthModel } from "models/AuthModel"
import { Password } from "models/Password.model"
import { comparePassword, hashPassword } from "utils/hash"
import crypto from 'crypto'
import { resetPasswordLink } from "utils/mailer"

async function changePass(userId: string, newPass: string, oldPass: string) {
    const user = await AuthModel.findUserById(userId)
    if (!user) throw new AppError('Unauthorized', 401)
    const checkOldPass = await comparePassword(oldPass, user.password_hash)
    if (!checkOldPass) throw new AppError('Your password is not correct', 409)
    if (newPass === oldPass) throw new AppError('The new password can not be the same', 409)
    const hashedPassword = await hashPassword(newPass)
    await Password.updatePass(hashedPassword, userId)
    return { message: 'You have succesfully changed your password' }
}

async function forgetPasswordService(email: string) {
    const user = await AuthModel.findUserByEmail(email)
    if (!user) throw new AppError('User not found', 404)
    const token = crypto.randomBytes(32).toString('hex')
    const hashToken = crypto.createHash('sha256').update(token).digest('hex')
    const expires = new Date(Date.now() + 5 * 60 * 1000)
    await Password.resetTokenExpires(email, hashToken, expires)
    await resetPasswordLink(email, token)
    return { success: true, message: 'The password reset link has been sent to mail' }
}

async function resetPasswordService(resetCode: string, newPassword: string) {
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex')
    const result = await Password.findResetToken(hashedResetCode)
    if (!result) throw new AppError('Reset code not found', 404)
    if (new Date(result.reset_expires_at) < new Date()) throw new AppError('Reset time has expired', 410)
    const hashNewPassword = await hashPassword(newPassword)
    await Password.setNewPassword(hashNewPassword, result.id)
    return { success: true, message: 'Your new password has created' }
}

export { changePass, forgetPasswordService, resetPasswordService }