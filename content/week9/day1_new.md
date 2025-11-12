# Week 9: Day 1 - Full-Stack Integration & API Consumption

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Weeks 1-8

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Connect React frontend to Express backend
- ✅ Handle API requests from React
- ✅ Manage loading/error states
- ✅ Share data between components
- ✅ Build complete full-stack features

---

## 1️⃣ Backend Setup

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

let todos = [
  { id: 1, title: 'Learn React', completed: false }
];

// API endpoints
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.listen(5000, () => console.log('API running on 5000'));
```

---

## 2️⃣ Frontend API Consumption

```jsx
// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function fetchTodos() {
  const response = await fetch(`${API_URL}/api/todos`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

export async function createTodo(title) {
  const response = await fetch(`${API_URL}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!response.ok) throw new Error('Failed to create');
  return response.json();
}
```

---

## 3️⃣ React Component with API

```jsx
// src/components/TodoList.jsx
import { useState, useEffect } from 'react';
import { fetchTodos, createTodo } from '../services/api';

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(title) {
    try {
      const newTodo = await createTodo(title);
      setTodos([...todos, newTodo]);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <button onClick={() => handleAddTodo('New Todo')}>Add</button>
    </div>
  );
}
```

---

## 4️⃣ Advanced API Patterns

### Error Handling

```javascript
// services/api.js
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }
  return response.json();
}

export async function updateTodo(id, data) {
  const response = await fetch(`${API_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}
```

### Interceptors with Axios

```bash
npm install axios
```

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 5️⃣ Managing Complex State

```jsx
// useApi hook
function useApi(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }));
  }, [url]);

  return state;
}

// Usage
function Dashboard() {
  const { data: user, loading, error } = useApi('/api/user');
  const { data: todos } = useApi('/api/todos');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <TodoList items={todos} />
    </div>
  );
}
```

---

## 📝 Practice Exercises

### Exercise 1: Full-Stack Todo App
Build complete todo app with React frontend & Express backend

### Exercise 2: Error Handling
Implement comprehensive error handling & user feedback

### Exercise 3: Authentication
Add login/logout to full-stack app

### Exercise 4: Advanced State
Use hooks to manage complex async state

---

## ✅ Summary

- **API consumption** in React
- **Error handling** gracefully
- **Loading states** for UX
- **Interceptors** for auth
- **Custom hooks** for reusability
- **Full-stack** integration patterns

---

## 🔗 Next Steps

**Tomorrow (Day 2):** State Management with Backend  
**Continue:** Build production full-stack apps!