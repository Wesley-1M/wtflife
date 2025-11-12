# Week 11: Day 4 - Advanced Patterns & Middleware

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Week 11 Days 1-3

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Implement advanced routing patterns
- ✅ Create custom middleware
- ✅ Handle request/response flows
- ✅ Implement caching strategies
- ✅ Build plugins and extensions

---

## 1️⃣ Route Groups & Organization

### Grouping Routes

```
app/
  (marketing)/
    page.js              # /
    about/page.js        # /about
    contact/page.js      # /contact
    layout.js            # Marketing layout
  (dashboard)/
    page.js              # /
    settings/page.js     # /settings
    layout.js            # Dashboard layout
  api/
    route.js
```

### Implementation

```jsx
// app/(marketing)/layout.js
export default function MarketingLayout({ children }) {
  return (
    <div>
      <header className="marketing-header">
        <nav>Marketing Navigation</nav>
      </header>
      {children}
      <footer>Marketing Footer</footer>
    </div>
  );
}

// app/(dashboard)/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside>Dashboard Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
```

---

## 2️⃣ Middleware

### Creating Middleware

```javascript
// middleware.js (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for authentication
  const token = request.cookies.get('auth-token');

  // Redirect if not authenticated
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*'
  ]
};
```

### Request/Response Headers

```javascript
// middleware.js
export function middleware(request) {
  // Add custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add response headers
  response.headers.set('x-custom-header', 'value');

  return response;
}
```

---

## 3️⃣ Caching Strategies

### Request Memoization

```javascript
// lib/user-service.js
async function getUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    next: { revalidate: 3600 }
  });
  return res.json();
}

// app/user/[id]/page.js
export default async function UserPage({ params }) {
  // Same request deduped automatically
  const user1 = await getUser(params.id);
  const user2 = await getUser(params.id); // Uses cached result
  
  return <div>{user1.name}</div>;
}
```

### Per-Page Caching

```javascript
// app/blog/page.js

// Don't cache this page
export const revalidate = 0;

// Or cache for specific time
export const revalidate = 60;

// Or mark as force-dynamic
export const dynamic = 'force-dynamic';

async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }
  });
  return res.json();
}
```

### Segment Caching

```javascript
// app/products/[id]/page.js
export const dynamicParams = true;
export const revalidate = 10;

export async function generateStaticParams() {
  // Pre-generate popular products
  const products = await fetch('https://api.example.com/products?popular=true')
    .then(r => r.json());

  return products.map(p => ({ id: p.id }));
}

export const metadata = {
  title: 'Product'
};

export default async function ProductPage({ params }) {
  const product = await fetch(
    `https://api.example.com/products/${params.id}`
  ).then(r => r.json());

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  );
}
```

---

## 4️⃣ Intercepting Routes

### Parallel Routes Setup

```
app/
  layout.js
  page.js
  @modal/
    page.js
    (.)post/[id]/page.js
  post/
    [id]/
      page.js
```

### Intercepting Modal

```jsx
// app/@modal/(.)post/[id]/page.js
'use client';

import { useRouter } from 'next/navigation';

export default function PostModal({ params }) {
  const router = useRouter();

  return (
    <div className="modal-overlay" onClick={() => router.back()}>
      <div className="modal">
        <button onClick={() => router.back()}>Close</button>
        <h1>Post {params.id}</h1>
        <p>This post was intercepted and shown in a modal</p>
      </div>
    </div>
  );
}

// app/post/[id]/page.js (default fallback)
export default function PostPage({ params }) {
  return <div>Post {params.id} - Full Page</div>;
}
```

---

## 5️⃣ Custom Error Handling

### Error Boundary

```jsx
// app/error.js
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-page">
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

### Not Found

```jsx
// app/not-found.js
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/">Go home</Link>
    </div>
  );
}

// Use in pages
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const data = await fetch(`/api/items/${params.id}`).then(r => r.json());

  if (!data) {
    notFound();
  }

  return <div>{data.name}</div>;
}
```

---

## 6️⃣ Performance & Optimization

### Dynamic Imports

```jsx
// app/components/HeavyChart.js
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Chart = dynamic(() => import('./Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false
});

export default function Analytics() {
  return (
    <div>
      <h1>Analytics</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Chart />
      </Suspense>
    </div>
  );
}
```

### Script Optimization

