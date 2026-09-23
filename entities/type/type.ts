export interface itemTodo {
  id: string
  text: string
  done: boolean
}

export interface cardTodo {
  id: string
  title: string
  todoList: itemTodo[]
  lastUpdate: number
}
