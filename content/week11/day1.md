# Week 11: Day 1 - Next.js Fundamentals

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 10 Complete (React & Performance)

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand Next.js benefits and architecture
- ✅ Set up a Next.js project
- ✅ Create pages and routes
- ✅ Understand SSR vs SSG vs ISR
- ✅ Implement server-side rendering

---

## 1️⃣ Why Next.js?

### React vs Next.js

```
React:
- Client-side only (by default)
- Manual setup needed
- SEO requires extra work
- Slower first page load

Next.js:
- Built on React
- Full-stack framework
- Built-in SEO
- Optimized performance
- File-based routing
- API routes included
```

### Key Benefits

```javascript
// 1. SSR - Server-side rendering
// Page loads faster, SEO friendly

// 2. SSG - Static generation
// Pre-built pages, fastest performance

// 3. ISR - Incremental Static Regeneration
// Combine SSG speed with dynamic updates

// 4. API Routes
// Backend included, no separate server needed

// 5. Image Optimization
// Automatic image sizing and formats

// 6. Built-in features
// TypeScript, CSS, env variables, etc.
```

---

## 2️⃣ Setup & Project Structure

### Create Next.js App

```bash
# Using create-next-app
npx create-next-app@latest myapp --typescript --tailwind --eslint
cd myapp

# Or manually
npm create-next-app@latest
```

### Project Structure

```
app/
  layout.js         # Root layout
  page.js           # Home page (/)
  about/
    page.js         # /about route
  blog/
    [slug]/
      page.js       # /blog/[slug] dynamic route
  api/
    users/
      route.js      # /api/users API route
pages/             # Legacy Pages Router (optional)
public/            # Static files
styles/            # CSS modules
lib/               # Shared utilities
.env.local         # Environment variables
next.config.js     # Next.js configuration
```

### Basic Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
```

---

## 3️⃣ Pages & Routing

### File-Based Routing

```
app/page.js              → /
app/about/page.js        → /about
app/blog/page.js         → /blog
app/blog/[slug]/page.js  → /blog/nextjs
```

### Page Component

```jsx
// app/page.js
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js</h1>
      <p>Build modern web applications</p>
    </main>
  );
}
```

### Dynamic Routes

```jsx
// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  const { slug } = params;

  return (
    <article>
      <h1>Blog Post: {slug}</h1>
      <p>Content for {slug}</p>
    </article>
  );
}

// Generate static paths
export async function generateStaticParams() {
  return [
    { slug: 'nextjs-intro' },
    { slug: 'react-hooks' },
    { slug: 'web-performance' }
  ];
}
```

### Catch-All Routes

```jsx
// app/docs/[[...slug]]/page.js
export default function Docs({ params }) {
  const { slug } = params;

  if (!slug) {
    return <h1>Documentation Home</h1>;
  }

  return (
    <div>
      <h1>Docs: {slug.join(' / ')}</h1>
    </div>
  );
}

// /docs → Documentation Home
// /docs/guides → guides
// /docs/guides/getting-started → guides/getting-started
```

---

## 4️⃣ Server-Side Rendering (SSR)

### getServerSideProps (Pages Router - legacy)

```jsx
// pages/posts/[id].js
export async function getServerSideProps(context) {
  const { id } = context.params;

  const res = await fetch(`/api/posts/${id}`);
  const post = await res.json();

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60 // Revalidate every 60 seconds
  };
}

export default function Post({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### Server Components (App Router - new)

```jsx
// app/blog/[slug]/page.js
async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <time>{new Date(post.date).toDateString()}</time>
    </article>
  );
}
```

---

## 5️⃣ Static Generation & ISR

### Static Generation (SSG)

```jsx
// app/blog/page.js
export const revalidate = 3600; // Revalidate every hour

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function BlogList() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

### Incremental Static Regeneration (ISR)

```jsx
// app/products/[id]/page.js
export const revalidate = 10; // Revalidate every 10 seconds

export async function generateStaticParams() {
  // Pre-build popular products
  const products = await fetch('https://api.example.com/products').then(r => r.json());
  return products.map(p => ({
    id: p.id.toString()
  }));
}

async function getProduct(id) {
  const res = await fetch(`https://api.example.com/products/${id}`);
  return res.json();
}

export default async function Product({ params }) {
  const product = await getProduct(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}
```

---

## 6️⃣ Layouts & Components

### Root Layout

```jsx
// app/layout.js
import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'Generated by Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>Navigation</nav>
        </header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

### Nested Layouts

```jsx
// app/blog/layout.js
import { Sidebar } from '@/components/Sidebar';

export default function BlogLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
```

### Reusable Components

```jsx
// app/components/PostCard.jsx
'use client';

import Link from 'next/link';

export function PostCard({ post }) {
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`}>
        Read more
      </Link>
    </article>
  );
}
```

---

## 📝 Practice Exercises

### Exercise 1: Create Pages
Build pages for Home, About, Contact

### Exercise 2: Dynamic Route
Create dynamic blog post pages

### Exercise 3: Layout
Implement nested layout with sidebar

### Exercise 4: Rendering Strategy
Mix SSG, SSR, and ISR strategically

---

## ✅ Summary

- **Next.js** is React + full-stack framework
- **File-based routing** simplifies navigation
- **SSR** renders on server (fresh content)
- **SSG** pre-builds static pages (fast)
- **ISR** revalidates pages on-demand
- **Layouts** share UI across pages
- **Server components** fetch data securely

---

## 🔗 Next Steps

**Tomorrow (Day 2):** Static Generation & ISR Deep Dive  
**Continue:** Master Next.js rendering strategies!

