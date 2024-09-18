import { parseUserId } from "../../auth/utils.mjs"
import {TodoService} from "../../services/todoService.mjs"

const todoService = new TodoService
export async function handler(event) {
  const authorization = event.headers.Authorization
  const userId = parseUserId(authorization)
  console.log('userId: ' + userId)

  const todos = await todoService.getAll(userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
