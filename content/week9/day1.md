# Week 9: Day 1 - Backend Basics with Node.js

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Topics

- Node.js fundamentals
- NPM & package management
- Creating a server
- Routing basics
- Middleware
- Request/response

## Key Concepts

```javascript
// HTTP Server
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello' }));
});
server.listen(3000);

// Express.js
const express = require('express');
const app = express();

app.use(express.json()); // Middleware

app.get('/api/data', (req, res) => {
  res.json({ data: 'example' });
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ success: true });
});

app.listen(3000);
```

## ✅ Checkpoint

- [ ] Understand Node.js
- [ ] Can create HTTP server
- [ ] Know Express basics
- [ ] Understand routing

**Next:** Databases! 🚀

