import { parseUserId } from "../../auth/utils.mjs";
import { TodoService } from "../../services/todoService.mjs";
import { createLogger } from '../../utils/logger.mjs'

const todoService = new TodoService();
const logger = createLogger('todoRepository')

export async function handler(event) {
  const authorization = event.headers.Authorization
  const userId = parseUserId(authorization)
  
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  try {
    const oldTodo = await todoService.get(userId, todoId)
    if (oldTodo.userId != userId) throw new Error("Todo with id: " + todoId + " doesnot exist")

    await todoService.update(userId, todoId, updatedTodo)
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
