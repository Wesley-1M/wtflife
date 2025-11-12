# Week 6: Day 2 - useContext API & Global State

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 5 (React Fundamentals), Week 6 Day 1

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand the Context API
- ✅ Create and use contexts
- ✅ Avoid prop drilling
- ✅ Share global state between components
- ✅ Create context providers
- ✅ Build multi-context applications
- ✅ Handle context state updates

---

## 1️⃣ The Problem: Prop Drilling

### What is Prop Drilling?

Prop drilling happens when you pass data through multiple component levels, even when intermediate components don't need it:

```jsx
// App.js
function App() {
  const [user, setUser] = useState({name: 'Alice', theme: 'dark'});
  
  return <Level1 user={user} setUser={setUser} />;
}

// Level1.js - doesn't use user/setUser, just passes down
function Level1({user, setUser}) {
  return <Level2 user={user} setUser={setUser} />;
}

// Level2.js - doesn't use user/setUser, just passes down
function Level2({user, setUser}) {
  return <Level3 user={user} setUser={setUser} />;
}

// Level3.js - FINALLY uses it!
function Level3({user, setUser}) {
  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <button onClick={() => setUser({...user, theme: 'light'})}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### Problems with Prop Drilling

1. **Messy code** - Middle components cluttered with props they don't use
2. **Fragile** - Renaming props requires changes in multiple files
3. **Hard to maintain** - Adding/removing props is tedious
4. **Performance** - Unnecessary re-renders of middle components

---

## 2️⃣ Context API Solution

### Creating a Context

```jsx
// UserContext.js
import React, { createContext, useState } from 'react';

// Step 1: Create the context
export const UserContext = createContext();

// Step 2: Create a Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'Alice', theme: 'dark' });

  const value = {
    user,
    setUser,
    toggleTheme: () => {
      setUser(prev => ({
        ...prev,
        theme: prev.theme === 'dark' ? 'light' : 'dark'
      }));
    }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

### Using Context in Your App

```jsx
// App.js
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Level1 />
    </UserProvider>
  );
}

// Level1.js - No need to accept or pass down props!
function Level1() {
  return <Level2 />;
}

// Level2.js - Still no props needed
function Level2() {
  return <Level3 />;
}

// Level3.js - Use useContext hook to access context
import { useContext } from 'react';
import { UserContext } from './UserContext';

function Level3() {
  const { user, toggleTheme } = useContext(UserContext);

  return (
    <div style={{ background: user.theme === 'dark' ? '#333' : '#fff' }}>
      <h1>Hello, {user.name}!</h1>
      <button onClick={toggleTheme}>
        Current theme: {user.theme}
      </button>
    </div>
  );
}
```

---

## 3️⃣ useContext Hook

### Basic Usage

```jsx
// Step 1: Import useContext and your context
import { useContext } from 'react';
import { UserContext } from './UserContext';

// Step 2: Use the hook in your component
function MyComponent() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <p>User: {user.name}</p>
      <button onClick={() => setUser({ ...user, name: 'Bob' })}>
        Change Name
      </button>
    </div>
  );
}
```

### What Gets Returned?

The `useContext` hook returns the **value** prop from the nearest Provider:

```jsx
const UserContext = createContext();

// Provider has value prop
<UserContext.Provider value={{ user: 'Alice', count: 42 }}>
  <MyComponent />
</UserContext.Provider>

// useContext returns that value object
function MyComponent() {
  const data = useContext(UserContext);
  console.log(data); // { user: 'Alice', count: 42 }
}
```

### Default Values

If no Provider wraps your component, useContext returns the default value:

```jsx
// Create context with default value
const UserContext = createContext({ user: 'Guest', theme: 'light' });

// This component has a default even without Provider
function Component() {
  const { user } = useContext(UserContext);
  console.log(user); // 'Guest' if no Provider wraps it
}
```

---

## 4️⃣ Real-World Example: Theme Context

### Complete Theme System

```jsx
// ThemeContext.js
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const themes = {
    light: {
      bg: '#ffffff',
      text: '#000000',
      border: '#cccccc'
    },
    dark: {
      bg: '#1a1a1a',
      text: '#ffffff',
      border: '#444444'
    }
  };

  const value = {
    currentTheme: theme,
    colors: themes[theme],
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### App Using Theme

```jsx
// App.js
import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

function App() {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <Content />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

// Header.js
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Header() {
  const { colors, currentTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <header style={{ bg: colors.bg, color: colors.text }}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Current: {currentTheme}
      </button>
    </header>
  );
}

// Content.js - Also uses theme without prop drilling
function Content() {
  const { colors } = useContext(ThemeContext);

  return (
    <main style={{ bg: colors.bg, color: colors.text }}>
      <p>Some content here</p>
    </main>
  );
}
```

---

## 5️⃣ Multiple Contexts

### Using Multiple Contexts

Sometimes you need more than one context:

```jsx
// UserContext.js
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// NotificationContext.js
export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

// App.js - Wrap with multiple providers
function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <Header />
        <Content />
      </NotificationProvider>
    </UserProvider>
  );
}

