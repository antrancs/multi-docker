import React, { useEffect, useState } from 'react';
import axios from 'axios';

import TodoForm from './TodoForm';

interface Todo {
  id: string;
  text: string;
  emoji: string;
}

const MainPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function fetchTodos() {
      const todos = await axios.get('/api/todos/all');
      setTodos(todos.data);
    }

    fetchTodos();
  }, []);

  async function addTodo(text: string) {
    await axios.post('/api/todos', {
      text,
    });
  }

  return (
    <div>
      <h1>Todos</h1>
      <TodoForm onSubmit={addTodo} />

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text} {todo.emoji}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
