import { TodoService } from "../../services/todoService.mjs";

const todoService = new TodoService();

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  
  await todoService.update(todoId, updatedTodo)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
