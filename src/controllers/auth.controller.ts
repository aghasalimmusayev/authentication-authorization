import { NextFunction, Request, Response } from "express";
import { changePass, login, logout, profile, refreshAccessToken, register } from "../services/auth.service";
import { AuthRequest } from "types/types";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, email, password_hash } = req.body
        if (!username || !email || !password_hash) {
            return res.status(400).json({
                type: "application/problem+json",
                status: 400,
                title: "Bad Request",
                detail: "Username, email or password require"
            })
        }
        const result = await register(username, email, password_hash)
        if (!result.success) {
            return res.status(409).json({
                type: "application/problem+json",
                status: 409,
                title: "Conflict",
                detail: result.error
            })
        }
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(201).json({
            message: "User registered succesfully",
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        })
    } catch (err) {
        return next(err)
    }
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, email, password_hash } = req.body
        // console.log(req.body)
        const identity = username ?? email
        if (!identity || !password_hash) return res.status(400).json({
            type: "application/problem+json",
            status: 400,
            title: "Bad request",
            detail: "Email and Password are require"
        })
        const result = await login(identity, password_hash)
        if (!result.success) return res.status(401).json({
            type: "application/problem+json",
            status: 401,
            title: "Unauthorized",
            detail: result.error
        })
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Login Succesful",
            user: result.user,
            // refreshToken: result.refreshToken, // cookie-de saxlanilmalidi
            accessToken: result.accessToken
        })
    } catch (err) {
        return next(err)
    }
}

export async function logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) return res.status(401).json({ message: "No token provided" })
        await logout(refreshToken, false)
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        return res.status(200).json({ success: true, message: "You logged out" })
    } catch (err) {
        return next(err)
    }
}

export async function logoutAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) return res.status(401).json({ message: "No token provided" })
        await logout(refreshToken, true)
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        return res.status(200).json({ success: true, message: 'You have logged out from all your devices' })
    } catch (err) {
        return next(err)
    }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken as string | undefined
        if (!refreshToken) return res.status(401).json({ message: "Token time expired" })
        const result = await refreshAccessToken(refreshToken)
        if (!result.success) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict'
            })
            return res.status(401).json({ message: result.error })
        }
        return res.status(200).json({ accessToken: result.accessToken })
    } catch (err) {
        return next(err)
    }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) return res.status(401).json({
            type: "application/problem+json",
            status: 401,
            title: "Unauthorized",
            detail: "You didn`t logged in"
        })
        return res.status(200).json({ user: req.user })
    } catch (err) {
        return next(err)
    }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const user = profile(req.user!.id)
        if (!user) return res.status(401).json({
            type: "application/problem+json",
            status: 401,
            title: "Unauthorized",
            detail: "You didn`t logged in"
        })
        return res.status(200).json(user)
    } catch (err) {
        return next(err)
    }
}

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