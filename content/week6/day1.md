# Week 6: Day 1 - Advanced useState & useReducer

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 5 (React Fundamentals)

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Master complex state patterns
- ✅ Use useReducer for complex state logic
- ✅ Manage nested state
- ✅ Handle state transitions
- ✅ Debug state issues
- ✅ Optimize state updates

---

## 1️⃣ Complex State Patterns

### State Shape Design
```jsx
// ❌ BAD - Deeply nested state is hard to update
const [state, setState] = useState({
  user: {
    profile: {
      name: 'John',
      settings: {
        notifications: true
      }
    }
  }
});

// ✅ GOOD - Flat state is easier to manage
const [state, setState] = useState({
  userName: 'John',
  notificationsEnabled: true,
  userId: 123
});
```

### Nested Object Updates
```jsx
function UserSettings() {
  const [user, setUser] = useState({
    id: 1,
    name: 'Alice',
    address: {
      city: 'NYC',
      country: 'USA'
    }
  });
  
  // Update nested city
  const updateCity = (newCity) => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: newCity
      }
    }));
  };
  
  return (
    <input
      value={user.address.city}
      onChange={(e) => updateCity(e.target.value)}
    />
  );
}
```

### Array of Objects
```jsx
function TodoManager() {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build App', completed: false }
  ]);
  
  // Update single todo
  const updateTodo = (id, title) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, title } : todo
    ));
  };
  
  // Toggle todo
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Add todo
  const addTodo = (title) => {
    setTodos([...todos, { id: Date.now(), title, completed: false }]);
  };
  
  // Remove todo
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
}
```

---

## 2️⃣ The useReducer Hook

### What is useReducer?
```jsx
const [state, dispatch] = useReducer(reducer, initialState);

// Compared to useState
const [state, setState] = useState(initialState);
setState(newValue); // Direct update

dispatch({ type: 'ACTION_TYPE', payload: data }); // Message-based
```

### Basic useReducer Example
```jsx
function Counter() {
  const initialState = { count: 0 };
  
  function reducer(state, action) {
    switch(action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      case 'DECREMENT':
        return { count: state.count - 1 };
      case 'RESET':
        return { count: 0 };
      case 'SET':
        return { count: action.payload };
      default:
        return state;
    }
  }
  
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <input
        type="number"
        onChange={(e) => dispatch({ type: 'SET', payload: parseInt(e.target.value) })}
      />
    </div>
  );
}
```

### useReducer for Complex State
```jsx
function FormManager() {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    errors: {},
    loading: false,
    submitted: false
  };
  
  function formReducer(state, action) {
    switch(action.type) {
      case 'UPDATE_FIELD':
        return {
          ...state,
          [action.field]: action.value,
          errors: { ...state.errors, [action.field]: '' }
        };
      
      case 'SET_ERRORS':
        return { ...state, errors: action.payload };
      
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      
      case 'SUBMIT':
        return { ...state, submitted: true };
      
      case 'RESET':
        return initialState;
      
      default:
        return state;
    }
  }
  
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const handleChange = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Validate
      const errors = {};
      if (!state.firstName) errors.firstName = 'Required';
      if (!state.email) errors.email = 'Required';
      
      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_ERRORS', payload: errors });
        return;
      }
      
      // Submit
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(state)
      });
      
      dispatch({ type: 'SUBMIT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.firstName}
        onChange={(e) => handleChange('firstName', e.target.value)}
        placeholder="First Name"
      />
      {state.errors.firstName && <span>{state.errors.firstName}</span>}
      
      <input
        value={state.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {state.errors.email && <span>{state.errors.email}</span>}
      
      <button disabled={state.loading} type="submit">
        {state.loading ? 'Submitting...' : 'Submit'}
      </button>
      
      {state.submitted && <p>Form submitted!</p>}
    </form>
  );
}
```

---

## 3️⃣ useReducer vs useState

### When to Use What

```jsx
// ✅ Use useState for:
// - Simple values (strings, numbers, booleans)
// - Independent state variables
// - Simple updates

function Simple() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  return <div>{count} - {name}</div>;
}

// ✅ Use useReducer for:
// - Complex state objects
// - Multiple state updates together
// - State that depends on previous state
// - Large forms with many fields

function Complex() {
  const [state, dispatch] = useReducer(reducer, initial);
  return <div>{state.count} - {state.name}</div>;
}
```

### Example: Shopping Cart with useReducer

```jsx
function ShoppingCart() {
  const initialState = {
    items: [],
    total: 0,
    loading: false,
    error: null
  };
  
  function cartReducer(state, action) {
    switch(action.type) {
      case 'ADD_ITEM': {
        const newItems = [...state.items, action.payload];
        const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
        return { ...state, items: newItems, total: newTotal };
      }
      
      case 'REMOVE_ITEM': {
        const newItems = state.items.filter(item => item.id !== action.payload);
        const newTotal = newItems.reduce((sum, item) => sum + item.price, 0);
        return { ...state, items: newItems, total: newTotal };
      }
      
      case 'UPDATE_QUANTITY': {
        const newItems = state.items.map(item =>
          item.id === action.id
            ? { ...item, quantity: action.quantity }
            : item
        );
        return { ...state, items: newItems };
      }
      
      case 'CLEAR_CART':
        return { ...state, items: [], total: 0 };
      
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      
      default:
        return state;
    }
  }
  
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const checkout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(state.items)
      });
      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  return (
    <div>
      <h2>Cart Total: ${state.total}</h2>
      {state.items.map(item => (
        <div key={item.id}>
          <p>{item.name} - ${item.price}</p>
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={checkout} disabled={state.loading || state.items.length === 0}>
        {state.loading ? 'Processing...' : 'Checkout'}
      </button>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </div>
  );
}
```

---

## 4️⃣ Combining useState and useReducer

```jsx
function ComplexApp() {
  // Simple state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Complex state
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Trigger search
    dispatch({ type: 'SET_RESULTS', payload: filtered });
  };
  
  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {/* Display results from reducer */}
    </div>
  );
}
```

---

## ✅ Checkpoint

Before moving to Day 2, you should:
- [ ] Understand complex state patterns
- [ ] Can use useReducer
- [ ] Know when to use useReducer vs useState
- [ ] Can manage nested state
- [ ] Understand action types
- [ ] Can debug state issues

**Next:** Advanced Hooks and Custom Patterns! 🚀

---

## 📚 Key Takeaways

| Concept | Description |
|---------|-------------|
| **Complex State** | Objects with nested properties |
| **useReducer** | Hook for complex state management |
| **Action** | Message describing state change |
| **Reducer** | Function that processes actions |
| **Dispatch** | Function to send actions |

