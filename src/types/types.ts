import { Request } from "express"

export type RegisterDto = {
    username?: string
    email: string,
    password_hash: string,
    role?: Role
}

export type LoginDto = {
    email: string,
    password: string,
}

export interface AuthRequest extends Request {
    user?: {
        id: string,
        email: string,
        role?: Role
    },
    orgId?: string
}

export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

export interface JwtPayload {
    id: string,
    email: string,
    type?: 'access' | 'refresh',
    role: Role
}

export type Permissions = {
    resource: string,
    action: string
}