import pool from "db/connection"

export async function getUserPermissions(userId: string, orgId: number) {
    const result = await pool.query(`
        SELECT distinct p.resource, p.action
            FROM user_roles ur
            JOIN role_permissions rp ON rp.role_id = ur.role_id
            JOIN permissions p ON p.id = rp.permission_id
            WHERE ur.user_id = $1 AND ur.organization_id = $2
        `, [userId, orgId])
    console.log(result.rows)
    return result.rows
}
