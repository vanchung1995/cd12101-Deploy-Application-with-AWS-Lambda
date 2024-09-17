import { TodoService } from "../../services/todoService.mjs";
import { createLogger } from '../../utils/logger.mjs'

const todoService = new TodoService();
const logger = createLogger('todoRepository')

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  try {
    await todoService.update(todoId, updatedTodo)
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    }
  } catch (error) {
    logger.error(error)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }
}
