import { v4 as uuidv4 } from 'uuid';
import { TodoService } from '../../services/todoService.mjs';

const todoService = new TodoService();

export async function handler(event) {
  const newTodo = JSON.parse(event.body)

  const todoId = uuidv4()
  const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const done = false;
  const newItem = {
    todoId,
    createdAt,
    done,
    ...newTodo
  }

  await todoService.insert(newItem);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
