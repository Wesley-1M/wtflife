# Week 8: Day 3 - Building REST APIs & Databases

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 8 Days 1-2

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Design REST API architecture
- ✅ Connect to databases
- ✅ Perform CRUD operations
- ✅ Handle validation & errors
- ✅ Use ORMs/Query builders

---

## 1️⃣ REST API Architecture

### API Design Principles

```javascript
// ✅ Good REST API
GET    /api/users              // List all
POST   /api/users              // Create
GET    /api/users/:id          // Get one
PUT    /api/users/:id          // Update
DELETE /api/users/:id          // Delete

// Filters, pagination, sorting
GET /api/users?page=1&limit=10&sort=name
GET /api/users?status=active&role=admin

// Response format
{
  "success": true,
  "data": { /* user data */ },
  "error": null
}
```

### Error Handling Pattern

```javascript
app.get('/api/users/:id', (req, res) => {
  try {
    const user = database.getUser(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

---

## 2️⃣ Database Setup (MongoDB)

### Install Dependencies

```bash
npm install mongodb mongoose
```

### Connect to MongoDB

```javascript
// mongodb example
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient('mongodb://localhost:27017');

async function main() {
  try {
    await client.connect();
    const db = client.db('myapp');
    const collection = db.collection('users');
    console.log('Connected to MongoDB');
  } finally {
    await client.close();
  }
}

main();
```

---

## 3️⃣ Using Mongoose ORM

### Define Schema

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
```

### CRUD Operations

```javascript
const User = require('./User');

// Create
async function createUser(data) {
  const user = new User(data);
  return await user.save();
}

// Read
async function getUser(id) {
  return await User.findById(id);
}

async function getAllUsers() {
  return await User.find();
}

// Update
async function updateUser(id, updates) {
  return await User.findByIdAndUpdate(id, updates, { new: true });
}

// Delete
async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}
```

---

## 4️⃣ Complete API with Database

```javascript
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## 📝 Practice Exercises

### Exercise 1: Schema Design
Create Mongoose schemas for products with validation

### Exercise 2: API Endpoints
Build complete CRUD API for blog posts

### Exercise 3: Error Handling
Add comprehensive error handling to all endpoints

### Exercise 4: Pagination
Implement pagination and filtering

---

## ✅ Summary

- **REST API** standard for web services
- **Mongoose** simplifies MongoDB usage
- **Schemas** define data structure
- **CRUD** operations for data management
- **Error handling** essential
- **Validation** prevents bad data

---

## 🔗 Next Steps

**Tomorrow (Day 4):** Authentication & Security  
**Continue:** Build production-ready APIs!
<DataFetcher
  render={(data, loading) => (
    loading ? <Loading /> : <Data {...data} />
  )}
/>

// HOC
const withTheme = (Component) => (props) => (
  <ThemeProvider>
    <Component {...props} />
  </ThemeProvider>
);

// Compound components
<Accordion>
  <Accordion.Item>
    <Accordion.Header>Title</Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    return this.props.children;
  }
}
```

## ✅ Checkpoint

- [ ] Understand render props
- [ ] Know HOC pattern
- [ ] Understand compound components
- [ ] Know error handling

**Next:** Testing & Deployment! 🚀

