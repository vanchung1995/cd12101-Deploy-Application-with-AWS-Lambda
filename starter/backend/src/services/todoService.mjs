import {TodoRepository} from '../repository/todoRepository.mjs'

export class TodoService {
    constructor() {
        this.repo = new TodoRepository();
    }

    async getAll(userId) {
        return await this.repo.getAll(userId);
    }
    
    async get(todoId, userId) {
        return await this.repo.get(todoId, userId);
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
