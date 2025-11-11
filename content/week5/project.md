# Week 5: Project - Build a React Todo App

**Duration:** 4 hours  
**Difficulty:** ⭐⭐⭐ (Intermediate to Advanced)  
**Prerequisites:** Week 5 Days 1-5 (All React Fundamentals)

---

## 🎯 Project Objectives

By completing this project, you will:
- ✅ Build a complete React application
- ✅ Manage complex state with hooks
- ✅ Use Context API for global state
- ✅ Create custom hooks
- ✅ Handle forms and user input
- ✅ Persist data to localStorage
- ✅ Build responsive UI
- ✅ Practice component composition

---

## 📋 Project Requirements

### Features
1. **View Todos** - Display all todos in a list
2. **Add Todo** - Add new todos with input
3. **Mark Complete** - Toggle done status
4. **Delete Todo** - Remove individual todos
5. **Filter** - Show all/active/completed
6. **Stats** - Show count of todos
7. **Persist** - Save to localStorage
8. **Clear Completed** - Bulk delete completed

### Tech Stack
- React (Hooks: useState, useEffect, useContext)
- LocalStorage API
- CSS (modern styling with flexbox)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── TodoForm.jsx
│   ├── TodoList.jsx
│   ├── TodoItem.jsx
│   ├── FilterBar.jsx
│   └── Stats.jsx
├── context/
│   └── TodoContext.jsx
├── hooks/
│   └── useLocalStorage.js
├── App.jsx
├── App.css
└── index.js
```

---

## 🏗️ Building the App

### Step 1: Create TodoContext

```jsx
// context/TodoContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id, text) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const value = {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}
```

### Step 2: Create TodoForm Component

```jsx
// components/TodoForm.jsx
import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

export function TodoForm() {
  const [input, setInput] = useState('');
  const { addTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo..."
        className="todo-input"
      />
      <button type="submit" className="btn btn-primary">
        Add Todo
      </button>
    </form>
  );
}
```

### Step 3: Create TodoItem Component

```jsx
// components/TodoItem.jsx
import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

export function TodoItem({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const { toggleTodo, deleteTodo, updateTodo } = useTodos();

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateTodo(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="todo-checkbox"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="todo-edit-input"
          autoFocus
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => deleteTodo(todo.id)}
        className="btn btn-danger btn-small"
      >
        Delete
      </button>
    </li>
  );
}
```

### Step 4: Create TodoList Component

```jsx
// components/TodoList.jsx
import { useTodos } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

export function TodoList({ filter }) {
  const { todos } = useTodos();

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (todos.length === 0) {
    return <p className="empty-state">No todos yet. Add one to get started!</p>;
  }

  if (filteredTodos.length === 0) {
    return <p className="empty-state">No todos in this category.</p>;
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

### Step 5: Create FilterBar Component

```jsx
// components/FilterBar.jsx
export function FilterBar({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`filter-btn ${currentFilter === filter.value ? 'active' : ''}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
```

### Step 6: Create Stats Component

```jsx
// components/Stats.jsx
import { useTodos } from '../context/TodoContext';

export function Stats() {
  const { todos, clearCompleted } = useTodos();

  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-label">Total:</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Active:</span>
        <span className="stat-value">{active}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Completed:</span>
        <span className="stat-value">{completed}</span>
      </div>
      {completed > 0 && (
        <button
          onClick={clearCompleted}
          className="btn btn-warning"
        >
          Clear Completed ({completed})
        </button>
      )}
    </div>
  );
}
```

### Step 7: Create Header Component

```jsx
// components/Header.jsx
export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>📝 My Todo App</h1>
        <p>Built with React - Powered by Hooks & Context API</p>
      </div>
    </header>
  );
}
```

### Step 8: Create Main App Component

```jsx
// App.jsx
import { useState } from 'react';
import { TodoProvider } from './context/TodoContext';
import { Header } from './components/Header';
import { TodoForm } from './components/TodoForm';
import { FilterBar } from './components/FilterBar';
import { TodoList } from './components/TodoList';
import { Stats } from './components/Stats';
import './App.css';

