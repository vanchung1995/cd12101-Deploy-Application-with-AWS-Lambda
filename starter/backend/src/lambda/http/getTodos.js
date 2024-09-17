import {TodoService} from "../../services/todoService.mjs"

const todoService = new TodoService
export async function handler(event) {
  const todos = await todoService.getAll()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
