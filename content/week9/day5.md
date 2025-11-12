# Week 9: Day 5 - Capstone: Build Full-Stack Feature

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Week 9 Days 1-4

---

## 📚 Project Objectives

By the end of this project, you'll have:
- ✅ Built a complete full-stack feature
- ✅ Integrated frontend and backend
- ✅ Implemented error handling
- ✅ Added real-time updates
- ✅ Deployed to production

---

## 🎯 Project: Collaborative Todo App

### Requirements

**Frontend (React):**
- Display list of todos
- Add new todos
- Mark todos as complete
- Edit todo text
- Delete todos
- Real-time updates
- Error handling
- Loading states

**Backend (Express):**
- GET /api/todos - List todos
- POST /api/todos - Create todo
- PUT /api/todos/:id - Update todo
- DELETE /api/todos/:id - Delete todo
- WebSocket for real-time sync
- Input validation
- Error handling
- Authentication

---

## 📋 Implementation Checklist

### Phase 1: Backend Setup (45 min)
```javascript
// 1. Create Express server with CORS
// 2. Setup MongoDB connection
// 3. Create Todo schema
// 4. Implement CRUD endpoints
// 5. Add input validation
// 6. Setup WebSocket
```

### Phase 2: Frontend Setup (45 min)
```jsx
// 1. Create React components
// 2. Setup API service layer
// 3. Implement Redux/Zustand
// 4. Add Socket.io connection
// 5. Create forms with validation
// 6. Add error boundaries
```

### Phase 3: Integration (45 min)
```javascript
// 1. Connect frontend to backend
// 2. Implement real-time updates
// 3. Add authentication
// 4. Setup error handling
// 5. Implement optimistic updates
// 6. Test complete flow
```

### Phase 4: Polish (45 min)
```javascript
// 1. Add loading states
// 2. Improve error messages
// 3. Optimize performance
// 4. Add animations
// 5. Deploy to production
// 6. Setup monitoring
```

---

## 💾 Backend Starter Code

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/todos');

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  io.emit('todo-created', todo);
  res.status(201).json(todo);
});

app.listen(5000, () => console.log('Backend running'));
```

---

## 🎨 Frontend Starter Code

```jsx
// App.jsx
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchTodos();
    socket.on('todo-created', (todo) => {
      setTodos(prev => [...prev, todo]);
    });
  }, []);

  async function fetchTodos() {
    const res = await fetch('http://localhost:5000/api/todos');
    const data = await res.json();
    setTodos(data);
  }

  async function handleAdd() {
    const res = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input })
    });
    const newTodo = await res.json();
    setInput('');
  }

  return (
    <div>
      <h1>Collaborative Todos</h1>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 📊 Success Criteria

- [ ] All CRUD operations working
- [ ] Real-time updates functional
- [ ] Error handling in place
- [ ] Input validation working
- [ ] Deployed to production
- [ ] Tests passing
- [ ] Code commented
- [ ] Performance optimized

---

## 🚀 Deployment Steps

1. **Prepare:**
   - Add environment variables
   - Build frontend
   - Run tests

2. **Deploy Backend:**
   - Push to GitHub
   - Deploy to Heroku/Railway
   - Setup database

3. **Deploy Frontend:**
   - Build production bundle
   - Deploy to Vercel/Netlify
   - Configure API URL

4. **Monitor:**
   - Setup error tracking
   - Monitor performance
   - View logs

---

## 📝 Reflection & Submission

Document your learning:
1. What challenges did you face?
2. How did you solve them?
3. What would you improve?
4. What did you learn?
5. How long did it take?

---

## ✅ Summary

You've built a complete full-stack application with:
- ✅ React frontend
- ✅ Express backend
- ✅ Real-time features
- ✅ Error handling
- ✅ Production deployment

---

## 🔗 Next Steps

**Week 10:** Advanced JavaScript & Performance  
**Celebrate:** You built a real application! 🎉
- Docker for containerization
- Heroku/Railway for hosting

## Example

```javascript
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  test('GET /api/users returns users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  test('POST /api/users creates user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});
```

## ✅ Checkpoint

- [ ] Can test APIs
- [ ] Know testing tools
- [ ] Can deploy
- [ ] Understand CI/CD

**Next:** Week 9 Project! 🚀

