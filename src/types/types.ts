import { Request } from "express"

export type RegisterDto = {
    username?: string
    email: string,
    password_hash: string,
    role?: Role,
    organization_id: number
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
    organization_id?: number
}

export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}

export interface JwtPayload {
    id: string
    email: string
    role: Role
    organization_id: number
    type?: "access" | "refresh"
}

export type Permissions = {
    resource: string,
    action: string
}