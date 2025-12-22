import { member } from "models/Permission.model";
import { TodoModel } from "models/Todo.model";

export async function createTodoService(userId: string, title: string, description: string, orgId: number) {
    const isMember = await member(userId, orgId)
    if (!isMember) throw new Error('You are not an active member of this organization');
    const todo = await TodoModel.create(userId, title, description ?? null, orgId);
    if (!todo) throw new Error('Failed to create todo in database');
    return todo;
}

export async function deleteTodoService(id: string) {
    const todo = await TodoModel.findById(id)
    if (!todo) throw new Error('Todo not found')
    const deletedTodo = await TodoModel.delete(id)
    if (deletedTodo === 0) throw new Error('Something went wrong in deletind Todo')
    return true
}

