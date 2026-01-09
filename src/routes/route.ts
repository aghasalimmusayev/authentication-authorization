import { changePassword, getProfile, loginUser, logoutAllDevices, logoutUser, me, refreshToken, registerUser } from "controllers/auth.controller";
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.middleware";
import { requireRole } from "middlewares/role.middleware";
import { Role } from "types/types";
import { createUserController } from "controllers/admin.controller";
import { rateLimiter } from "utils/helper";

const route = Router()

// Private routes
route.post('/register', registerUser) // ✅
route.post('/login', rateLimiter(10, 3), loginUser) // ✅
route.post('/logout', logoutUser) // ✅
route.post('/refresh', refreshToken) // ✅

// Protected routes
route.get('/me', authMiddleware, me) // ✅
route.get('/profile', authMiddleware, getProfile)
route.patch('/changePassword', authMiddleware, changePassword) // ✅
route.post('/logout-all', logoutAllDevices) // ✅
route.post('/admin/users', authMiddleware, requireRole(Role.ADMIN), createUserController)

export default route

