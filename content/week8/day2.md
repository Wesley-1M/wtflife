# Week 8: Day 2 - Express Framework & Routing

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 8 Day 1

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Create Express servers
- ✅ Setup routes and routing
- ✅ Use middleware
- ✅ Handle requests/responses
- ✅ Create RESTful APIs

---

## 1️⃣ Express Basics

### Install & Setup

```bash
npm init -y
npm install express
```

### Hello World Server

```javascript
// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

```bash
# Run server
node server.js
# Visit http://localhost:3000
```

---

## 2️⃣ Request & Response

### Request Object

```javascript
app.get('/user/:id', (req, res) => {
  // Query parameters: ?name=John&age=30
  const name = req.query.name;
  const age = req.query.age;
  
  // URL parameters: /user/123
  const id = req.params.id;
  
  // Request body (need middleware)
  const { email } = req.body;
  
  // Headers
  const userAgent = req.headers['user-agent'];
  const token = req.headers.authorization;
  
  // Method
  const method = req.method; // GET, POST, etc
  
  console.log({ name, age, id, email });
});
```

### Response Object

```javascript
// Send text
app.get('/text', (req, res) => {
  res.send('Hello World');
});

// Send JSON
app.get('/json', (req, res) => {
  res.json({ message: 'Hello', status: 'success' });
});

// Send file
app.get('/file', (req, res) => {
  res.sendFile(__dirname + '/file.txt');
});

// Set status code
app.get('/error', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Set headers
app.get('/headers', (req, res) => {
  res.set('X-Custom-Header', 'value');
  res.send('Headers set');
});

// Redirect
app.get('/old-url', (req, res) => {
  res.redirect('/new-url');
});
```

---

## 3️⃣ Middleware

### What is Middleware?

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response

Middleware can:
- Modify request/response
- End request-response cycle
- Call next middleware
```

### Using Middleware

```javascript
const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files

// Custom middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // Continue to next middleware
};

app.use(logger);

// Middleware for specific route
app.get('/admin', logger, (req, res) => {
  res.send('Admin page');
});
```

### Common Middleware

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Security
app.use(helmet()); // Set security headers

// CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Error handling middleware (last!)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message
  });
});
```

---

## 4️⃣ Routing

### Basic Routes

```javascript
const express = require('express');
const app = express();

// GET request
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// POST request
app.post('/users', (req, res) => {
  const newUser = req.body;
  res.status(201).json(newUser);
});

// PUT request (update)
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  res.json(updatedUser);
});

// DELETE request
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({ message: 'Deleted' });
});

// PATCH request (partial update)
app.patch('/users/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  res.json(updates);
});
```

### Route Parameters

```javascript
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Optional parameters (regex)
app.get('/files/:filename?', (req, res) => {
  const filename = req.params.filename || 'default';
  res.json({ filename });
});
```

### Route Handlers (Chaining)

```javascript
// Same route, different methods
app.route('/users/:id')
  .get((req, res) => {
    res.json({ id: req.params.id });
  })
  .put((req, res) => {
    res.json({ updated: req.params.id });
  })
  .delete((req, res) => {
    res.json({ deleted: req.params.id });
  });
```

### Router (Organize routes)

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.post('/', (req, res) => {
  res.status(201).json(req.body);
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

module.exports = router;

// server.js
const express = require('express');
const userRoutes = require('./routes/users');
const app = express();

app.use('/api/users', userRoutes); // Mount router

// Now:
// GET /api/users
// POST /api/users
// GET /api/users/:id
```

---

## 5️⃣ Creating RESTful APIs

### REST Conventions

```
GET    /api/users         - List all users
POST   /api/users         - Create user
GET    /api/users/:id     - Get user by ID
PUT    /api/users/:id     - Update user
DELETE /api/users/:id     - Delete user
```

### Complete API Example

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory data (in real app, use database)
let users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Create user
app.post('/api/users', (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  
  res.json(user);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 📝 Practice Exercises

### Exercise 1: Create Express Server
Setup basic Express server with 3 GET routes

### Exercise 2: Build REST API
Create full CRUD API for products

### Exercise 3: Add Middleware
Implement logging middleware and error handler

### Exercise 4: Organize Routes
Refactor API using Express Router

---

## ✅ Summary

- **Express** simplifies server creation
- **Middleware** processes requests
- **Routes** handle different endpoints
- **REST** is standard API pattern
- **Request/Response** objects contain data
- **Router** organizes routes

---

## 🔗 Next Steps

**Tomorrow (Day 3):** Building REST APIs  
**Continue:** Master backend development!
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => (
  <button onClick={onClick} className={`btn-${variant}`}>
    {label}
  </button>
);

// Hook typing
const useCounter = (initial: number = 0): [number, () => void] => {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(count + 1);
  return [count, increment];
};

// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
```

## ✅ Checkpoint

- [ ] Can type React components
- [ ] Can type props
- [ ] Can type hooks
- [ ] Know React types

**Next:** Advanced Patterns! 🚀

