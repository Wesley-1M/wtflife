# Week 12: Day 1 - Performance Optimization

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Understand performance metrics
- Know how to optimize frontend performance
- Be able to profile applications
- Understand backend optimization

## Topics

- Performance metrics (Core Web Vitals)
- Frontend optimization
- Image optimization
- Caching strategies
- Code splitting

## Core Web Vitals

### 1. Largest Contentful Paint (LCP)
- Time until largest content element loads
- Target: < 2.5s
- Optimize: Remove render-blocking resources, optimize images

### 2. First Input Delay (FID)
- Time from user input to browser response
- Target: < 100ms
- Optimize: Reduce JavaScript, use Web Workers

### 3. Cumulative Layout Shift (CLS)
- Visual stability during load
- Target: < 0.1
- Optimize: Set image dimensions, avoid inserting content above

## Frontend Optimization

### Code Splitting

```javascript
// Before: All code in one bundle
import Dashboard from './Dashboard';
import Settings from './Settings';
import Analytics from './Analytics';

// After: Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const Analytics = lazy(() => import('./Analytics'));

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### Image Optimization

```javascript
// Bad: Large unoptimized image
<img src="hero.jpg" alt="Hero" />

// Good: Multiple formats and sizes
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### Bundle Size Reduction

```javascript
// Before: 150KB bundle
import _ from 'lodash'; // 70KB
const doubled = _.map([1, 2, 3], x => x * 2);

// After: Tree-shaking reduces to 5KB
import map from 'lodash/map';
const doubled = map([1, 2, 3], x => x * 2);

// Best: Use native JS
const doubled = [1, 2, 3].map(x => x * 2);
```

### Memoization

```javascript
// Without memoization: Re-renders on every prop change
function UserCard({ user, onClick }) {
  return (
    <div onClick={onClick}>
      <h2>{user.name}</h2>
    </div>
  );
}

// With memoization: Only re-renders if props change
const UserCard = React.memo(({ user, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{user.name}</h2>
    </div>
  );
});

// useMemo: Memoize expensive calculations
function Dashboard({ userId }) {
  const expensiveData = useMemo(() => {
    return calculateComplexMetrics(userId);
  }, [userId]);

  return <Analytics data={expensiveData} />;
}
```

## Backend Optimization

### Database Query Optimization

```javascript
// N+1 Query Problem
async function getUsers() {
  const users = await db.query('SELECT * FROM users');
  
  // This queries DB for each user!
  for (let user of users) {
    user.posts = await db.query(
      'SELECT * FROM posts WHERE user_id = ?',
      [user.id]
    );
  }
  return users; // N+1 queries!
}

// Solution: Use JOIN
async function getUsers() {
  return db.query(`
    SELECT u.*, p.* FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
  `);
}

// Or use batch loading
async function getUsers() {
  const users = await db.query('SELECT * FROM users');
  const userIds = users.map(u => u.id);
  
  const posts = await db.query(
    'SELECT * FROM posts WHERE user_id IN (?)',
    [userIds]
  );
  
  const postsMap = new Map();
  for (let post of posts) {
    if (!postsMap.has(post.user_id)) {
      postsMap.set(post.user_id, []);
    }
    postsMap.get(post.user_id).push(post);
  }
  
  users.forEach(u => {
    u.posts = postsMap.get(u.id) || [];
  });
  
  return users;
}
```

### Caching

```javascript
// In-memory cache
class Cache {
  constructor(ttl = 3600) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (this.ttl * 1000)
    });
  }
}

// Usage with Redis
const redis = require('redis');
const client = redis.createClient();

async function getCachedUser(userId) {
  const cached = await client.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  await client.setex(`user:${userId}`, 3600, JSON.stringify(user));
  
  return user;
}
```

## Performance Profiling

### React DevTools Profiler

```javascript
// Wrap components to profile
import { Profiler } from 'react';

function onRenderCallback(
  id,      // Component name
  phase,   // "mount" or "update"
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <Dashboard />
</Profiler>
```

### Lighthouse Metrics

```javascript
// Measure Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Performance Monitoring

```javascript
// Set up performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
  }

  recordMetric(name, duration) {
    this.metrics.push({ name, duration, timestamp: Date.now() });
    
    if (duration > 1000) {
      console.warn(`${name} took ${duration}ms (slow!)`);
    }
  }

  async sendToAnalytics() {
    await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(this.metrics)
    });
  }
}

const monitor = new PerformanceMonitor();

async function fetchData() {
  const start = performance.now();
  const data = await api.get('/data');
  monitor.recordMetric('fetchData', performance.now() - start);
  return data;
}
```

## ✅ Checkpoint

- [ ] Know Core Web Vitals
- [ ] Can optimize frontend
- [ ] Know caching strategies
- [ ] Can profile applications
- [ ] Understand database optimization

**Next:** Security Best Practices! 🔒

