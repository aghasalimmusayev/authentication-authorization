import pool from "db/connection";
import { RegisterDto } from "types/types";
const DEFAULT_ORG_ID = Number(process.env.DEFAULT_ORG_ID ?? 1)

export class AuthModel {

    static async registerModel(username: string, email: string, password_hash: string) {
        const result = await pool.query(`insert into users (username, email, password_hash, organization_id) 
            values ($1, $2, $3, $4) 
            returning id, username, email, organization_id, created_at`, [username, email, password_hash, DEFAULT_ORG_ID])
        return result.rows[0]
    }

    static async create(data: RegisterDto) {
        const result = await pool.query(`insert into users (username, email, password_hash, role, organization_id) 
            values ($1, $2, $3, $4, $5) 
            returning id, username, email, role, organization_id, created_at`,
            [data.username, data.email, data.password_hash, data.role, DEFAULT_ORG_ID])
        return result.rows[0]
    }

    static async loginModel(usernameOrEmail: string) {
        const result = await pool.query(`select * from users where username = $1 or email = $1`, [usernameOrEmail])
        return result.rows[0]
    }

    static async logoutAllModel(refreshToken: string) {
        const token = await pool.query(`select user_id from refresh_tokens where token = $1`, [refreshToken])
        if (token.rowCount === 0) throw new Error('UserId not found')
        const result = await pool.query(`delete from refresh_tokens where user_id = $1 returning *`, [token.rows[0].user_id])
        return result.rows[0]
    }

    static async logoutModel(refreshToken: string) {
        const result = await pool.query(`update refresh_tokens set is_revoked = true where token = $1 returning *`, [refreshToken])
        return result.rows[0]
    }

    static async findUserById(userId: string) {
        const result = await pool.query(`select * from users where id = $1`, [userId])
        return result.rows[0]
    }

    static async updatePass(newPass: string, userId: string) {
        const result = await pool.query(`update users set password_hash = $1 where id = $2`, [newPass, userId])
        return result.rows[0]
    }

}