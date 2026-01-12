import pool from "db/connection";

export class TodoModel {
    static async create(userId: string, title: string, description: string, organization_id: number) {
        const result = await pool.query(`
            insert into todos (user_id, title, description, is_completed, created_at, updated_at, organization_id) 
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

    static async completeTodo(id: string, user_id: string) {
        const result = await pool.query(`
            update todos set is_completed = NOT is_completed where id = $1 and user_id = $2 returning *`, [id, user_id])
        return result.rows[0]
    }
}

