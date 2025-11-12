# Week 10: Day 4 - Lazy Loading & Code Splitting

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 10 Days 1-3

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Implement lazy loading patterns
- ✅ Code split applications
- ✅ Load routes dynamically
- ✅ Optimize bundle size
- ✅ Handle loading states

---

## 1️⃣ Component Lazy Loading

### React.lazy & Suspense

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

### Dynamic Imports

```jsx
// Load on demand
import { useState } from 'react';

export function App() {
  const [Modal, setModal] = useState(null);

  const openModal = async () => {
    const { ConfirmModal } = await import('./ConfirmModal');
    setModal(() => ConfirmModal);
  };

  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      {Modal && <Modal />}
    </>
  );
}
```

### Suspense Boundaries

```jsx
function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Header />
      <Suspense fallback={<ContentLoader />}>
        <MainContent />
      </Suspense>
      <Suspense fallback={<SidebarLoader />}>
        <Sidebar />
      </Suspense>
    </Suspense>
  );
}
```

---

## 2️⃣ Route-Based Code Splitting

### React Router

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Nested Route Splitting

```jsx
const AdminPanel = lazy(() => import('./admin'));

export function App() {
  return (
    <Routes>
      <Route path="/admin/*" 
        element={
          <Suspense fallback={<AdminLoader />}>
            <AdminPanel />
          </Suspense>
        }
      />
    </Routes>
  );
}

// admin/index.jsx
export function AdminPanel() {
  return (
    <Routes>
      <Route path="/users" 
        element={
          <Suspense fallback={<UserLoader />}>
            <UserManagement />
          </Suspense>
        }
      />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
```

---

## 3️⃣ Image Lazy Loading

### Intersection Observer

```jsx
import { useRef, useEffect, useState } from 'react';

export function LazyImage({ src, alt }) {
  const [imageUrl, setImageUrl] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageUrl(src);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageUrl || 'placeholder.jpg'}
      alt={alt}
    />
  );
}
```

### Native Lazy Loading

```jsx
export function OptimizedImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

// Usage
<OptimizedImage 
  src="large-image.jpg" 
  alt="Product"
/>
```

### Picture Element

```jsx
export function ResponsiveImage() {
  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet="large.jpg"
        loading="lazy"
      />
      <source
        media="(min-width: 768px)"
        srcSet="medium.jpg"
        loading="lazy"
      />
      <img
        src="small.jpg"
        alt="Responsive"
        loading="lazy"
      />
    </picture>
  );
}
```

---

## 4️⃣ Bundle Analysis & Optimization

### Webpack Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'report.html'
    })
  ]
};
```

### Identifying Large Dependencies

```bash
# Analyze with npm
npm ls

# Find duplicate packages
npm dedupe

# Check bundle size
npm install bundlesize --save-dev
```

### Tree Shaking

```javascript
// ✅ Good - Named exports
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// app.js - Only 'add' imported
import { add } from './math.js';
console.log(add(5, 3)); // subtract is tree-shaken away

// ❌ Bad - Default export
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

---

## 5️⃣ Progressive Loading Patterns

### Prefetching

```jsx
// Prefetch on hover
import { useEffect } from 'react';

const Dashboard = React.lazy(() => import('./Dashboard'));

export function NavigationLink() {
  const handleMouseEnter = () => {
    import('./Dashboard');
  };

  return (
    <a href="/dashboard" onMouseEnter={handleMouseEnter}>
      Dashboard
    </a>
  );
}
```

### Request Idle Callback

```javascript
// Load when browser is idle
function prefetchHeavyComponent() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('./HeavyComponent');
    });
  } else {
    setTimeout(() => {
      import('./HeavyComponent');
    }, 2000);
  }
}

prefetchHeavyComponent();
```

### Progressive Enhancement

```jsx
function App() {
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/theme.css';
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);
  }, []);

  return cssLoaded ? <MainApp /> : <BasicApp />;
}
```

---

## 6️⃣ Monitoring Load Performance

### Performance Metrics

```javascript
// Check code split chunk loading
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === 'script') {
      console.log(`Loaded ${entry.name}: ${entry.duration}ms`);
    }
  }
});

perfObserver.observe({ entryTypes: ['resource'] });
```

### Network Priority

```jsx
// High priority load
<script src="critical.js" defer></script>

// Lower priority load
<link rel="prefetch" href="/fonts/secondary.woff2" />
<link rel="preload" href="/images/hero.jpg" as="image" />
```

---

## 📝 Practice Exercises

### Exercise 1: Code Split Routes
Convert app to use lazy-loaded routes

### Exercise 2: Lazy Image Gallery
Implement image lazy loading

### Exercise 3: Bundle Analysis
Analyze and optimize bundle size

### Exercise 4: Prefetch Strategy
Add prefetching to heavy components

---

## ✅ Summary

- **Lazy loading** reduces initial bundle
- **Code splitting** at routes and components
- **Intersection Observer** for images
- **Bundle analysis** identifies problems
- **Tree shaking** removes unused code
- **Prefetching** improves UX

---

## 🔗 Next Steps

**Tomorrow (Day 5):** Capstone - Production Optimization  
**Continue:** Master performance optimization!

## Example

```javascript
// Prometheus metrics
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'status']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({
      method: req.method,
      status: res.statusCode
    }, duration);
  });
  next();
});
```

## ✅ Checkpoint

- [ ] Know monitoring tools
- [ ] Can set up metrics
- [ ] Understand scaling
- [ ] Know optimization

**Next:** Week 10 Project! 🚀

