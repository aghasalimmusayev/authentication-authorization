import pool from "db/connection";

export class Password {

    static async updatePass(newPass: string, userId: string) {
        const result = await pool.query(`update users set password_hash = $1 where id = $2 returning *`,
            [newPass, userId])
        return result.rows[0]
    }

    static async resetTokenExpires(email: string, resetCode: string, expiresAt: Date) {
        const result = await pool.query(`
            update users set reset_code = $1, reset_expires_at = $2 where email = $3 returning *`,
            [resetCode, expiresAt, email])
        return result.rows[0]
    }

    static async findResetToken(resetCode: string) {
        const result = await pool.query(`select id, reset_code, reset_expires_at from users where reset_code = $1`, [resetCode])
        return result.rows[0]
    }

    static async setNewPassword(newPassword: string, userId: string) {
        const result = await pool.query(`
            update users set password_hash = $1, reset_code = null, reset_expires_at = null where id = $2 returning *`,
            [newPassword, userId])
        return result.rowCount
    }
}