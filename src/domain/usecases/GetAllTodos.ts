// USE CASE : Logica de negocio especifica de la aplicacion
// Orquesta operaciones pero no conoce la implementacion de los repositorios

import { Todo } from "../entities/Todo";
import { TodoRepository } from "../repositories/TodoRepository";

export class GetAllTodos {
    constructor(private repository: TodoRepository) {}

    async execute(): Promise<Todo[]> {
        return await this.repository.getAll();
    }
}