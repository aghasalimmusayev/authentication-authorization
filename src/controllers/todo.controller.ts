import { Response, NextFunction } from "express";
import { createTodoService, deleteTodoService } from "services/todo.service";
import { AuthRequest } from "types/types";

export async function deleteTodo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })
        const orgId = req.organization_id
        if (!orgId) return res.status(403).json({ message: 'Organization not found for this user' })
        const todoId = req.params.id
        if (!todoId) return res.status(403).json({ message: 'TodoId invalid' })
        await deleteTodoService(todoId)
        return res.status(204)
    } catch (err) {
        next(err)
    }
}

export async function createTodo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })

        const orgId = req.organization_id
        if (!orgId) return res.status(403).json({ message: 'Organization not found for this user' })

        const { title, description } = req.body
        if (!title) return res.status(400).json({ message: "Title required" })

        const todo = await createTodoService(userId, title, description ?? null, orgId)
        if (!todo) return res.status(400).json({ error: "Error in creating Todo" })

        return res.status(201).json({ newTodo: todo, message: 'Todo succesfully created' })
    } catch (err) {
        next(err)
    }
}