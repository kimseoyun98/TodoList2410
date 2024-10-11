'use client';

import { useEffect, useState } from 'react';
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
} from '../hook/useTodoMutation';
import { QueryClient } from '@tanstack/react-query';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

// useState 사용 시, 타입을 지정합니다.
export default function TodosPage() {
  const queryClient = new QueryClient();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const { mutate: createTodo } = useCreateTodoMutation();
  const { mutate: deleteTodo } = useDeleteTodoMutation();
  const { mutate: toggleTodo } = useToggleTodoMutation();

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('http://localhost:3002/todos');
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, [queryClient]);

  const handleCreateTodo = () => {
    if (!title) return;
    createTodo(
      { title, completed: false },
      {
        onSuccess: (newTodo) => {
          setTodos((prevTodos) => [...prevTodos, newTodo]);
          setTitle('');
        },
      }
    );
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id, {
      onSuccess: () => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      },
    });
  };

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleTodo(
      { id, completed: !completed },
      {
        onSuccess: () => {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === id ? { ...todo, completed: !completed } : todo
            )
          );
        },
      }
    );
  };

  return (
    <>
      <div>
        <h1>TodoList</h1>
        <input
          type="text"
          value={title}
          placeholder="추가하세요"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleCreateTodo}>추가하기</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => handleToggleTodo(todo.id, todo.completed)}
          >
            {todo.title}
            <button onClick={() => handleDeleteTodo(todo.id)}>삭제하기</button>
          </li>
        ))}
      </ul>
    </>
  );
}
