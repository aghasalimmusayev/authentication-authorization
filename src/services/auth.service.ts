import { hashPassword } from 'utils/hash'
import { cleanUpTokens, generateAccessToken, generateRefreshToken, saveToken, verifyPassword, verifyRefreshToken } from 'utils/jwt'
import { AuthModel } from 'models/AuthModel'
import { Role } from 'types/types'

async function register(username: string, email: string, password_hash: string) {
    try {
        const hashed_password = await hashPassword(password_hash)
        const user = await AuthModel.registerModel(username, email, hashed_password)
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: Role.USER,
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
    } catch (error: any) {
        if (error.code === '23505') return {
            success: false,
            error: 'Bu username ve ya email artiq istifade olunur'
        }
        throw error
    }
}

async function login(usernameOrEmail: string, password: string) {
    try {
        const user = await AuthModel.loginModel(usernameOrEmail)
        console.log('user:', user)
        if (!user) return {
            success: false,
            error: 'Bele istifadeci yoxdu'
        }
        const verifiedPassword = await verifyPassword(password, user.password_hash)
        if (!verifiedPassword) return {
            success: false,
            error: 'Password invalid'
        }
        await cleanUpTokens(user.id)
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: Role.USER,
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
                organization_id: user.organization_id
            },
            accessToken,
            refreshToken
        }
    } catch (err) {
        console.error('Login error: ', err)
        throw err
    }
}
export type RefreshResult =
    | { success: true; accessToken: string }
    | { success: false; error: string };

async function refreshAccessToken(token: string): Promise<RefreshResult> {
    const result = await verifyRefreshToken(token)
    if (!result) return { success: false, error: "Invalid or expired refresh token" }
    const accessToken = generateAccessToken({
        id: result.user_id,
        email: result.email,
        role: result.role,
        organization_id: result.organization_id
    })
    return { success: true, accessToken: accessToken }
}

async function logout(refreshToken: string, harddelete: boolean = false) {
    if (!refreshToken) throw new Error("No token provided")
    if (harddelete) await AuthModel.logoutAllModel(refreshToken)
    else await AuthModel.logoutModel(refreshToken)
    return { success: true }
}

export { register, login, refreshAccessToken, logout }

