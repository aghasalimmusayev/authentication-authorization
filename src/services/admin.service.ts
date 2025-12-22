import { AuthModel } from "models/AuthModel"
import { RegisterDto } from "types/types"
import { hashPassword } from "utils/hash"
import { generateAccessToken, generateRefreshToken, saveToken } from "utils/jwt"

export async function createUser(data: RegisterDto) {
    try {
        const hashedPassword = await hashPassword(data.password_hash)
        const user = await AuthModel.create({
            username: data.username,
            email: data.email,
            password_hash: hashedPassword,
            role: data.role,
            organization_id: data.organization_id
        })
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
            organization_id: user.organization_id
        })
        const refreshToken = generateRefreshToken()
        await saveToken(user.id, refreshToken)
        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                organization_id: user.organization_id
            },
            accessToken,
            refreshToken
        }
    } catch (err: any) {
        if (err.code === '23505') return {
            success: false,
            error: 'Bu username ve ya email artiq istifade olunur'
        }
        throw err
    }
}