function AppContent() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="app">
      <Header />
      
      <main className="container">
        <TodoForm />
        
        <div className="controls">
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
          <Stats />
        </div>
        
        <TodoList filter={filter} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}
```

### Step 9: Create Styling

```css
/* App.css */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 20px;
  text-align: center;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 1rem;
}

.container {
  background: white;
  border-radius: 0 0 10px 10px;
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Form */
.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.todo-input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background: #ff6b6b;
  color: white;
}

.btn-danger:hover {
  background: #ee5a5a;
}

.btn-warning {
  background: #ffa726;
  color: white;
}

.btn-warning:hover {
  background: #fb8c00;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.875rem;
}

/* Filters */
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Stats */
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

/* Todo List */
.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 10px;
  background: white;
  transition: all 0.3s;
}

.todo-item:hover {
  background: #f9f9f9;
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.todo-item.completed {
  opacity: 0.7;
  background: #f0f0f0;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #667eea;
  border-radius: 4px;
  font-size: 1rem;
}

.todo-edit-input:focus {
  outline: none;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 600px) {
  .header h1 {
    font-size: 1.8rem;
  }

  .container {
    padding: 20px;
  }

  .todo-form {
    flex-direction: column;
  }

  .stats {
    flex-direction: column;
  }

  .stat {
    width: 100%;
  }

  .filter-bar {
    justify-content: space-between;
  }

  .filter-btn {
    flex: 1;
  }
}
```

---

## 🚀 Enhancement Ideas

### 1. Categories
```jsx
// Add categories to todos
const todo = {
  id: 1,
  text: 'Learn React',
  category: 'learning',
  completed: false
};
```

### 2. Due Dates
```jsx
// Add due dates with warnings
const todo = {
  id: 1,
  text: 'Learn React',
  dueDate: '2024-12-25',
  priority: 'high'
};
```

### 3. Search/Sort
```jsx
// Add search and sorting features
const [searchQuery, setSearchQuery] = useState('');
const filtered = todos.filter(todo =>
  todo.text.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### 4. Undo/Redo
```jsx
// Add undo/redo functionality
const [history, setHistory] = useState([]);
const undo = () => {
  // Implement undo logic
};
```

### 5. Dark Mode
```jsx
// Add theme switching
const [isDarkMode, setIsDarkMode] = useState(false);
```

---

## ✅ Checklist

- [ ] All components created
- [ ] TodoContext set up
- [ ] Add todo functionality works
- [ ] Delete todo functionality works
- [ ] Toggle complete works
- [ ] Filter buttons work
- [ ] Stats display correctly
- [ ] Data persists to localStorage
- [ ] Edit todo functionality works
- [ ] Responsive design works
- [ ] No console errors

---

## 🎓 Learning Outcomes

By completing this project, you've learned:
- ✅ Building multi-component React apps
- ✅ Managing state with Context API
- ✅ Creating custom components
- ✅ Handling forms and user input
- ✅ Using localStorage for persistence
- ✅ Responsive CSS design
- ✅ Component composition patterns
- ✅ React best practices

---

## 📚 Project Skills Demonstrated

| Skill | Difficulty | Demonstrated |
|-------|-----------|--------------|
| Components | ⭐ | ✅ |
| Props | ⭐ | ✅ |
| State Management | ⭐⭐ | ✅ |
| Context API | ⭐⭐ | ✅ |
| Hooks | ⭐⭐ | ✅ |
| Forms | ⭐⭐ | ✅ |
| localStorage | ⭐ | ✅ |
| CSS Styling | ⭐⭐ | ✅ |
| Responsive Design | ⭐⭐ | ✅ |

---

## 🎉 Congratulations!

You've completed Week 5! You now understand:
- React fundamentals
- Component-based architecture
- State management with hooks
- Context API for global state
- How to build complete React applications

**Next:** Continue with Week 6 for Advanced React patterns! 🚀

