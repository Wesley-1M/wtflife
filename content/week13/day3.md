# Week 13: Day 3 - System Design & Architecture

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Full-Stack Knowledge

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Design scalable systems
- ✅ Discuss trade-offs
- ✅ Handle system constraints
- ✅ Design databases at scale
- ✅ Plan infrastructure
- ✅ Address non-functional requirements

---

## 1️⃣ System Design Fundamentals

### RASCALE Framework

```typescript
// RASCALE = Requirements, Architecture, Selection, Calculations, Load, Extend

interface SystemDesignFramework {
  requirements: {
    functional: string[]
    nonFunctional: string[]
    constraints: string[]
  }
  architecture: {
    components: string[]
    interactions: string[]
    dataFlow: string[]
  }
  selection: {
    technologies: string[]
    tradeoffs: string[]
    justification: string[]
  }
  calculations: {
    storage: string
    traffic: string
    bandwidth: string
  }
  load: {
    balancing: string
    caching: string
    optimization: string
  }
  extend: {
    scalability: string
    reliability: string
    monitoring: string
  }
}
```

### Estimation Example

```javascript
// Example: Design YouTube

// Requirements:
- 2 billion users
- 500 million daily active users
- 300+ hours of video uploaded per minute
- 1 billion videos watched per day

// Back of the envelope calculations:

// Storage:
const videosPerDay = 300 * 60 * 24 // 432,000 videos
const avgVideoSize = 1 // GB (compressed)
const dailyStorage = videosPerDay * avgVideoSize // 432 TB
const yearlyStorage = dailyStorage * 365 // 157.68 PB per year

// Bandwidth (streaming):
const usersPerDay = 500_000_000
const avgVideoLength = 10 // minutes
const avgBitrate = 1 // Mbps
const totalBandwidth = (usersPerDay * avgVideoLength * avgBitrate) / 1000
console.log(`Daily bandwidth needed: ${totalBandwidth} Gbps`)

// Calculations show need for:
// - Massive distributed storage (CDN)
// - Database sharding
// - Caching layer
// - Load balancing
```

---

## 2️⃣ Database Design at Scale

### Database Sharding

```sql
-- Example: Sharding User Data

-- Shard 0: Users 0-999,999
-- Shard 1: Users 1,000,000-1,999,999
-- Shard 2: Users 2,000,000-2,999,999

-- Sharding Strategy:
user_id % number_of_shards = shard_number

-- Implementation:
-- Shard 0 (user_id % 3 = 0)
CREATE TABLE users_shard_0 (
  user_id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP,
  INDEX(email)
);

-- Similar for shard_1, shard_2

-- Query routing (application level):
-- 1. Calculate shard: user_id % 3
-- 2. Route to appropriate database
-- 3. Execute query
```

### Replication & Consistency

```
Replication Strategies:

1. Master-Slave (Master-Replica)
   - Write to master
   - Read from replicas
   - Eventual consistency
   - Better read performance

2. Master-Master
   - Multiple masters
   - All accept writes
   - Complex conflict resolution
   - High availability

3. Leader-Based
   - Primary leader
   - Secondary replicas
   - Automatic failover
   - Industry standard

Consistency Models:
- Strong: Wait for replication before response
- Eventual: Replicate asynchronously
- Causal: Preserve causality
- Session: Consistent within session
```

---

## 3️⃣ Caching Strategies

### Cache Levels

```javascript
// Multi-level caching strategy

class CacheStrategy {
  // Level 1: In-Memory Cache (Application)
  inMemoryCache = new Map()
  
  // Level 2: Distributed Cache (Redis)
  redisClient = redis.createClient()
  
  // Level 3: Database
  database = database.connect()
  
  async get(key) {
    // Try in-memory first
    if (this.inMemoryCache.has(key)) {
      return this.inMemoryCache.get(key)
    }
    
    // Try Redis
    const redisValue = await this.redisClient.get(key)
    if (redisValue) {
      this.inMemoryCache.set(key, redisValue)
      return redisValue
    }
    
    // Query database
    const dbValue = await this.database.query(key)
    
    // Populate caches
    await this.redisClient.set(key, dbValue, 'EX', 3600)
    this.inMemoryCache.set(key, dbValue)
    
    return dbValue
  }
}

// Cache invalidation patterns:
// 1. TTL (Time To Live) - expire after time
// 2. LRU (Least Recently Used) - remove old entries
// 3. Write-through - update cache when writing
// 4. Write-behind - async cache update
```

### CDN for Static Content

```
CDN Architecture:

                    User Request
                         |
                    [Edge Location]
                    /              \
                   /                \
            Cached               Not Cached
            Return              |
                         [Origin Server]
                              |
                        [Cache/Store]
                              |
                           Return

Benefits:
- Reduced latency (content closer)
- Reduced bandwidth (distributed)
- Increased availability (redundancy)
- Better performance

Implementation: CloudFront, Fastly, Cloudflare
```

---

## 4️⃣ API Design at Scale

### API Gateway Pattern

```yaml
# API Gateway Pattern

User Request
    |
    v
[Load Balancer]
    |
    v
[API Gateway]
    |
    +-- Route to Service 1
    +-- Route to Service 2
    +-- Route to Service 3
    
API Gateway Responsibilities:
- Request routing
- Rate limiting
- Authentication
- Request/response transformation
- Caching
- Logging
- Circuit breaking

Popular Gateways:
- Kong
- AWS API Gateway
- Azure API Management
- NGINX
```

### Rate Limiting Algorithm

