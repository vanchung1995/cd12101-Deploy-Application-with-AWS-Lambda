import {TodoService} from "../../services/todoService.mjs"

const todoService = new TodoService
export function handler(event) {
  const todos = todoService.getAll()
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
