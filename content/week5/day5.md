# Week 5: Day 5 - Advanced React Patterns

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 5 Days 1-4 (React Fundamentals)

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Create custom hooks
- ✅ Use the Context API
- ✅ Implement Provider patterns
- ✅ Handle global state
- ✅ Avoid prop drilling
- ✅ Build reusable component logic

---

## 1️⃣ Custom Hooks

### What are Custom Hooks?
Custom hooks are functions that use React hooks (like useState, useEffect) to create reusable component logic.

### Rules of Hooks
```javascript
// 1. Only call hooks at the top level
// 2. Only call hooks from React components or custom hooks
// 3. Use the "use" prefix for custom hooks

// ❌ WRONG
function BadHook() {
  if (someCondition) {
    const [state, setState] = useState(0); // ❌ Conditional
  }
}

// ✅ CORRECT
function GoodHook() {
  const [state, setState] = useState(0); // ✅ Top level
  if (someCondition) {
    // Use state here
  }
}
```

### useInput Custom Hook
```jsx
function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  
  return {
    value,
    setValue,
    bind: {
      value,
      onChange: (e) => setValue(e.target.value)
    },
    reset: () => setValue(initialValue)
  };
}

// Usage
function LoginForm() {
  const email = useInput('');
  const password = useInput('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email.value, password.value);
    email.reset();
    password.reset();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input {...email.bind} type="email" placeholder="Email" />
      <input {...password.bind} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### useFetch Custom Hook
```jsx
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
    
    fetchData();
  }, [url, options]);
  
  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### useLocalStorage Custom Hook
```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Theme: {theme}
      </button>
      <button onClick={() => setFontSize(fontSize + 2)}>
        Increase Font Size ({fontSize}px)
      </button>
    </div>
  );
}
```

### useToggle Custom Hook
```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(!value);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return { value, toggle, setTrue, setFalse };
}

// Usage
function Modal() {
  const { value: isOpen, toggle } = useToggle(false);
  
  return (
    <>
      <button onClick={toggle}>Open Modal</button>
      {isOpen && (
        <div style={{ border: '1px solid black', padding: '20px' }}>
          <h2>Modal Content</h2>
          <button onClick={toggle}>Close</button>
        </div>
      )}
    </>
  );
}
```

---

## 2️⃣ Context API

### What is Context?
Context allows you to pass data through the component tree without drilling props through every level.

### Creating Context
```jsx
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Using Context
```jsx
// In your app root
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Content />
      <Footer />
    </ThemeProvider>
  );
}

// In any nested component
function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

function Content() {
  const { theme } = useTheme();
  
  return (
    <main style={{ color: theme === 'light' ? '#000' : '#fff' }}>
      <p>Page content</p>
    </main>
  );
}
```

---

## 3️⃣ Multiple Contexts

### Auth Context
```jsx
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const userData = await response.json();
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Using Multiple Contexts
```jsx
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

function MainApp() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  
  if (loading) return <p>Loading...</p>;
  
  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      {user ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

---

## 4️⃣ Avoiding Prop Drilling

### Before - Prop Drilling (Messy)
```jsx
// Props passed down 4 levels!
function App() {
  const [user, setUser] = useState({ name: 'John', theme: 'dark' });
  return <Level1 user={user} />;
}

function Level1({ user }) {
  return <Level2 user={user} />;
}

function Level2({ user }) {
  return <Level3 user={user} />;
}

function Level3({ user }) {
  return <Level4 user={user} />;
}

function Level4({ user }) {
  return <p>{user.name} using {user.theme}</p>;
}
```

### After - Using Context (Clean)
```jsx
const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'John', theme: 'dark' });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function App() {
  return (
    <UserProvider>
      <Level1 />
    </UserProvider>
  );
}

function Level1() {
  return <Level2 />;
}

function Level2() {
  return <Level3 />;
}

function Level3() {
  return <Level4 />;
}

function Level4() {
  const { user } = useContext(UserContext);
  return <p>{user.name} using {user.theme}</p>;
}
```

---

## 5️⃣ Real-World Example: Shopping Cart

```jsx
// CartContext.js
const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  
  const removeItem = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

// ProductCard.jsx
function ProductCard({ product }) {
  const { addItem } = useCart();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}

// Cart.jsx
function Cart() {
  const { items, total, removeItem, updateQuantity } = useCart();
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id}>
              <p>{item.name} - ${item.price}</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${total.toFixed(2)}</h3>
        </>
      )}
    </div>
  );
}

// App.jsx
function App() {
  return (
    <CartProvider>
      <ProductCard product={{ id: 1, name: 'Laptop', price: 999 }} />
      <Cart />
    </CartProvider>
  );
}
```

---

## 🎯 Try It Yourself

### Exercise 1: Create a usePrevious Hook
Create a custom hook that:
- Keeps track of previous value
- Returns undefined on first render

```jsx
function usePrevious(value) {
  // TODO: Implement
}
```

### Exercise 2: Build a NotificationContext
Create context that:
- Stores notifications
- Can add/remove notifications
- Auto-removes after timeout

```jsx
// TODO: Implement
```

### Exercise 3: Create useAsync Hook
Create a hook that:
- Takes an async function
- Handles loading, data, error states
- Refetches when dependencies change

```jsx
function useAsync(asyncFunction, immediate = true) {
  // TODO: Implement
}
```

---

## ✅ Checkpoint

Before moving to the Project, you should:
- [ ] Can create custom hooks
- [ ] Understand Context API
- [ ] Can use multiple contexts
- [ ] Know when to use context vs props
- [ ] Can avoid prop drilling
- [ ] Understand provider pattern

**Ready for the Project?** Let's build a React Todo App! 🚀

---

## 📚 Key Takeaways

| Concept | Description |
|---------|-------------|
| **Custom Hook** | Reusable function using React hooks |
| **Context** | Global state without prop drilling |
| **Provider** | Component that provides context values |
| **useContext** | Hook to consume context |
| **Prop Drilling** | Passing props through many levels |
| **Composition** | Combining multiple contexts |

