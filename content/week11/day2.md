# Week 11: Day 2 - System Design

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Understand system design fundamentals
- Be able to design scalable systems
- Know about databases and caching
- Understand load balancing and microservices

## Topics

- Scalability
- Database design
- Caching strategies
- Load balancing
- Microservices
- API design

## System Design Principles

### Scalability
```
Vertical Scaling: Add more power to existing server
- Easier but has limits

Horizontal Scaling: Add more servers
- Better for large systems
- Requires load balancing
```

### Load Balancing
```javascript
// Example: Round-robin load balancer
class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.current = 0;
  }

  route(request) {
    const server = this.servers[this.current];
    this.current = (this.current + 1) % this.servers.length;
    return server.handle(request);
  }
}

const lb = new LoadBalancer([
  { handle: (req) => `Server 1: ${req}` },
  { handle: (req) => `Server 2: ${req}` },
  { handle: (req) => `Server 3: ${req}` }
]);

console.log(lb.route('request 1')); // Server 1
console.log(lb.route('request 2')); // Server 2
console.log(lb.route('request 3')); // Server 3
```

### Database Design
```
Relational (SQL):
- Structured data
- ACID guarantees
- Good for complex queries

NoSQL:
- Flexible schema
- Better scalability
- Document/Key-value stores
```

### Caching Strategy
```javascript
// Simple cache implementation
class Cache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// LRU Cache (Least Recently Used)
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

## Architecture Patterns

### Monolithic Architecture
```
Single application handling all logic
Pros: Simple, easy to deploy
Cons: Hard to scale, coupled services
```

### Microservices Architecture
```
Multiple independent services
Pros: Scalable, independent deployment
Cons: Complex, distributed systems challenges
```

### Example API Gateway
```javascript
// API Gateway pattern
class APIGateway {
  constructor() {
    this.services = {};
  }

  registerService(name, url) {
    this.services[name] = url;
  }

  async route(path, method, data) {
    const [service, endpoint] = path.split('/').filter(Boolean);
    const url = this.services[service];
    
    if (!url) {
      return { error: 'Service not found' };
    }

    return fetch(`${url}/${endpoint}`, {
      method,
      body: JSON.stringify(data)
    }).then(r => r.json());
  }
}

const gateway = new APIGateway();
gateway.registerService('users', 'http://user-service:3001');
gateway.registerService('posts', 'http://post-service:3002');
```

## Database Design Example

```sql
-- User Service
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post Service
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Service
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INT,
  user_id INT,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Caching Layers

```javascript
// Multi-layer caching
class CachedAPI {
  constructor() {
    this.l1Cache = new Map(); // Memory
    this.l2Cache = new Map(); // Redis
  }

  async getData(key) {
    // L1: Check memory
    if (this.l1Cache.has(key)) {
      return this.l1Cache.get(key);
    }

    // L2: Check Redis
    const redisData = await this.getFromRedis(key);
    if (redisData) {
      this.l1Cache.set(key, redisData);
      return redisData;
    }

    // L3: Fetch from DB
    const dbData = await this.getFromDB(key);
    this.l1Cache.set(key, dbData);
    await this.setInRedis(key, dbData);
    return dbData;
  }

  async getFromRedis(key) {
    // Redis client call
  }

  async getFromDB(key) {
    // Database query
  }

  async setInRedis(key, value) {
    // Redis set with TTL
  }
}
```

## Rate Limiting

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests
    const recent = userRequests.filter(
      time => now - time < this.windowMs
    );

    if (recent.length >= this.maxRequests) {
      return false;
    }

    recent.push(now);
    this.requests.set(userId, recent);
    return true;
  }
}
```

## ✅ Checkpoint

- [ ] Understand scalability
- [ ] Know database patterns
- [ ] Can design APIs
- [ ] Know caching strategies

**Next:** Behavioral Interviews! 🎯

