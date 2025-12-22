import pool from "db/connection";

export async function getOrgId(userId: string): Promise<number> {
    const result = await pool.query(`select organization_id from users where id = $1`, [userId])
    return result.rows[0].organization_id
}

export async function per(userId: string, orgId: number, permissionName: string): Promise<number> {
    const result = await pool.query(`
        select p.name from user_roles ur
        join role_permissions rp on rp.role_id = ur.role_id
        join permissions p on p.id = rp.permission_id
        where ur.user_id = $1 and ur.organization_id = $2 and p.name = $3`, [userId, orgId, permissionName])
    return result.rowCount ?? 0
}

export async function findTodoById(todoId: string) {
    const result = await pool.query(`select id, user_id, organization_id from todos where id = $1`, [todoId])
    return result.rows[0]
}

export async function member(userId: string, orgId: number) {
    const result = await pool.query(`select * from users where id = $1 and organization_id = $2`, [userId, orgId])
    return result.rowCount
}