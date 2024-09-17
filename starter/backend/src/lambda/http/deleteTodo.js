import { TodoService } from "../../services/todoService.mjs";

const todoService = new TodoService();

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  try {
    await todoService.remove(todoId)
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (error) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }
}
