import { Permissions } from "types/types";

export function permissionKey(resource: string, action: string): string {
    return `${resource}:${action}`
}

export function buildPermsSet(rows: Permissions[]): Set<string> {
    const perms = new Set<string>()
    for (const p of rows) {
        perms.add(`${p.resource}:${p.action}`)
    }
    return perms
}

export function checkPermission(perms: Set<string>, resource: string, action: string) {
    if (perms.has(`${resource}:${action}`)) return true
    if (perms.has(`${resource}:manage`)) return true
    if (action === "read" && perms.has(`${resource}:read:all`)) return true
    if (action === "update" && perms.has(`${resource}:update:all`)) return true
    if (action === "delete" && perms.has(`${resource}:delete:all`)) return true
    if (action === "view" && (perms.has(`${resource}:read`) || perms.has(`${resource}:read:all`))) return true
    return false
}