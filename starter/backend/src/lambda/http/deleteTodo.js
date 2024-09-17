import { TodoService } from "../../services/todoService.mjs";

const todoService = new TodoService();

export function handler(event) {
  const todoId = event.pathParameters.todoId

  return todoService.remove(todoId)
}
