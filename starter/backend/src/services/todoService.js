import TodoRepository from '../repository/todoRepository'
import { createLogger } from '../utils/logger.mjs';

export class TodoService {
    constructor() {
        this.repo = new TodoRepository();
        this.logger = createLogger('todoService')
    }

    async getAll() {
        return await this.repo.getAll();
    }
    
    async get(todoId) {
        return await this.repo.get(todoId);
    }
    
    async insert(todoEntity) {
        await this.repo.insert(todoEntity);
    }
    
    async update(todoId, todoEntity) {
        
    }
    
    async remove(todoId) {
        return await this.repo.remove(todoId);
    }
}