```javascript
// Token Bucket Algorithm

class RateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity
    this.tokens = capacity
    this.refillRate = refillRate
    this.lastRefill = Date.now()
  }
  
  refill() {
    const now = Date.now()
    const timePassed = (now - this.lastRefill) / 1000
    const tokensToAdd = timePassed * this.refillRate
    
    this.tokens = Math.min(
      this.capacity,
      this.tokens + tokensToAdd
    )
    this.lastRefill = now
  }
  
  isAllowed() {
    this.refill()
    
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true
    }
    
    return false
  }
}

// Usage:
const limiter = new RateLimiter(10, 1) // 10 requests per second
console.log(limiter.isAllowed()) // true
console.log(limiter.isAllowed()) // true
```

---

## 5️⃣ Microservices Architecture

### Microservices Design

```
Monolithic App:
[User Service | Product Service | Order Service]
         |              |               |
         +---> [Shared Database] <-----+

Issues:
- Single point of failure
- Difficult to scale independently
- Technology lock-in

---

Microservices:
[User Service] [Product Service] [Order Service]
       |              |                |
   [DB]           [DB]              [DB]
   
Benefits:
- Independent deployment
- Technology flexibility
- Selective scaling
- Fault isolation

Challenges:
- Distributed system complexity
- Network latency
- Data consistency
- Testing difficulty
```

### Service Communication

```typescript
// Synchronous: REST/gRPC
const userService = axios.create({
  baseURL: 'http://user-service:3001'
})

const product = await productService.post('/checkout', {
  userId: 123,
  items: [...]
})

// Asynchronous: Message Queue
const queue = new RabbitMQ()

queue.publish('order.created', {
  orderId: 456,
  userId: 123
})

queue.subscribe('order.created', (message) => {
  // Process order
  notificationService.sendConfirmation(message.userId)
})
```

---

## 📝 Practice Exercises

### Exercise 1: Design Twitter
Design a system to handle:
- 300 million users
- 500 million tweets per day
- 100k read requests per second
- Real-time feed delivery

Topics to cover:
- User and tweet storage
- Feed generation algorithm
- Caching strategy
- Real-time notifications

### Exercise 2: Design Uber
Design ride-sharing platform:
- Location tracking
- Matching drivers with riders
- Payment processing
- Real-time notifications

Include:
- Geospatial database queries
- Matching algorithm
- Scalability considerations
- Fault tolerance

### Exercise 3: Design Netflix
Design streaming service:
- 200 million subscribers
- 5 billion hours watched/month
- 1 billion concurrent users peak
- Real-time recommendations

Cover:
- Video storage and streaming
- Recommendation engine
- CDN strategy
- Database design

### Exercise 4: Trade-offs Discussion
For each design, discuss:
- Consistency vs Availability
- Latency vs Throughput
- Storage vs Compute
- Complexity vs Performance

### Exercise 5: Presentation
Present a 15-minute system design:
- Requirements
- High-level architecture
- Key decisions with trade-offs
- Handle interviewer questions

---

## ✅ Summary

- **Back of envelope calculations** guide architecture decisions
- **Sharding and replication** handle scale
- **Caching** reduces latency and load
- **API design** impacts performance and usability
- **Microservices** provide flexibility and scalability
- **Trade-offs** are central to good design
- **Communication** helps interviewers understand your thinking
- **Scalability** must be planned from the start

---

## 🔗 Next Steps

**Tomorrow (Day 4):** Final Capstone Project Showcase  
**Prepare:** Your best work and talking points!
│   │   ├── auth.service.js
│   │   └── post.service.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useForm.js
│   ├── store/
│   │   ├── authStore.js
│   │   ├── postStore.js
│   │   └── uiStore.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.jsx
│   └── index.jsx
├── public/
├── package.json
└── Dockerfile
```

### React Setup with Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

### API Service

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
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

### State Management (Zustand)

```javascript
// src/store/authStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Login failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', 
        { email, password, username }
      );
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Registration failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

// src/store/postStore.js
export const usePostStore = create((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/posts');
      set({ posts: data.posts });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createPost: async (title, content) => {
    try {
      const { data } = await api.post('/posts', { title, content });
      set(state => ({ posts: [data, ...state.posts] }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  updatePost: async (id, title, content) => {
    try {
      const { data } = await api.put(`/posts/${id}`, { title, content });
      set(state => ({
        posts: state.posts.map(p => p.id === id ? data : p)
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  deletePost: async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      set(state => ({
        posts: state.posts.filter(p => p.id !== id)
      }));
    } catch (err) {
      set({ error: err.message });
    }
  }
}));
```

### Components

```javascript
// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded p-2 disabled:bg-gray-400"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

// src/components/Post/PostList.jsx
import React, { useEffect } from 'react';
import { usePostStore } from '../../store/postStore';
import PostCard from './PostCard';
import Loading from '../Common/Loading';

export default function PostList() {
  const { posts, isLoading, error, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// src/components/Post/PostForm.jsx
import React, { useState } from 'react';
import { usePostStore } from '../../store/postStore';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createPost, isLoading } = usePostStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="5"
          className="w-full border rounded p-2"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white rounded p-2 disabled:bg-gray-400"
      >
        {isLoading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
```

### Routing

```javascript
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Layout from './components/Layout/Layout';

function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```

## ✅ Checkpoint

- [ ] React app running
- [ ] API service configured
- [ ] State management working
- [ ] Authentication flows complete
- [ ] Post CRUD working
- [ ] UI responsive
- [ ] Error handling in place

**Next:** Testing & Deployment! 🚀

