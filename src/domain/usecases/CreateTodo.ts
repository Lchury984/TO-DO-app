import { CreateTodoDTO, Todo } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class CreateTodo {
    constructor(private repository: TodoRepository) {}

    async execute(data: CreateTodoDTO): Promise<Todo> {
      // Lógica de negocio para crear un Todo
      if (!data.title.trim()) {
        throw new Error("El título no puede estar vacío");
        }

        if (data.title.length > 200) {
        throw new Error("El título es demasiado largo");
        }

        return await this.repository.create(data);
    }
}