import { TodoService } from "../../services/todoService.mjs";

const todoService = new TodoService();

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  await todoService.remove(todoId)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
