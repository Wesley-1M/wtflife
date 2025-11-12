# Week 10: Day 5 - Capstone: Production Optimization

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Week 10 Days 1-4

---

## 📚 Learning Objectives

By the end of this capstone, you'll be able to:
- ✅ Profile complete applications
- ✅ Identify optimization opportunities
- ✅ Implement comprehensive optimizations
- ✅ Measure performance improvements
- ✅ Deploy optimized production builds

---

## 🎯 Project Overview

Build a real-world e-commerce product listing page with:
- Large product dataset (1000+ items)
- Image gallery with hundreds of images
- Dynamic filtering and search
- Performance monitoring
- Optimized production build

---

## 1️⃣ Setup & Baseline

### Create Project

```bash
# Create Vite React app
npm create vite@latest ecommerce-optimized -- --template react
cd ecommerce-optimized
npm install

# Install dependencies
npm install zustand react-router-dom axios
npm install -D webpack-bundle-analyzer
```

### Baseline Performance Check

```javascript
// src/utils/performance.js
export function logMetrics() {
  if (performance.memory) {
    console.log('Memory:', {
      used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + 'MB',
      limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + 'MB'
    });
  }

  performance.mark('app-loaded');
  const navigation = performance.getEntriesByType('navigation')[0];
  console.log('Navigation:', {
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart
  });
}

export function measureComponent(name) {
  return {
    start: () => performance.mark(`${name}-start`),
    end: () => {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
    }
  };
}
```

---

## 2️⃣ Create Unoptimized Version

### Initial Product Component

```jsx
// src/components/ProductCard.jsx
export function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="description">{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

### Product List

```jsx
// src/pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate large dataset
    const products = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      price: Math.random() * 1000,
      image: `https://via.placeholder.com/300x300?text=Product${i}`,
      description: `Description for product ${i}`,
      category: ['electronics', 'clothing', 'home'][i % 3]
    }));
    setProducts(products);
  }, []);

  const filtered = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('electronics')}>Electronics</button>
        <button onClick={() => setFilter('clothing')}>Clothing</button>
        <button onClick={() => setFilter('home')}>Home</button>
      </div>

      <div className="product-grid">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---

## 3️⃣ Apply Optimizations

### Memoization

```jsx
// src/components/ProductCard.jsx
import { memo } from 'react';

export const ProductCard = memo(function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} loading="lazy" />
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <p className="description">{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
});
```

### Virtualization

```jsx
// src/pages/ProductList.jsx
import { memo, useState, useEffect, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { ProductCard } from '../components/ProductCard';

const ProductRow = memo(({ index, style, data }) => (
  <div style={style} className="product-row">
    {data[index].map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
));

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const products = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      price: Math.random() * 1000,
      image: `https://via.placeholder.com/300x300?text=Product${i}`,
      description: `Description for product ${i}`,
      category: ['electronics', 'clothing', 'home'][i % 3]
    }));
    setProducts(products);
  }, []);

  const filtered = useMemo(() => 
    filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter),
    [products, filter]
  );

  // Group into rows of 4
  const rows = useMemo(() => {
    const grouped = [];
    for (let i = 0; i < filtered.length; i += 4) {
      grouped.push(filtered.slice(i, i + 4));
    }
    return grouped;
  }, [filtered]);

  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('electronics')}>Electronics</button>
        <button onClick={() => setFilter('clothing')}>Clothing</button>
        <button onClick={() => setFilter('home')}>Home</button>
      </div>

      <FixedSizeList
        height={800}
        itemCount={rows.length}
        itemSize={350}
        width="100%"
        itemData={rows}
      >
        {ProductRow}
      </FixedSizeList>
    </div>
  );
}
```

### Code Splitting

```jsx
// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## 4️⃣ Performance Monitoring

### Setup Web Vitals

```javascript
// src/utils/vitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function initVitals() {
  getCLS(metric => console.log('CLS:', metric.value));
  getFID(metric => console.log('FID:', metric.value));
  getFCP(metric => console.log('FCP:', metric.value));
  getLCP(metric => console.log('LCP:', metric.value));
  getTTFB(metric => console.log('TTFB:', metric.value));
}
```

### Custom Hooks for Monitoring

```jsx
// src/hooks/usePerformance.js
import { useEffect } from 'react';

export function usePerformance(componentName) {
  useEffect(() => {
    performance.mark(`${componentName}-mount`);

    return () => {
      performance.mark(`${componentName}-unmount`);
      performance.measure(
        componentName,
        `${componentName}-mount`,
        `${componentName}-unmount`
      );
      const measure = performance.getEntriesByName(componentName)[0];
      console.log(`${componentName} render time: ${measure.duration.toFixed(2)}ms`);
    };
  }, [componentName]);
}
```

---

## 5️⃣ Build Optimization

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'state': ['zustand']
        }
      }
    }
  }
});
```

### Environment Setup

```javascript
// vite.config.js - continued
export default defineConfig({
  build: {
    reportCompressedSize: false,
    sourcemap: false,
    target: 'ES2020'
  },
  // Enable brotli compression
  server: {
    middlewareMode: true
  }
});
```

---

## 6️⃣ Deployment & Testing

### Production Build

```bash
# Build optimized version
npm run build

# Analyze bundle
npm run analyze

# Test locally
npm install -g http-server
cd dist
http-server -c-1
```

### Performance Testing

```bash
# Lighthouse in Chrome DevTools
1. Open DevTools
2. Go to Lighthouse tab
3. Generate report
4. Note performance score
5. Identify remaining bottlenecks
```

---

## 📝 Deliverables

### Document

Create `OPTIMIZATION_REPORT.md`:

```markdown
# Optimization Report

## Metrics

### Before Optimization
- Initial Load: 5.2s
- LCP: 3.8s
- CLS: 0.15
- Bundle Size: 850KB

### After Optimization
- Initial Load: 1.8s (65% improvement)
- LCP: 1.2s (68% improvement)
- CLS: 0.02 (87% improvement)
- Bundle Size: 280KB (67% smaller)

## Optimizations Applied

1. ✅ Component memoization
2. ✅ List virtualization
3. ✅ Code splitting
4. ✅ Image lazy loading
5. ✅ Bundle analysis

## Recommendations

- Implement service workers for offline
- Add image optimization CDN
- Use HTTP/2 Server Push
```

---

## ✅ Submission Checklist

- [ ] Optimized ProductList component
- [ ] Virtualized list implementation
- [ ] Code splitting in routes
- [ ] Performance monitoring setup
- [ ] Build optimization config
- [ ] Lighthouse score 80+
- [ ] Optimization report
- [ ] Working production build

---

## 🔗 Next Steps

**Next Week (Week 11):** Next.js Framework  
**Congratulations:** You've mastered optimization!

