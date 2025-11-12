# Week 6: Day 4 - Performance Optimization

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 5-6 Days 1-3

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Identify performance bottlenecks
- ✅ Use React.memo to prevent re-renders
- ✅ Memoize values with useMemo
- ✅ Memoize functions with useCallback
- ✅ Use React DevTools Profiler
- ✅ Implement code splitting

---

## 1️⃣ Understanding Re-renders

### What Causes Re-renders?

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <p>Count: {count}</p>
      <ExpensiveChild /> {/* Re-renders even though props didn't change! */}
    </div>
  );
}

function ExpensiveChild() {
  // This component re-renders whenever Parent re-renders
  // Even if nothing changed for this component
  const result = expensiveCalculation();
  return <div>{result}</div>;
}
```

### React DevTools Profiler

```jsx
// Measure component render time
import { Profiler } from 'react';

function App() {
  const onRenderCallback = (id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  };

  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MyComponent />
    </Profiler>
  );
}
```

---

## 2️⃣ React.memo - Prevent Child Re-renders

### Basic Memoization

```jsx
// ❌ Without memo - re-renders every time parent renders
function UserCard({ name, email }) {
  console.log('UserCard rendered');
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}

// ✅ With memo - only re-renders if props change
const UserCard = React.memo(function UserCard({ name, email }) {
  console.log('UserCard rendered');
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
});

// Usage
function App() {
  const [search, setSearch] = useState('');
  const user = { name: 'Alice', email: 'alice@example.com' };

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <UserCard {...user} /> {/* Only re-renders if user object changes */}
    </div>
  );
}
```

### Custom Comparison

```jsx
const UserCard = React.memo(
  function UserCard({ name, email }) {
    return (
      <div>
        <p>{name}</p>
        <p>{email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.name === nextProps.name;
  }
);
```

---

## 3️⃣ useMemo - Memoize Expensive Calculations

### When to Use

```jsx
// ❌ BAD - Calculation runs every render
function UserList({ users, sortBy }) {
  const sortedUsers = users
    .filter(u => u.active)
    .sort((a, b) => {
      // Expensive sorting algorithm
      return a[sortBy].localeCompare(b[sortBy]);
    });

  return (
    <ul>
      {sortedUsers.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}

// ✅ GOOD - Calculation only runs when users/sortBy change
function UserList({ users, sortBy }) {
  const sortedUsers = useMemo(() => {
    return users
      .filter(u => u.active)
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [users, sortBy]);

  return (
    <ul>
      {sortedUsers.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

### Common Use Cases

```jsx
// Filtering large lists
const filteredItems = useMemo(
  () => items.filter(item => item.category === selectedCategory),
  [items, selectedCategory]
);

// Expensive calculations
const stats = useMemo(() => {
  return {
    total: data.reduce((sum, d) => sum + d.value, 0),
    average: data.reduce((sum, d) => sum + d.value, 0) / data.length,
    max: Math.max(...data.map(d => d.value))
  };
}, [data]);

// Preventing object reference changes
const config = useMemo(
  () => ({ color: 'blue', size: 'large' }),
  []
);
```

---

## 4️⃣ useCallback - Memoize Functions

### The Problem

```jsx
// ❌ New function every render - breaks child memoization
function Parent() {
  const handleClick = () => {
    console.log('clicked');
  };

  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

// Child re-renders every time because handleClick is a new function
```

### The Solution

```jsx
// ✅ Same function reference - Child memoization works
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Dependencies

  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

// Child only re-renders if onClick reference changes
```

### With Dependencies

```jsx
function Parent({ userId }) {
  const [count, setCount] = useState(0);

  // Handler changes when userId changes
  const handleSave = useCallback(() => {
    fetch(`/api/users/${userId}/data`);
  }, [userId]); // Re-create when userId changes

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <Child onSave={handleSave} />
    </div>
  );
}
```

---

## 5️⃣ Practical Optimization Example

### Before Optimization

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  };

  const handleSelect = (result) => {
    console.log('Selected:', result);
  };

  return (
    <div>
      <button onClick={handleSearch}>Search</button>
      {loading && <div>Loading...</div>}
      <ResultList results={results} onSelect={handleSelect} />
    </div>
  );
}

const ResultList = ({ results, onSelect }) => {
  return (
    <ul>
      {results.map(r => (
        <ResultItem key={r.id} result={r} onSelect={onSelect} />
      ))}
    </ul>
  );
};

// This re-renders every time parent re-renders
const ResultItem = ({ result, onSelect }) => {
  return <li onClick={() => onSelect(result)}>{result.name}</li>;
};
```

### After Optimization

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(() => {
    setLoading(true);
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  }, [query]);

  const handleSelect = useCallback((result) => {
    console.log('Selected:', result);
  }, []);

  return (
    <div>
      <button onClick={handleSearch}>Search</button>
      {loading && <div>Loading...</div>}
      <ResultList results={results} onSelect={handleSelect} />
    </div>
  );
}

const ResultList = React.memo(({ results, onSelect }) => {
  return (
    <ul>
      {results.map(r => (
        <ResultItem key={r.id} result={r} onSelect={onSelect} />
      ))}
    </ul>
  );
});

const ResultItem = React.memo(({ result, onSelect }) => {
  return <li onClick={() => onSelect(result)}>{result.name}</li>;
});
```

---

## 6️⃣ Code Splitting & Lazy Loading

### React.lazy

```jsx
import { lazy, Suspense } from 'react';

// Lazy load component only when needed
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <button onClick={() => setShowHeavy(!showHeavy)}>
        Toggle Heavy
      </button>
      
      {showHeavy && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}
```

### Route-based Splitting

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## 🎯 Optimization Checklist

- [ ] Profile first - identify real bottlenecks
- [ ] Memoize expensive calculations with useMemo
- [ ] Prevent unnecessary re-renders with React.memo
- [ ] Memoize callbacks with useCallback
- [ ] Implement code splitting for large features
- [ ] Monitor bundle size
- [ ] Test performance improvements

---

## ⚠️ Common Mistakes

```jsx
// ❌ Memoizing too much
const Component = React.memo(() => <div>Simple component</div>);

// ❌ useMemo without dependencies
const value = useMemo(() => {
  return expensiveCalculation();
}); // Runs every render!

// ❌ useCallback with wrong dependencies
const handleClick = useCallback(() => {
  setCount(count + 1); // count not in dependencies!
}, []);
```

---

## ✅ Summary

- **Profile before optimizing** - find real bottlenecks
- **React.memo** - prevent re-renders of pure components
- **useMemo** - memoize expensive calculations
- **useCallback** - memoize event handlers
- **Code splitting** - load components on demand
- **Premature optimization is evil** - measure first!

---

## � Next Steps

**Tomorrow (Day 5):** Form Handling & Validation  
**This Week:** Complete React state management mastery

