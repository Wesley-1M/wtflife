# Week 13: Day 2 - Backend Implementation

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Build complete REST API
- Implement authentication
- Set up database
- Handle errors properly
- Document API

## Backend Setup

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── env.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── post.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── comment.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── post.routes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── responses.js
│   └── index.js
├── migrations/
├── tests/
├── .env
├── package.json
└── Dockerfile
```

### Express Setup

```javascript
// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/posts', require('./routes/post.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
```

### Authentication

```javascript
// src/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/user.model');
const logger = require('../utils/logger');

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('username').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        email,
        username,
        password: hashedPassword
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
```

### Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorize };
```

### API Endpoints

```javascript
// src/routes/post.routes.js
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Post = require('../models/post.model');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create post
router.post('/',
  authenticateToken,
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, imageUrl } = req.body;

      const post = await Post.create({
        userId: req.user.userId,
        title,
        content,
        imageUrl
      });

      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// Get all posts
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('userId', 'username avatar');

    const total = await Post.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
});

// Update post
router.put('/:id',
  authenticateToken,
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.userId.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      post.title = title;
      post.content = content;
      await post.save();

      res.json(post);
    } catch (err) {
      next(err);
    }
  }
);

// Delete post
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### Testing

```javascript
// tests/post.test.js
const request = require('supertest');
const app = require('../src/index');
const Post = require('../src/models/post.model');

describe('POST Endpoints', () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  test('Create post with valid data', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Post');
  });

  test('Get all posts', async () => {
    await Post.create({
      userId: userId,
      title: 'Test Post',
      content: 'Content'
    });

    const res = await request(app)
      .get('/api/posts');

    expect(res.statusCode).toBe(200);
    expect(res.body.posts).toHaveLength(1);
  });

  test('Update own post', async () => {
    const post = await Post.create({
      userId: userId,
      title: 'Original',
      content: 'Content'
    });

    const res = await request(app)
      .put(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated',
        content: 'New content'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
  });
});
```

## ✅ Checkpoint

- [ ] Express server running
- [ ] Authentication implemented
- [ ] Database connected
- [ ] All CRUD endpoints working
- [ ] Error handling in place
- [ ] API documented
- [ ] Tests passing

**Next:** Frontend Implementation! ⚛️

