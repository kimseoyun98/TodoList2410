'use client';

import axios from 'axios';

export const todoClient = axios.create({
  baseURL: 'http://localhost:3002/todos',
});

export const getTodos = async (filter) => {
  const searchParams = new URLSearchParams();
  if (filter === 'completed') {
    searchParams.append('completed', true);
  }

  if (filter === 'pending') {
    searchParams.append('pending', false);
  }
  const { data } = await todoClient.get(`?${searchParams.toString()}`);
  return data;
};

export const postTodos = async (newTodo) => {
  const { data } = await todoClient.post('/', newTodo);
  return data;
};

export const deleteTodos = async (id) => {
  const { data } = await todoClient.delete(`/${id}`);
  return data;
};

export const toggleTodos = async (id, completed) => {
  const { data } = await todoClient.patch(`/${id}`, { completed });
  return data;
};
