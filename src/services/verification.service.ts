import { AppError } from "errors/error";
import { VerificationModel } from "models/verification.model";
import { sendCodeToMail, sendVerificatedMailToUser } from "utils/mailer";
import { generateOtp } from "utils/otp";

export async function sendOtpCode(email: string) {
    const code = generateOtp()
    const expires = new Date(Date.now() + 5 * 60 * 1000)
    await VerificationModel.sendOtpCode(code, expires, email)
    await sendCodeToMail(email, code)
}

export async function verificateEmail(email: string, code: string) {
    const user = await VerificationModel.findUserByEmail(email)
    if (!user) throw new AppError('User not found')
    if (user.is_verified) throw new AppError('This user is already verified')
    if (user.email_verification_code !== code) throw new AppError('Otp code is invalid')
    if (user.email_verification_expires < new Date()) throw new AppError('Time has Expired')
    await VerificationModel.verifyEmail(email)
    await sendVerificatedMailToUser(email, user.username)
}
