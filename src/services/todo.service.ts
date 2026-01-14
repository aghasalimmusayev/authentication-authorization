import { AppError } from "errors/error";
import { AuthModel } from "models/AuthModel";
import { member } from "models/Permission.model";
import { TodoModel } from "models/Todo.model";

export async function createTodoService(userId: string, title: string, description: string, orgId: number) {
    const isMember = await member(userId, orgId)
    if (!isMember) throw new AppError('You are not an active member of this organization');
    const todo = await TodoModel.create(userId, title, description ?? null, orgId);
    if (!todo) throw new AppError('Failed to create todo in database');
    return todo;
}

export async function deleteTodoService(id: string) {
    const todo = await TodoModel.findById(id)
    if (!todo) throw new AppError('Todo not found')
    const deletedTodo = await TodoModel.delete(id)
    if (deletedTodo === 0) throw new AppError('Something went wrong in deletind Todo')
    return true
}

export async function completeTodoService(id: string, userId: string) {
    const user = await AuthModel.findUserById(userId)
    if (!user) throw new AppError('User not found', 404)
    const todo = await TodoModel.findById(id)
    if (!todo) throw new AppError('Todo not found', 404)
    const completedTodo = await TodoModel.completeTodo(todo.id, user.id)
    return completedTodo
}

export async function searchTodoService(userId: string, search: string) {
    const user = await AuthModel.findUserById(userId)
    if (!user) throw new AppError('User not found', 404)
    const todo = await TodoModel.search(userId, search)
    if (todo.length === 0) throw new AppError('Todo not found', 404)
    return todo
}
