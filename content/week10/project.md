# Week 10: Full-Stack Project - Production-Ready Application

**Duration:** Full Week  
**Difficulty:** ⭐⭐⭐⭐⭐

---

## Project Overview

Build a complete production-ready application with frontend, backend, database, Docker containerization, security, monitoring, and deployment.

## Requirements

### Backend (Node.js/Express)
- RESTful API with proper endpoints
- PostgreSQL database
- Authentication with JWT
- Input validation
- Error handling
- Logging

### Frontend (React)
- Modern UI using React hooks
- State management
- API integration
- Error handling
- Responsive design

### DevOps
- Docker containerization
- docker-compose for local development
- Environment configuration
- Health checks

### Security
- HTTPS/SSL
- CORS configuration
- Rate limiting
- Input sanitization
- Secrets management

### Monitoring
- Logging system
- Performance metrics
- Error tracking
- Uptime monitoring

## Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.js
│   ├── tests/
│   ├── .env
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Implementation Example

### Backend API

```javascript
// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Body parsing
app.use(express.json());

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Error handling
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
```

### Authentication

```javascript
// src/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashedPassword });
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
```

### Frontend Integration

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password })
};

export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data)
};

export default api;
```

### React Components

```javascript
// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await auth.login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    environment:
      REACT_APP_API_URL: http://backend:5000/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Monitoring & Logging

```javascript
// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger;
```

## Deployment Checklist

- [ ] Security audit completed
- [ ] All dependencies updated
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Docker images built
- [ ] Health checks configured
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] Error handling comprehensive
- [ ] Tests passing
- [ ] Documentation complete

## Deliverables

1. **GitHub Repository** with all source code
2. **Docker images** for frontend and backend
3. **docker-compose.yml** for local development
4. **Setup documentation** with installation steps
5. **API documentation** (Swagger/OpenAPI)
6. **Security audit report**
7. **Monitoring dashboard**
8. **Deployment guide**

## Success Criteria

- ✅ All features working in production
- ✅ Secure with HTTPS/SSL
- ✅ Monitoring and logging active
- ✅ Scalable architecture
- ✅ Team collaboration ready
- ✅ Performance optimized

**Congratulations on completing Week 10!** 🎉

You've now built a complete full-stack application production-ready. You understand:

- Frontend-backend integration
- Real-time features
- Containerization with Docker
- Monitoring and scaling
- Security best practices

**Next:** Week 11 - Career preparation! 