// Component using both contexts
function Dashboard() {
  const { user } = useContext(UserContext);
  const { notifications } = useContext(NotificationContext);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <div>You have {notifications.length} notifications</div>
    </div>
  );
}
```

---

## 6️⃣ Advanced Patterns

### Custom Hook for Context

Create a custom hook to simplify context usage:

```jsx
// useUser.js
import { useContext } from 'react';
import { UserContext } from './UserContext';

export function useUser() {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  
  return context;
}

// Now you can use it like this:
function MyComponent() {
  const { user, setUser } = useUser(); // Much cleaner!
  // ...
}
```

### Context with useReducer

Combine Context with useReducer for complex state:

```jsx
// AppContext.js
import React, { createContext, useReducer } from 'react';

export const AppContext = createContext();

const initialState = {
  user: null,
  isLoading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true };
    case 'LOAD_SUCCESS':
      return { ...state, isLoading: false, user: action.payload };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
```

---

## 7️⃣ Performance Considerations

### Context Causes Re-renders

⚠️ **Important:** When context value changes, ALL components using that context re-render:

```jsx
// ❌ This causes unnecessary re-renders
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // value is NEW object every render, triggering re-renders
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ BETTER - Memoize the value
import { useMemo } from 'react';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // value stays the same unless user/setUser change
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

### Split Contexts

If possible, split related data into separate contexts:

```jsx
// Instead of one big context with everything
<AppContext.Provider value={{ user, theme, notifications, settings }}>

// Split into smaller contexts
<UserProvider>
  <ThemeProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </ThemeProvider>
</UserProvider>
```

---

## 🎯 Common Use Cases

### 1. Authentication
```jsx
// Track current logged-in user globally
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (credentials) => {
    // Make API call
    setCurrentUser(credentials.username);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 2. Language/Localization
```jsx
export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const translations = {
    en: { hello: 'Hello', goodbye: 'Goodbye' },
    es: { hello: 'Hola', goodbye: 'Adiós' },
    fr: { hello: 'Bonjour', goodbye: 'Au revoir' }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

### 3. Modal Management
```jsx
export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState({});

  const openModal = (name) => {
    setModals(prev => ({ ...prev, [name]: true }));
  };

  const closeModal = (name) => {
    setModals(prev => ({ ...prev, [name]: false }));
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
```

---

## 📝 Practice Exercises

### Exercise 1: Create Auth Context
Create an AuthContext that tracks:
- isLoggedIn (boolean)
- user object (id, email, name)
- login(email, password) function
- logout() function

Use it in a component that shows different UI based on login state.

### Exercise 2: Theme Switcher
Create a complete theme system with:
- Light/Dark/High-Contrast modes
- Color values for each theme
- Toggle buttons in Header
- Apply theme to entire app

### Exercise 3: Multi-Context App
Build an app with:
- AuthContext (user info)
- ThemeContext (dark/light mode)
- NotificationContext (toast messages)

Show how all three work together without prop drilling.

### Exercise 4: Performance Optimization
Create a UserProvider that:
- Memoizes the value prop
- Only re-renders when data actually changes
- Monitor re-renders using React DevTools

---

## ✅ Summary

- **Context solves prop drilling** by providing global state
- **createContext()** creates a context object
- **Provider component** supplies data to consumers
- **useContext() hook** accesses context values
- **Multiple contexts** can be combined for complex apps
- **Memoization** helps with performance
- **Custom hooks** make context easier to use

---

## 🔗 Next Steps

**Tomorrow (Day 3):** Custom Hooks - Extract and reuse stateful logic  
**This Week:** Master state management patterns in React

## 🎯 Learning Outcomes

- ✅ Master Context API for global state
- ✅ Combine multiple contexts effectively
- ✅ Optimize context performance
- ✅ Build scalable state management

---

## 💡 Try It Yourself

Create a multi-context app with:
- Authentication context
- Theme switching context
- Notification context
- All three working together seamlessly

---

## ✅ Checkpoint

- [ ] Understand advanced Context patterns
- [ ] Can combine multiple contexts
- [ ] Know performance optimization techniques
- [ ] Can avoid prop drilling effectively

**Next:** Custom Hooks for Reusability! 🚀

