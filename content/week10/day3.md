# Week 10: Day 3 - Memory Management & Garbage Collection

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Week 10 Days 1-2

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand memory leaks
- ✅ Debug memory issues
- ✅ Manage component cleanup
- ✅ Optimize memory usage
- ✅ Use DevTools memory profiler

---

## 1️⃣ JavaScript Memory Management

### Memory Lifecycle

```javascript
// 1. Allocate
let str = 'Hello'; // Memory allocated for string

// 2. Use
console.log(str);  // Use the value

// 3. Release
str = null;        // Release memory (garbage collection)
```

### Reference Types

```javascript
// Primitive types (stack)
let num = 5;
let bool = true;
let str = 'text';

// Reference types (heap)
let obj = { name: 'John' };
let arr = [1, 2, 3];
let func = () => {};

// Copy vs Reference
let a = 5;
let b = a;        // Copy value
b = 10;
console.log(a);   // Still 5

let obj1 = { x: 10 };
let obj2 = obj1;  // Reference
obj2.x = 20;
console.log(obj1.x);  // 20 - affected!
```

---

## 2️⃣ Memory Leaks

### Common Leak Patterns

```jsx
// ❌ Leak 1: Dangling listeners
function Component() {
  useEffect(() => {
    const handleResize = () => {
      console.log('resized');
    };
    
    window.addEventListener('resize', handleResize);
    // Missing cleanup!
  }, []);
}

// ✅ Fixed
function Component() {
  useEffect(() => {
    const handleResize = () => {
      console.log('resized');
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
```

```jsx
// ❌ Leak 2: Dangling timers
function Component() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('tick');
    }, 1000);
    // Missing cleanup!
  }, []);
}

// ✅ Fixed
function Component() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('tick');
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
}
```

```jsx
// ❌ Leak 3: Subscriptions
class Component extends React.Component {
  componentDidMount() {
    this.subscription = eventEmitter.subscribe(data => {
      console.log(data);
    });
    // Missing unsubscribe!
  }
}

// ✅ Fixed
class Component extends React.Component {
  componentDidMount() {
    this.subscription = eventEmitter.subscribe(data => {
      console.log(data);
    });
  }
  
  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
}
```

---

## 3️⃣ Detecting Memory Issues

### Chrome DevTools Memory Tab

```
Steps:
1. Open DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot
4. Perform action
5. Take another snapshot
6. Compare snapshots

Look for:
- Growing heap size
- Detached DOM nodes
- Retained objects
```

### Finding Leaks

```javascript
// Force garbage collection
// In DevTools console:
// ctrl + shift + delete (Windows)
// cmd + option + e (Mac)
```

### Snapshot Analysis

```
Right-click heap snapshot > Take heap snapshot

Three views:
1. Summary - Objects by type
2. Comparison - Diff between snapshots
3. Containment - Object tree
```

---

## 4️⃣ Cleanup Patterns

### useEffect Cleanup

```jsx
// Pattern 1: Event listeners
useEffect(() => {
  const handler = (e) => console.log(e);
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []);

// Pattern 2: Timers
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('done');
  }, 1000);
  return () => clearTimeout(timer);
}, []);

// Pattern 3: Intervals
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);
  return () => clearInterval(interval);
}, []);

// Pattern 4: API calls
useEffect(() => {
  let isMounted = true;
  
  fetch('/api/data')
    .then(r => r.json())
    .then(data => {
      if (isMounted) {
        setState(data);
      }
    });
  
  return () => {
    isMounted = false;
  };
}, []);

// Pattern 5: Subscriptions
useEffect(() => {
  const subscription = eventEmitter.subscribe(handler);
  return () => subscription.unsubscribe();
}, []);
```

### AbortController for Fetch

```javascript
// Cancel in-flight requests
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', {
    signal: controller.signal
  })
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(err => {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      }
    });
  
  return () => controller.abort();
}, []);
```

---

## 5️⃣ Optimization Strategies

### Avoid Memory Leaks

```jsx
// ❌ Bad - Object recreated each render
function Component({ data }) {
  return <Child config={{ filter: true }} />;
}

// ✅ Good - Stable reference
const CONFIG = { filter: true };

function Component({ data }) {
  return <Child config={CONFIG} />;
}

// Or use useMemo
function Component({ data }) {
  const config = useMemo(
    () => ({ filter: true }),
    []
  );
  return <Child config={config} />;
}
```

### Debounce/Throttle

```javascript
// Debounce - wait until action stops
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle - limit frequency
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const handleResize = debounce(() => {
  console.log('window resized');
}, 300);

window.addEventListener('resize', handleResize);
```

### WeakMap/WeakSet

```javascript
// WeakMap - doesn't prevent garbage collection
const cache = new WeakMap();

const obj = { id: 1 };
cache.set(obj, 'cached value');

// When obj is deleted, cache entry is too
obj = null;
```

---

## 6️⃣ Memory Monitoring

### Performance Observer API

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

### Memory Gauge

```javascript
// Check available memory
if (performance.memory) {
  console.log({
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
  });
}
```

---

## 📝 Practice Exercises

### Exercise 1: Find Memory Leak
Given code with leaks, identify and fix

### Exercise 2: Profile Component
Use DevTools to profile React component

### Exercise 3: Cleanup Patterns
Implement proper cleanup in useEffect

### Exercise 4: Optimize Large List
Prevent memory issues with virtualization

---

## ✅ Summary

- **Memory leaks** from missing cleanup
- **Event listeners** must be removed
- **Timers** need clearing
- **DevTools** finds memory issues
- **Cleanup functions** prevent leaks
- **WeakMap** for non-blocking references

---

## 🔗 Next Steps

**Tomorrow (Day 4):** Lazy Loading & Code Splitting  
**Continue:** Build memory-efficient applications!

## ✅ Checkpoint

- [ ] Understand Docker
- [ ] Can containerize apps
- [ ] Know Docker Compose
- [ ] Understand K8s basics

**Next:** Monitoring & Scaling! 🚀

