import {TodoRepository} from '../repository/todoRepository.mjs'

export class TodoService {
    constructor() {
        this.repo = new TodoRepository();
    }

    async getAll() {
        return await this.repo.getAll();
    }
    
    async get(todoId) {
        return await this.repo.get(todoId);
    }
    
    async insert(todoEntity) {
        return await this.repo.insert(todoEntity);
    }
    
    async update(todoId, todoEntity) {
        return this.repo.update(todoId, todoEntity)
    }
    
    async remove(todoId) {
        return await this.repo.remove(todoId);
    }
}
