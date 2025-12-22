import pool from "db/connection";

export class TodoModel {
    static async create(userId: string, title: string, description: string, organization_id: number) {
        const result = await pool.query(`
            insert into todos (user_id, title, description, completed, created_at, updated_at, organization_id) 
            values ($1, $2, $3, false, NOW(), null, $4) returning *
            `, [userId, title, description, organization_id])
        return result.rows[0]
    }

    static async findById(id: string) {
        const result = await pool.query(`select * from todos where id = $1`, [id])
        return result.rows[0]
    }

    static async delete(id: string) {
        const result = await pool.query(`delete from todos where id = $1 returning *`, [id])
        return result.rowCount
    }
}

