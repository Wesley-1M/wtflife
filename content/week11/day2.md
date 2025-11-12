# Week 11: Day 2 - Static Generation & ISR

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 11 Day 1

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Implement static generation (SSG)
- ✅ Use ISR for dynamic updates
- ✅ Optimize build times
- ✅ Choose rendering strategy
- ✅ Handle revalidation properly

---

## 1️⃣ Static Generation (SSG)

### What is SSG?

```
Static Generation:
- Pages pre-built at build time
- Served directly from CDN
- Fastest possible performance
- Great for content that doesn't change often
- SEO friendly

Best for:
- Blog posts
- Marketing pages
- Documentation
- Product catalogs
- News articles
```

### Implementing SSG

```jsx
// app/blog/page.js
// This page is generated at build time

export const revalidate = false; // Never revalidate

export const metadata = {
  title: 'Blog',
  description: 'Read my latest posts'
};

async function getAllPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: false } // Cache forever
  });
  return res.json();
}

export default async function BlogList() {
  const posts = await getAllPosts();

  return (
    <div className="blog-list">
      <h1>Blog Posts</h1>
      <div className="posts-grid">
        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <time>{new Date(post.publishedAt).toDateString()}</time>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Fallback Pages

```jsx
// app/products/[id]/page.js
export const dynamicParams = true;

export async function generateStaticParams() {
  // Pre-generate these at build time
  const products = await fetch('https://api.example.com/products').then(r => r.json());
  
  return products.map(product => ({
    id: product.id.toString()
  }));
}

export const revalidate = 3600; // Revalidate every hour

export default async function Product({ params }) {
  const product = await fetch(
    `https://api.example.com/products/${params.id}`
  ).then(r => r.json());

  return (
    <div>
      <h1>{product.name}</h1>
      <p className="price">${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}
```

---

## 2️⃣ Incremental Static Regeneration (ISR)

### ISR Basics

```
ISR combines:
- Speed of static pages
- Freshness of server rendering
- On-demand revalidation

How it works:
1. Page is pre-built at build time
2. Served from cache
3. When revalidation interval expires
4. Page is re-generated in background
5. New version is served next time
```

### ISR Example

```jsx
// app/news/[slug]/page.js
export const revalidate = 10; // Revalidate every 10 seconds

// Pre-build these pages
export async function generateStaticParams() {
  const articles = await fetch('https://api.example.com/news').then(r => r.json());
  
  return articles.map(article => ({
    slug: article.slug
  }));
}

export const metadata = {
  title: 'News Article'
};

async function getArticle(slug) {
  const res = await fetch(
    `https://api.example.com/news/${slug}`,
    { next: { revalidate: 10 } }
  );
  
  if (!res.ok) return null;
  return res.json();
}

export default async function Article({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <article>
      <h1>{article.title}</h1>
      <img src={article.image} alt={article.title} />
      <div className="content">{article.content}</div>
      <p className="published">
        Published: {new Date(article.publishedAt).toLocaleDateString()}
      </p>
    </article>
  );
}
```

---

## 3️⃣ Revalidation Strategies

### Time-Based Revalidation

```jsx
// Revalidate every 60 seconds
export const revalidate = 60;

async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }
  });
  return res.json();
}
```

### On-Demand Revalidation

```javascript
// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path');
  
  // Revalidate specific path
  revalidatePath(path || '/');

  return Response.json({ revalidated: true, now: Date.now() });
}
```

### Trigger Revalidation

```javascript
// app/api/posts/create/route.js
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const data = await request.json();

  // Save to database
  const post = await db.posts.create(data);

  // Revalidate the blog list
  revalidatePath('/blog');
  // Also revalidate the specific post
  revalidatePath(`/blog/${post.slug}`);

  return Response.json(post);
}
```

---

## 4️⃣ Build Optimization

### Incremental Builds

```bash
# Build only changed files
npm run build

# Next.js automatically detects changes
# Only rebuilds necessary pages
```

### Output Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Smaller deployment
  
  experimental: {
    // Optimize build size
    optimizeFonts: true,
    optimizePackageImports: {
      lodash: {
        transform: 'lodash/{{member}}'
      }
    }
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  }
};

module.exports = nextConfig;
```

---

## 5️⃣ Content Management Integration

### Fetching from CMS

```jsx
// app/blog/[slug]/page.js
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const cms = new ContentfulClient();
  const posts = await cms.getEntries({ content_type: 'blogPost' });

  return posts.map(post => ({
    slug: post.fields.slug
  }));
}

export const metadata = {
  title: 'Blog Post'
};

async function getPost(slug) {
  const cms = new ContentfulClient();
  const post = await cms.getEntry(slug);
  return post;
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <img src={post.featuredImage.url} alt={post.title} />
      <div className="prose">{post.content}</div>
      <footer>
        <p>By {post.author}</p>
        <p>{new Date(post.publishedAt).toDateString()}</p>
      </footer>
    </article>
  );
}
```

---

## 6️⃣ Monitoring & Analytics

### Build Performance

```bash
# Analyze build time
npm run build

# Output shows:
# - Page generation time
# - Data fetching time
# - Total build duration
```

### Deployment Metrics

```javascript
// Instrument revalidation
console.time('page-revalidation');
// ... revalidate ...
console.timeEnd('page-revalidation');

// Track in monitoring service
analytics.track('page-revalidated', {
  path,
  duration,
  timestamp: new Date()
});
```

---

## 📝 Practice Exercises

### Exercise 1: Static Blog
Create SSG blog with posts

### Exercise 2: ISR Shop
Implement ISR for product catalog

### Exercise 3: CMS Integration
Connect to a CMS with revalidation

### Exercise 4: Performance Test
Measure build and revalidation times

---

## ✅ Summary

- **SSG** pre-builds pages at build time
- **ISR** revalidates pages on schedule
- **Dynamic routes** support millions of pages
- **Revalidation** keeps content fresh
- **Performance** is dramatically improved
- **CMS integration** works seamlessly

---

## 🔗 Next Steps

**Tomorrow (Day 3):** API Routes & Backend  
**Continue:** Build full-stack Next.js apps!
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

