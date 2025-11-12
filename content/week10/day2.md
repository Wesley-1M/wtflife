# Week 10: Day 2 - Performance Profiling & Optimization

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Week 10 Day 1

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Profile React applications
- ✅ Identify performance bottlenecks
- ✅ Optimize rendering performance
- ✅ Use DevTools effectively
- ✅ Implement performance best practices

---

## 1️⃣ Chrome DevTools Performance Tab

### Recording Performance

```
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click record button
4. Interact with app
5. Stop recording
6. Analyze timeline

Look for:
- Long tasks (>50ms)
- Dropped frames
- Memory spikes
- Network bottlenecks
```

### Reading Flame Charts

```
Colors:
- Yellow: JavaScript execution
- Purple: Rendering
- Green: Painting
- Blue: Network

Width = Time taken
Height = Stack depth
```

---

## 2️⃣ React Profiler

### Using React DevTools

```bash
# Install React DevTools browser extension
# Chrome Web Store search: "React Developer Tools"
```

```jsx
// Enable Profiling
import { Profiler } from 'react';

function onRenderCallback(
  id,      // component id
  phase,   // mount or update
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

export function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Component />
    </Profiler>
  );
}
```

### Profiler Tab

```
1. Open React DevTools
2. Go to Profiler tab
3. Start recording
4. Interact with app
5. Stop recording
6. Analyze renders

View:
- Component render times
- Render reasons
- Flamegraph
- Ranked chart
```

---

## 3️⃣ Common Performance Issues

### Unnecessary Re-renders

```jsx
// ❌ Bad - Re-renders on every parent update
function Child() {
  return <div>Child</div>;
}

// ✅ Good - Memoized
import { memo } from 'react';

const Child = memo(function Child() {
  return <div>Child</div>;
});
```

### Slow List Rendering

```jsx
// ❌ Bad - Re-renders entire list
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// ✅ Good - Virtualized list
import { FixedSizeList } from 'react-window';

function UserList({ users }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={35}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {users[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}
```

### Object Creation in Render

```jsx
// ❌ Bad - New object every render
function Component() {
  const config = { color: 'red', size: 10 };
  return <Child config={config} />;
}

// ✅ Good - Stable object
const config = { color: 'red', size: 10 };

function Component() {
  return <Child config={config} />;
}

// Or use useMemo
function Component() {
  const config = useMemo(
    () => ({ color: 'red', size: 10 }),
    []
  );
  return <Child config={config} />;
}
```

---

## 4️⃣ Optimization Techniques

### Code Splitting

```javascript
// Lazy load components
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

### Bundle Analysis

```bash
npm install webpack-bundle-analyzer --save-dev
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Image Optimization

```jsx
// ✅ Lazy load images
import { useState } from 'react';

export function Image({ src, alt }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <img
      src={isVisible ? src : 'placeholder.jpg'}
      alt={alt}
      loading="lazy"
      onIntersection={([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      }}
    />
  );
}

// Or use native lazy loading
<img src="large-image.jpg" loading="lazy" alt="Description" />
```

---

## 5️⃣ Monitoring Performance

### Web Vitals

```bash
npm install web-vitals
```

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // Send to your analytics service
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Performance API

```javascript
// Mark and measure
performance.mark('component-start');
// ... do work ...
performance.mark('component-end');

performance.measure(
  'component-time',
  'component-start',
  'component-end'
);

const measure = performance.getEntriesByName('component-time')[0];
console.log(`Took ${measure.duration}ms`);
```

---

## 📝 Practice Exercises

### Exercise 1: Profile App
Use DevTools to find bottlenecks

### Exercise 2: Optimize List
Implement virtualization for large list

### Exercise 3: Code Split
Add lazy loading to routes

### Exercise 4: Monitor Metrics
Track Web Vitals in application

---

## ✅ Summary

- **Profiling** identifies bottlenecks
- **Memoization** prevents re-renders
- **Code splitting** reduces bundle size
- **Virtualization** handles large lists
- **Monitoring** tracks real performance
- **Best practices** prevent issues

---

## 🔗 Next Steps

**Tomorrow (Day 3):** Memory Management & Garbage Collection  
**Continue:** Build lightning-fast applications!
```

## ✅ Checkpoint

- [ ] Know WebSocket basics
- [ ] Can use Socket.io
- [ ] Understand real-time patterns
- [ ] Know when to use

**Next:** DevOps & Deployment! 🚀

