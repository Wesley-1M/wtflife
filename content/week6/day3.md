# Week 6: Day 3 - Custom Hooks

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 5 (React Fundamentals), Week 6 Days 1-2

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand custom hook patterns
- ✅ Extract stateful logic into reusable hooks
- ✅ Combine existing hooks (useState, useEffect, useContext)
- ✅ Build useful utility hooks
- ✅ Avoid common custom hook pitfalls
- ✅ Test custom hooks

---

## 1️⃣ What Are Custom Hooks?

### Rules of Hooks

Before creating custom hooks, you MUST follow the "Rules of Hooks":

1. **Only call hooks at the top level** - Not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from functional components or other custom hooks
3. **Use ESLint plugin** - `eslint-plugin-react-hooks` catches violations

### Creating Your First Custom Hook

A custom hook is just a **function that uses other hooks**:

```jsx
// ❌ This is NOT a custom hook - it's just a function
function calculateAge(birthYear) {
  return new Date().getFullYear() - birthYear;
}

// ✅ This IS a custom hook - uses hooks and starts with "use"
import { useState, useEffect } from 'react';

function useAge(birthYear) {
  const [age, setAge] = useState(0);

  useEffect(() => {
    setAge(new Date().getFullYear() - birthYear);
  }, [birthYear]);

  return age;
}
```

### Why Use Custom Hooks?

```jsx
// ❌ Without custom hook - duplicated logic
function PersonA() {
  const [age, setAge] = useState(0);

  useEffect(() => {
    setAge(new Date().getFullYear() - 1990);
  }, []);

  return <div>Age: {age}</div>;
}

function PersonB() {
  const [age, setAge] = useState(0);

  useEffect(() => {
    setAge(new Date().getFullYear() - 1985);
  }, []);

  return <div>Age: {age}</div>;
}

// ✅ With custom hook - reusable
function useAge(birthYear) {
  const [age, setAge] = useState(0);

  useEffect(() => {
    setAge(new Date().getFullYear() - birthYear);
  }, [birthYear]);

  return age;
}

function PersonA() {
  const age = useAge(1990);
  return <div>Age: {age}</div>;
}

function PersonB() {
  const age = useAge(1985);
  return <div>Age: {age}</div>;
}
```

---

## 2️⃣ Practical Custom Hooks

### useFetch - Fetch Data

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        
        if (!ignore) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => { ignore = true; }; // Cleanup
  }, [url]);

  return { data, loading, error };
}

// Usage:
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### useForm - Form Management

```jsx
import { useState, useCallback } from 'react';

function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(values);
  }, [values, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors
  };
}

// Usage:
function LoginForm() {
  const form = useForm(
    { email: '', password: '' },
    (values) => {
      console.log('Submitting:', values);
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <input
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### useLocalStorage - Persist State

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get from storage by key
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Set storage and state
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Usage:
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### usePrevious - Track Previous Value

```jsx
import { useEffect, useRef } from 'react';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage:
function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>Now: {count}, Before: {previousCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### useAsync - Handle Async Operations

```jsx
import { useState, useEffect } from 'react';

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const execute = async () => {
    setStatus('pending');
    setResult(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setResult(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { execute, status, result, error };
}

// Usage:
function DataFetcher() {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    return response.json();
  };

  const { status, result, error } = useAsync(fetchData);

  return (
    <div>
      {status === 'pending' && <div>Loading...</div>}
      {status === 'error' && <div>Error: {error?.message}</div>}
      {status === 'success' && <div>{JSON.stringify(result)}</div>}
    </div>
  );
}
```

---

## 3️⃣ Advanced Patterns

### useReducer in a Custom Hook

```jsx
import { useReducer } from 'react';

function useCounter(initialValue = 0) {
  const [count, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      case 'RESET':
        return initialValue;
      default:
        return state;
    }
  }, initialValue);

  return {
    count,
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' })
  };
}

// Usage:
function Counter() {
  const counter = useCounter(10);

  return (
    <div>
      <p>Count: {counter.count}</p>
      <button onClick={counter.increment}>+</button>
      <button onClick={counter.decrement}>-</button>
      <button onClick={counter.reset}>Reset</button>
    </div>
  );
}
```

### Combining Multiple Hooks

```jsx
function useAPI(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [url, retryCount]);

  return {
    data,
    loading,
    error,
    retry: () => setRetryCount(r => r + 1)
  };
}
```

---

## 4️⃣ Testing Custom Hooks

### Using React Testing Library

```jsx
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(-1);
  });
});
```

---

## 🎯 Common Custom Hooks Library

| Hook | Purpose |
|------|---------|
| `useFetch` | Fetch data from API |
| `useForm` | Manage form state |
| `useLocalStorage` | Persist state to localStorage |
| `usePrevious` | Access previous prop/state value |
| `useAsync` | Handle async operations |
| `useDebounce` | Debounce values |
| `useThrottle` | Throttle functions |
| `useWindowSize` | Track window dimensions |
| `useDocumentTitle` | Update document title |
| `useClickOutside` | Detect clicks outside element |

---

## 📝 Practice Exercises

### Exercise 1: Build useTodo Hook
Create a `useTodo` hook that manages:
- List of todos
- addTodo(text) function
- removeTodo(id) function
- toggleTodo(id) function
- clearCompleted() function

### Exercise 2: useInterval Hook
Build a hook that runs a function at intervals:
```jsx
const useInterval = (callback, delay) => {
  // Implementation
};

// Usage
function Timer() {
  const [count, setCount] = useState(0);
  useInterval(() => setCount(c => c + 1), 1000);
  return <div>{count}</div>;
}
```

### Exercise 3: useDebounce Hook
Create a hook that debounces values:
```jsx
function SearchUsers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // Only fetch when debounced value changes
    fetchUsers(debouncedSearch);
  }, [debouncedSearch]);
}
```

### Exercise 4: Combine Multiple Hooks
Build a `useSettings` hook that:
- Uses useLocalStorage for persistence
- Uses useState for current values
- Uses useContext for settings context
- Returns settings object and update functions

---

## ✅ Summary

- **Custom hooks are functions** that use other hooks
- **Extract logic** into reusable hooks instead of duplicating code
- **Follow the rules** of hooks - top level, function components
- **Common patterns** include useFetch, useForm, useLocalStorage
- **Test hooks** using renderHook from React Testing Library
- **Combine hooks** to build powerful abstractions

---

## 🔗 Next Steps

**Tomorrow (Day 4):** Performance Optimization - Memoization and optimization  
**This Week:** Master advanced state management patterns

