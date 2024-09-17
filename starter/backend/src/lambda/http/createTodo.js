import { v4 as uuidv4 } from 'uuid';
import { TodoService } from '../../services/todoService.mjs';

const todoService = new TodoService();

export async function handler(event) {
  const newTodo = JSON.parse(event.body)

  const todoId = uuidv4()
  createdAt = new Date();
  const done = false;
  const newItem = {
    todoId,
    createdAt,
    done,
    ...newTodo
  }

  await todoService.insert(newItem);
  return newItem
}
