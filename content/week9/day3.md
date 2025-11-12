# Week 9: Day 3 - Real-Time Features & WebSockets

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 9 Days 1-2

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand WebSockets
- ✅ Use Socket.io for real-time communication
- ✅ Implement live notifications
- ✅ Handle connection states
- ✅ Build collaborative features

---

## 1️⃣ WebSockets vs HTTP

```
HTTP:
- Request/Response only
- Client initiates
- No real-time server updates
- Stateless connections

WebSocket:
- Bidirectional
- Server can push data
- Real-time updates
- Persistent connection
```

---

## 2️⃣ Socket.io Setup

```bash
npm install socket.io
```

```javascript
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for events
  socket.on('message', (data) => {
    console.log('Message:', data);
    // Broadcast to all clients
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => console.log('Server on 5000'));
```

---

## 3️⃣ Client-Side Socket.io

```bash
npm install socket.io-client
```

```jsx
// src/App.jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => socket.off('message');
  }, []);

  function handleSendMessage() {
    socket.emit('message', { text: input, user: 'Me' });
    setInput('');
  }

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>{msg.user}: {msg.text}</p>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}
```

---

## 4️⃣ Advanced Features

### Rooms

```javascript
// Server
socket.on('join-room', (roomId) => {
  socket.join(roomId);
  io.to(roomId).emit('user-joined', socket.id);
});

socket.on('message', (data) => {
  io.to(data.roomId).emit('message', data);
});
```

### Namespaces

```javascript
// Server
const notifications = io.of('/notifications');

notifications.on('connection', (socket) => {
  socket.on('notify', (data) => {
    notifications.emit('alert', data);
  });
});

// Client
const notificationSocket = io('http://localhost:5000/notifications');
notificationSocket.emit('notify', { type: 'message' });
```

---

## 📝 Practice Exercises

### Exercise 1: Chat Application
Build real-time chat with Socket.io

### Exercise 2: Live Notifications
Implement notification system

### Exercise 3: Collaborative Editing
Build shared document editing

### Exercise 4: Multiplayer Game
Create simple multiplayer game

---

## ✅ Summary

- **WebSockets** enable real-time communication
- **Socket.io** simplifies WebSocket usage
- **Rooms** organize connections
- **Namespaces** separate concerns
- **Events** drive interactions
- **Broadcasting** reaches multiple clients

---

## 🔗 Next Steps

**Tomorrow (Day 4):** Error Handling & Validation  
**Continue:** Build interactive applications!
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const valid = await bcrypt.compare(req.body.password, user.password);
  
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id }, 'SECRET_KEY');
  res.json({ token });
});

// Protected route
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/protected', auth, (req, res) => {
  res.json({ message: 'Protected data' });
});
```

## ✅ Checkpoint

- [ ] Know authentication methods
- [ ] Can hash passwords
- [ ] Can use JWT
- [ ] Understand security

**Next:** APIs & REST! 🚀

