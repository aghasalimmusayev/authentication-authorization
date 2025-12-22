import { createTodo, deleteTodo } from "controllers/todo.controller";
import { Router } from "express";
import { authMiddleware } from "middlewares/auth.middleware";
import { rateLimiter } from "utils/helper";

const todoRoute = Router()

todoRoute.post('/todo', authMiddleware, rateLimiter(10, 3), createTodo)
todoRoute.delete('/todo/:id', authMiddleware, deleteTodo)

export default todoRoute