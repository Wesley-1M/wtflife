# Week 5: Day 3 - State Management with Hooks

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐ (Intermediate)  
**Prerequisites:** Week 5 Days 1-2 (React Basics, Components)

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand component state and how it differs from props
- ✅ Use the useState hook
- ✅ Handle multiple state variables
- ✅ Update state correctly
- ✅ Work with forms and state
- ✅ Debug common state issues

---

## 1️⃣ What is State?

### State vs Props

```
PROPS                          STATE
─────────────────────────────────────
Read-only                      Can be changed
Passed from parent             Local to component
Cannot be modified             Can be updated
Used for data flow             Used for dynamic data

Example:
┌─────────────────────────────┐
│ Component with Props & State │
│                              │
│ Props (from parent):         │
│ - userName: "Alice"          │
│                              │
│ State (local):               │
│ - isClicked: false           │
│ - counter: 0                 │
└─────────────────────────────┘
```

### When to Use State
```jsx
// ❌ DON'T use state for:
// - Data that doesn't change
// - Props passed from parent
// - Computed values (can be derived)

// ✅ DO use state for:
// - Form inputs (typing, checkbox, etc.)
// - Toggle switches (menus, modals)
// - Counters and dynamic values
// - User interactions and feedback
```

---

## 2️⃣ The useState Hook

### Basic Syntax
```jsx
import { useState } from 'react';

function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);
  
  // count = current value
  // setCount = function to update it
  // 0 = initial value
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Anatomy of useState
```jsx
const [state, setState] = useState(initialValue);
      │       │           │           │
      │       │           │           └─ Initial value
      │       │           └─ Hook function
      │       └─ Function to update state
      └─ Current value
```

### Initial Value Types
```jsx
// Number
const [age, setAge] = useState(25);

// String
const [name, setName] = useState('');

// Boolean
const [isVisible, setIsVisible] = useState(true);

// Array
const [items, setItems] = useState([]);

// Object
const [user, setUser] = useState({ name: '', email: '' });

// Function (lazy initialization)
const [data, setData] = useState(() => {
  console.log('This runs only once!');
  return expensiveComputation();
});
```

---

## 3️⃣ Multiple State Variables

### Managing Multiple States
```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>
      
      <button>Login</button>
    </div>
  );
}
```

### Single Object State (Alternative)
```jsx
function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <div>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <label>
        <input
          name="rememberMe"
          type="checkbox"
          checked={form.rememberMe}
          onChange={handleChange}
        />
        Remember me
      </label>
    </div>
  );
}
```

### Which Approach?
```
Multiple hooks:        Single object:
✅ Simpler logic      ✅ More organization
✅ Each updates       ✅ Related data together
   independently      ❌ Updates all at once

👉 Use multiple hooks for independent values
👉 Use single object for related data
```

---

## 4️⃣ Updating State Correctly

### Immediate Update (for primitives)
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // Direct update
  const increment = () => setCount(count + 1);
  
  // Using previous state
  const incrementSafe = () => setCount(prev => prev + 1);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={incrementSafe}>+1 (Safe)</button>
    </div>
  );
}
```

### Why Use Previous State?
```jsx
// ❌ BAD - Race conditions possible
const handleMultipleClicks = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  // Only increases by 1, not 3!
};

// ✅ GOOD - Each update based on previous
const handleMultipleClicks = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  // Increases by 3 ✅
};
```

### Updating Objects and Arrays
```jsx
// ❌ DON'T mutate directly
function UpdateProfile() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const updateName = (newName) => {
    user.name = newName; // ❌ Direct mutation
    setUser(user);
  };
}

// ✅ DO create new object
function UpdateProfile() {
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const updateName = (newName) => {
    setUser({ ...user, name: newName }); // ✅ Spread operator
  };
  
  const updateAge = (newAge) => {
    setUser(prev => ({
      ...prev,
      age: newAge
    }));
  };
}
```

### Array Updates
```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', done: false }
  ]);
  
  // Add item
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, done: false }]);
  };
  
  // Remove item
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Update item
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };
  
  return (
    <div>
      <input 
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            addTodo(e.target.value);
            e.target.value = '';
          }
        }}
        placeholder="Add a todo"
      />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 5️⃣ Forms and State

### Controlled Components
```jsx
function SearchBox() {
  const [search, setSearch] = useState('');
  
  return (
    <div>
      <input
        type="text"
        value={search}  {/* Controlled by state */}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <p>You're searching for: {search}</p>
    </div>
  );
}
```

### Form with Multiple Inputs
```jsx
function RegistrationForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    subscribe: true
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', form);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <select
        name="country"
        value={form.country}
        onChange={handleChange}
      >
        <option value="">Select Country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
      </select>
      
      <label>
        <input
          name="subscribe"
          type="checkbox"
          checked={form.subscribe}
          onChange={handleChange}
        />
        Subscribe to newsletter
      </label>
      
      <button type="submit">Register</button>
    </form>
  );
}
```

---

## 6️⃣ Common Patterns and Mistakes

### Toggle State
```jsx
function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggle = () => setIsDarkMode(!isDarkMode);
  
  return (
    <button onClick={toggle}>
      {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}
```

### Increment/Decrement
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
    </div>
  );
}
```

### Common Mistakes
```jsx
// ❌ Mistake 1: Forgetting to import useState
// function Component() {
//   const [state, setState] = useState(0); // ❌ Error
// }

// ✅ Correct
import { useState } from 'react';
function Component() {
  const [state, setState] = useState(0); // ✅
}

// ❌ Mistake 2: Calling hooks conditionally
function BadComponent({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // ❌ Wrong!
  }
}

// ✅ Correct - Always call hooks at top level
function GoodComponent({ condition }) {
  const [state, setState] = useState(0);
  if (condition) {
    // Use state here
  }
}

// ❌ Mistake 3: State updates aren't instant
function BadExample() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // Still logs old value!
  };
}

// ✅ Use callback or effect for after-update logic
function GoodExample() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(prev => prev + 1);
    // Schedule console log after render
  };
}
```

---

## 🎯 Try It Yourself

### Exercise 1: Counter App
Create a component with:
- Display current count
- Increment button
- Decrement button
- Reset button

```jsx
function Counter() {
  // TODO: Implement state and buttons
}
```

### Exercise 2: Todo Manager
Create a todo app with:
- Input field to add todos
- List of todos with checkboxes
- Delete button for each todo
- Count of completed vs total

```jsx
function TodoApp() {
  // TODO: Implement
}
```

### Exercise 3: Form Validation
Create a form that:
- Has email and password inputs
- Shows real-time validation
- Disables submit button if invalid
- Shows success message on submit

```jsx
function LoginForm() {
  // TODO: Implement
}
```

---

## ✅ Checkpoint

Before moving to Day 4, you should:
- [ ] Understand state vs props
- [ ] Can use useState hook
- [ ] Can manage multiple state variables
- [ ] Know how to update state correctly
- [ ] Can work with forms and state
- [ ] Understand controlled components

**Ready for Day 4?** Let's explore Effects & Side Effects! 🚀

---

## 📚 Key Takeaways

| Concept | Description |
|---------|-------------|
| **State** | Component's own data that can change |
| **useState** | Hook to add state to components |
| **setters** | Functions to update state |
| **Controlled** | Component value controlled by state |
| **Immutability** | Update state, don't mutate |
| **Previous State** | Use prev => ... for safe updates |

