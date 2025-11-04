import { TodoRepository } from "@/src/domain/repositories/TodoRepository";
import { Todo, CreateTodoDTO, UpdateTodoDTO } from "@/src/domain/entities/Todo";
import { SQLiteTodoDataSource } from "../datasources/SQLiteTodoDataSource";

export class TodoRepositoryImpl implements TodoRepository {
    constructor(private dataSource: SQLiteTodoDataSource) {}

    async getAll(userId: string): Promise<Todo[]> { // Falta el parámetro userId
        return await this.dataSource.getAllTodos(userId);
    }
    async getById(id: string): Promise<Todo | null> {
        return await this.dataSource.getTodoById(id);

    }
    async create(data: CreateTodoDTO): Promise<Todo> { // No se está pasando el userId
        return await this.dataSource.createTodo(data.title, data.userId);
    }
    async update(data: UpdateTodoDTO): Promise<Todo> {
        return await this.dataSource.updateTodo(
            data.id,
            data.completed,
            data.title, 
        );
    }
    async delete(id: string): Promise<void> {
        await this.dataSource.deleteTodo(id);
    }
}