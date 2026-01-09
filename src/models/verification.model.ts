import pool from "db/connection";

export class VerificationModel {

    static async sendOtpCode(code: string, expires: Date, email: string) {
        const result = await pool.query(`
            update users set email_verification_code = $1, email_verification_expires = $2
            where email = $3`, [code, expires, email])
    }

    static async findUserByEmail(email: string) {
        const result = await pool.query(`select * from users where email = $1`, [email])
        return result.rows[0]
    }

    static async checkExpires(expires: Date) {
        const result = await pool.query(`select 1 WHERE $1 < NOW()`, [expires])
        return Number(result.rowCount) > 0
    }

    static async verifyEmail(email: string) {
        const result = await pool.query(`
            update users set is_verified = true, email_verification_code = null, email_verification_expires = null
            where email = $1`, [email])
    }
}