```jsx
// app/layout.js
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Load analytics after interactive */}
        <Script
          src="https://analytics.example.com"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 📝 Practice Exercises

### Exercise 1: Route Groups
Organize routes with groups

### Exercise 2: Middleware
Add authentication middleware

### Exercise 3: Caching
Implement multi-level caching

### Exercise 4: Error Handling
Create error and not-found pages

---

## ✅ Summary

- **Route groups** organize structure
- **Middleware** intercepts requests
- **Caching** improves performance
- **Revalidation** keeps data fresh
- **Error handling** improves UX
- **Dynamic imports** optimize load time

---

## 🔗 Next Steps

**Tomorrow (Day 5):** Capstone - Full-Stack Next.js Project  
**Continue:** Master advanced Next.js!

### Performance
- [ ] Are there obvious performance issues?
- [ ] Is the algorithm efficient?
- [ ] Are there unnecessary loops/queries?
- [ ] Is caching used appropriately?

### Readability
- [ ] Is the code easy to understand?
- [ ] Are variable names clear?
- [ ] Are comments helpful?
- [ ] Is code formatted consistently?

### Testing
- [ ] Are tests comprehensive?
- [ ] Do tests cover edge cases?
- [ ] Are tests maintainable?
- [ ] Is code coverage adequate?

### Security
- [ ] Is input validated?
- [ ] Are secrets secure?
- [ ] Is there SQL injection risk?
- [ ] Are permissions checked?

### Maintainability
- [ ] Is code DRY (Don't Repeat Yourself)?
- [ ] Could it be simplified?
- [ ] Are dependencies manageable?
- [ ] Is documentation updated?

## Example Code Review

### Bad Code
```javascript
// ❌ Issues: Hard to read, no error handling, inefficient
function p(a) {
  let r = [];
  for(let i=0; i<a.length; i++) {
    if(a[i].a > 5) {
      r.push(a[i]);
    }
  }
  return r;
}
```

### Good Code
```javascript
// ✅ Clear, well-tested, documented
/**
 * Filters users by minimum age
 * @param {Array} users - Array of user objects
 * @param {number} minAge - Minimum age threshold
 * @returns {Array} Filtered users
 */
function filterUsersByAge(users, minAge) {
  if (!Array.isArray(users)) {
    throw new Error('Users must be an array');
  }
  
  return users.filter(user => user.age > minAge);
}

// Tests
test('filters users above minimum age', () => {
  const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 17 },
    { name: 'Charlie', age: 30 }
  ];
  
  const result = filterUsersByAge(users, 18);
  expect(result).toEqual([
    { name: 'Alice', age: 25 },
    { name: 'Charlie', age: 30 }
  ]);
});
```

## Constructive Feedback Examples

### ❌ Bad feedback
```
"This is terrible code. Who wrote this?"
"This won't work."
"This is inefficient."
```

### ✅ Good feedback
```
"I see what you're trying to do here. Have you 
considered using a more efficient algorithm? 
This approach is O(n²) but we could do it in 
O(n log n) with a sorted structure."

"Great work on error handling! One suggestion: 
we could extract this validation logic into a 
separate function for reusability."

"Thanks for the thorough tests! I noticed we're 
not testing the case where the array is empty. 
Should we add that?"
```

## Code Review Guidelines

### For Reviewers

```
1. Review code, not the person
2. Ask questions, don't make accusations
3. Suggest improvements, don't demand them
4. Praise good code
5. Focus on important issues first
6. Explain the 'why' behind feedback
7. Be respectful of different approaches
8. Respond promptly
```

### For Authors

```
1. Don't take feedback personally
2. Ask for clarification if confused
3. Explain your reasoning if questioned
4. Update code based on feedback
5. Thank reviewers for their time
6. Don't force merge without approval
7. Ask for help if stuck
8. Learn from feedback
```

## Common Review Comments

### Performance Issues
```javascript
// ❌ Bad: N+1 query problem
async function getPostsWithComments() {
  const posts = await db.query('SELECT * FROM posts');
  for (let post of posts) {
    post.comments = await db.query(
      'SELECT * FROM comments WHERE post_id = ?',
      [post.id]
    );
  }
  return posts;
}

// ✅ Good: Single query with joins
async function getPostsWithComments() {
  return db.query(`
    SELECT p.*, c.* FROM posts p
    LEFT JOIN comments c ON p.id = c.post_id
  `);
}
```

### Error Handling
```javascript
// ❌ Bad: Silent failure
function parseJSON(str) {
  return JSON.parse(str);
}

// ✅ Good: Proper error handling
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    logger.error('Invalid JSON', { input: str, error: err });
    throw new Error('Failed to parse JSON');
  }
}
```

### Testing
```javascript
// ❌ Bad: Only happy path tested
test('create user', () => {
  const user = createUser({ name: 'John', email: 'john@example.com' });
  expect(user.name).toBe('John');
});

// ✅ Good: Multiple cases tested
test('create user with valid data', () => {
  const user = createUser({ name: 'John', email: 'john@example.com' });
  expect(user.name).toBe('John');
});

test('create user with invalid email', () => {
  expect(() => {
    createUser({ name: 'John', email: 'invalid' });
  }).toThrow('Invalid email');
});

test('create user with missing name', () => {
  expect(() => {
    createUser({ email: 'john@example.com' });
  }).toThrow('Name required');
});
```

## Review Template

```markdown
## Summary
Brief description of what was changed

## What's Working Well
- Point 1
- Point 2

## Suggestions for Improvement
1. **Performance**: Consider...
2. **Readability**: Suggest...
3. **Testing**: Add test for...

## Questions
- Question 1?
- Question 2?

## Approval
Approved with suggested changes
```

## Best Practices

- Review within 24 hours
- Keep reviews focused (< 400 lines)
- Test locally when possible
- Use automated tools (linters, type checkers)
- Have clear standards (style guide, testing requirements)
- Rotate reviewers for knowledge sharing
- Archive important discussions

## ✅ Checkpoint

- [ ] Know code review checklist
- [ ] Can give constructive feedback
- [ ] Can receive feedback well
- [ ] Know automated tools
- [ ] Can follow best practices

**Next:** Portfolio Building! 💼

