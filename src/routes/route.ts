import { loginUser, logoutAllDevices, logoutUser, me, refreshToken, registerUser } from "controllers/auth.controller";
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.middleware";
import { requireRole } from "middlewares/role.middleware";
import { Role } from "types/types";
import { createUserController } from "controllers/admin.controller";
import { getPermissions, userPermissions } from "controllers/permission.controller";
import { requirePermission } from "middlewares/permission.middleware";
import { AuthRequest } from "types/types";
const route = Router()

// Private routes
route.post('/register', registerUser) // ✅
route.post('/login', loginUser) // ✅
route.post('/logout', logoutUser) // ✅
route.post('/refresh', refreshToken) // ✅

// Protected routes
route.get('/me', authMiddleware, me) // ✅
route.post('/logout-all', logoutAllDevices) // ✅
route.post('/admin/users', authMiddleware, requireRole(Role.ADMIN), createUserController)

// Test route
// route.get('/perm-test', authMiddleware, requirePermission('todo', 'delete:all'),
//     (req: AuthRequest, res) => {
//         res.status(200).json({ ok: true, user: req.user, organization_id: req.organization_id })
//     }
// )

export default route

