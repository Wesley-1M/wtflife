# Week 5: Day 4 - Effects & Side Effects with useEffect

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Intermediate to Advanced)  
**Prerequisites:** Week 5 Days 1-3 (React Basics, Components, State)

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand side effects in React
- ✅ Use the useEffect hook
- ✅ Control when effects run with dependencies
- ✅ Clean up effects properly
- ✅ Fetch data from APIs
- ✅ Handle effect errors

---

## 1️⃣ What are Side Effects?

### Side Effects vs Pure Functions
```javascript
// Pure function - same input always produces same output
function add(a, b) {
  return a + b;
}

// Side effect - interacts with outside world
function saveToDatabase(data) {
  fetch('/api/save', { method: 'POST', body: data });
}

// Side effects in React components:
// - Fetching data
// - Setting timers
// - Updating document title
// - Subscribing to events
// - LocalStorage operations
```

### Why useEffect?
```jsx
// ❌ DON'T do this in component body
function UserProfile() {
  fetch('/api/user'); // Runs every render! ❌
  
  return <div>User data</div>;
}

// ✅ DO use useEffect
import { useEffect, useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // Empty dependency = run once on mount
  
  return <div>{user?.name}</div>;
}
```

---

## 2️⃣ The useEffect Hook

### Basic Syntax
```jsx
import { useEffect } from 'react';

useEffect(() => {
  // Code runs after component renders
  console.log('Component rendered!');
});

// With dependency array
useEffect(() => {
  console.log('Effect runs when count changes');
}, [count]);

// With cleanup function
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  
  // Cleanup function (runs before effect runs again or on unmount)
  return () => clearInterval(timer);
}, []);
```

### Dependency Array Rules

```jsx
// 1. No dependency array - runs after EVERY render
useEffect(() => {
  console.log('Runs after EVERY render');
});

// 2. Empty array - runs ONCE on mount
useEffect(() => {
  console.log('Runs ONCE when component mounts');
}, []);

// 3. With dependencies - runs when dependencies change
useEffect(() => {
  console.log('Runs when count changes');
}, [count]);

// 4. Multiple dependencies
useEffect(() => {
  console.log('Runs when count OR name changes');
}, [count, name]);
```

---

## 3️⃣ Fetching Data

### Basic Data Fetching
```jsx
import { useEffect, useState } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []); // Fetch once on mount
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Fetching with Parameters
```jsx
function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search
    
    return () => clearTimeout(timer); // Cleanup timer
  }, [query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### POST Request
```jsx
function AddUser() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      
      const newUser = await response.json();
      setMessage(`Added user: ${newUser.name}`);
      setName('');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="User name"
      />
      <button disabled={loading} type="submit">
        {loading ? 'Adding...' : 'Add User'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

---

## 4️⃣ Cleanup Functions

### Timers and Intervals
```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    // Start interval
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    // Cleanup: stop interval
    return () => {
      clearInterval(interval);
      console.log('Cleaned up interval');
    };
  }, []);
  
  return <p>Seconds: {seconds}</p>;
}
```

### Event Listeners
```jsx
function WindowResizeTracker() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    // Add listener
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup: remove listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <p>Window size: {size.width}x{size.height}</p>;
}
```

### WebSocket or Subscriptions
```jsx
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Subscribe to chat
    const socket = new WebSocket(`ws://chat.example.com/${roomId}`);
    
    socket.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
    
    // Cleanup: unsubscribe
    return () => {
      socket.close();
    };
  }, [roomId]);
  
  return (
    <div>
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>
  );
}
```

---

## 5️⃣ Common Patterns

### Document Title Update
```jsx
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
    
    return () => {
      document.title = 'My App'; // Reset on unmount
    };
  }, [title]);
  
  return <h1>{title}</h1>;
}
```

### LocalStorage Sync
```jsx
function UserPreferences() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  // Save to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### Form Auto-save
```jsx
function AutoSaveForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/save', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error(err);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [formData]);
  
  return (
    <div>
      <input
        value={formData.title}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          title: e.target.value
        }))}
        placeholder="Title"
      />
      <textarea
        value={formData.content}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          content: e.target.value
        }))}
        placeholder="Content"
      />
      {saved && <p style={{ color: 'green' }}>✓ Saved</p>}
    </div>
  );
}
```

---

## 6️⃣ Common Mistakes

```jsx
// ❌ Mistake 1: Missing dependency array
useEffect(() => {
  fetch('/api/data'); // Fetches every render!
});

// ✅ Correct
useEffect(() => {
  fetch('/api/data');
}, []); // Only once

// ❌ Mistake 2: Using stale state
useEffect(() => {
  const timer = setTimeout(() => {
    console.log(count); // Stale value!
  }, 1000);
}, []);

// ✅ Correct
useEffect(() => {
  const timer = setTimeout(() => {
    setCount(prev => prev + 1); // Use prev
  }, 1000);
}, [count]);

// ❌ Mistake 3: Forgetting cleanup
useEffect(() => {
  const interval = setInterval(() => console.log('tick'), 1000);
  // No cleanup! Memory leak
}, []);

// ✅ Correct
useEffect(() => {
  const interval = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(interval); // Cleanup
}, []);
```

---

## 🎯 Try It Yourself

### Exercise 1: Fetch Data on Mount
Create a component that:
- Fetches data from an API on mount
- Shows loading state
- Displays the data
- Shows error if fetch fails

```jsx
function DataDisplay() {
  // TODO: Implement data fetching
}
```

### Exercise 2: Search with Debounce
Create a search component that:
- Has a search input
- Debounces API requests
- Shows results
- Has loading state

```jsx
function SearchComponent() {
  // TODO: Implement
}
```

### Exercise 3: Todo Autosave
Create a todo component that:
- Saves to localStorage on change
- Restores from localStorage on mount
- Shows save status

```jsx
function TodoWithAutosave() {
  // TODO: Implement
}
```

---

## ✅ Checkpoint

Before moving to Day 5, you should:
- [ ] Understand side effects and why useEffect exists
- [ ] Can use useEffect with different dependency patterns
- [ ] Can fetch data properly
- [ ] Know how to clean up effects
- [ ] Can handle loading and error states
- [ ] Understand common patterns

**Ready for Day 5?** Let's explore Advanced Patterns! 🚀

---

## 📚 Key Takeaways

| Concept | Description |
|---------|-------------|
| **Side Effect** | Code that interacts with external world |
| **useEffect** | Hook for running side effects |
| **Dependencies** | Array controlling when effect runs |
| **Cleanup** | Function to clean up before re-run |
| **Async** | Must use async function inside useEffect |
| **Debounce** | Delay execution to avoid too many calls |

