# Week 2 Project: Build a Todo List Manager

**Duration:** 3-4 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Type:** Hands-on project  
**Goal:** Apply everything from Week 2 to build a working todo app

---

## 📚 Project Overview

You'll build a **Todo List Manager** that stores, displays, and manages tasks. This project combines:
- Arrays and objects (Week 2 Days 1-2)
- Array methods (Week 2 Day 3)
- ES6+ features like arrow functions and destructuring (Week 2 Day 4)
- Advanced function patterns like callbacks and higher-order functions (Week 2 Day 5)

---

## 🎯 What You'll Build

A web-based todo app with:
✅ Add new todos  
✅ Mark todos complete/incomplete  
✅ Delete todos  
✅ Filter todos (All, Active, Completed)  
✅ Show statistics (total, complete count)  
✅ Save to browser storage (localStorage)  

---

## 🏗️ Project Structure

```
todo-project/
├── index.html          (Layout)
├── styles.css          (Styling)
└── app.js              (Logic)
```

---

## 📋 Part 1: HTML Structure

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo List Manager</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>📋 Todo List Manager</h1>
      <p>Stay organized and get things done!</p>
    </header>

    <main>
      <!-- Input Section -->
      <section class="input-section">
        <input 
          type="text" 
          id="todoInput" 
          placeholder="Add a new task..."
          class="todo-input"
        >
        <button id="addButton" class="btn btn-primary">Add Todo</button>
      </section>

      <!-- Filter Section -->
      <section class="filter-section">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stat">
          <span class="stat-label">Total:</span>
          <span class="stat-value" id="totalCount">0</span>
        </div>
        <div class="stat">
          <span class="stat-label">Completed:</span>
          <span class="stat-value" id="completedCount">0</span>
        </div>
        <div class="stat">
          <span class="stat-label">Active:</span>
          <span class="stat-value" id="activeCount">0</span>
        </div>
      </section>

      <!-- Todo List -->
      <section class="todo-list-section">
        <ul id="todoList" class="todo-list">
          <!-- Todos will be added here -->
        </ul>
      </section>

      <!-- Empty State -->
      <section class="empty-state" id="emptyState">
        <p>No todos yet. Add one to get started! 🚀</p>
      </section>
    </main>

    <footer>
      <p>&copy; 2024 Todo List Manager | Built with JavaScript</p>
    </footer>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

---

## 🎨 Part 2: CSS Styling

Create `styles.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
  --bg-light: #ecf0f1;
  --spacing: 1rem;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: var(--text-dark);
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 0.95rem;
  opacity: 0.9;
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  background: var(--bg-light);
  color: var(--text-light);
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

/* Input Section */
.input-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--bg-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.todo-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  margin: 0 0.25rem;
}

.btn-success {
  background: var(--secondary-color);
  color: white;
}

.btn-success:hover {
  background: #27ae60;
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

/* Filter Section */
.filter-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--bg-light);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: var(--text-light);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.filter-btn:hover:not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  background: var(--bg-light);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--primary-color);
}

/* Todo List */
.todo-list-section {
  margin-bottom: 2rem;
}

.todo-list {
  list-style: none;
}

.todo-item {
  background: var(--bg-light);
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
}

.todo-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--text-light);
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  word-break: break-word;
}

.todo-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-high {
  background: #ffe6e6;
  color: var(--danger-color);
}

.priority-medium {
  background: #fff4e6;
  color: #f39c12;
}

.priority-low {
  background: #e6f3ff;
  color: var(--primary-color);
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-light);
  display: none;
}

.empty-state.show {
  display: block;
}

.empty-state p {
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 600px) {
  .container {
    border-radius: 0;
    min-height: auto;
  }

  header h1 {
    font-size: 1.5rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-wrap: wrap;
  }

  .input-section {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
```

---

## 💻 Part 3: JavaScript Logic

Create `app.js`:

```javascript
// ==========================================
// Todo List Manager - JavaScript Logic
// ==========================================

// Data Structure: Array of todo objects
let todos = [];
let currentFilter = 'all';

// ==========================================
// 1. Initialize App
// ==========================================

function init() {
  loadTodosFromStorage();
  renderTodos();
  setupEventListeners();
}

// ==========================================
// 2. Todo Object Factory
// ==========================================

function createTodo(text, priority = 'medium') {
  return {
    id: Date.now(),
    text: text,
    completed: false,
    priority: priority,
    createdAt: new Date()
  };
}

// ==========================================
// 3. Create (Add) Todo
// ==========================================

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();

  if (!text) {
    alert('Please enter a task!');
    return;
  }

  // Determine priority based on keywords
  let priority = 'medium';
  if (text.toLowerCase().includes('!')) {
    priority = 'high';
  } else if (text.toLowerCase().includes('?')) {
    priority = 'low';
  }

  const newTodo = createTodo(text, priority);
  todos.push(newTodo);

  input.value = '';
  input.focus();

  saveTodosToStorage();
  renderTodos();
  updateStats();
}

// ==========================================
// 4. Read (Display) Todos
// ==========================================

function renderTodos() {
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');
  
  // Filter todos based on current filter
  const filteredTodos = filterTodos(todos, currentFilter);

  // Clear existing list
  todoList.innerHTML = '';

  if (filteredTodos.length === 0) {
    emptyState.classList.add('show');
    return;
  }

  emptyState.classList.remove('show');

  // Use map to create HTML for each todo
  filteredTodos.forEach(todo => {
    const li = createTodoElement(todo);
    todoList.appendChild(li);
  });
}

function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  if (todo.completed) {
    li.classList.add('completed');
  }

  const priorityClass = `priority-${todo.priority}`;

  li.innerHTML = `
    <input 
      type="checkbox" 
      class="todo-checkbox" 
      ${todo.completed ? 'checked' : ''}
      data-id="${todo.id}"
    >
    <span class="todo-text">${escapeHtml(todo.text)}</span>
    <span class="todo-priority ${priorityClass}">${todo.priority.toUpperCase()}</span>
    <div class="todo-actions">
      <button class="btn btn-small btn-danger delete-btn" data-id="${todo.id}">
        Delete
      </button>
    </div>
  `;

  // Add event listeners
  const checkbox = li.querySelector('.todo-checkbox');
  checkbox.addEventListener('change', () => toggleTodo(todo.id));

  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  return li;
}

// ==========================================
// 5. Update Todo (Toggle Complete)
// ==========================================

function toggleTodo(id) {
  // Find and update the todo
  todos = todos.map(todo => 
    todo.id === id ? {...todo, completed: !todo.completed} : todo
  );

  saveTodosToStorage();
  renderTodos();
  updateStats();
}

// ==========================================
// 6. Delete Todo
// ==========================================

function deleteTodo(id) {
  if (confirm('Are you sure you want to delete this todo?')) {
    // Filter out the deleted todo
    todos = todos.filter(todo => todo.id !== id);

    saveTodosToStorage();
    renderTodos();
    updateStats();
  }
}

// ==========================================
// 7. Filter Todos (Higher-Order Function)
// ==========================================

function filterTodos(todoArray, filter) {
  const filters = {
    all: todo => true,
    active: todo => !todo.completed,
    completed: todo => todo.completed
  };

  return todoArray.filter(filters[filter]);
}

// ==========================================
// 8. Update Statistics
// ==========================================

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('activeCount').textContent = active;
}

// ==========================================
// 9. Storage Functions (localStorage)
// ==========================================

function saveTodosToStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromStorage() {
  const stored = localStorage.getItem('todos');
  if (stored) {
    todos = JSON.parse(stored);
  }
}

// ==========================================
// 10. Utility Functions
// ==========================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================
// 11. Event Listeners Setup
// ==========================================

function setupEventListeners() {
  // Add button
  document.getElementById('addButton').addEventListener('click', addTodo);

  // Enter key in input
  document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
      });
      e.target.classList.add('active');

      // Update filter and re-render
      currentFilter = e.target.dataset.filter;
      renderTodos();
    });
  });
}

// ==========================================
// 12. Initialize on Page Load
// ==========================================

document.addEventListener('DOMContentLoaded', init);
```

---

## 📝 Key Concepts Used

### 1. **Data Structures (Week 2 Day 1-2)**
```javascript
// Array of objects
let todos = [
  {id: 1, text: "Learn JavaScript", completed: false, priority: "high"}
];
```

### 2. **Array Methods (Week 2 Day 3)**
```javascript
// map - transform
const names = todos.map(todo => todo.text);

// filter - select
const completed = todos.filter(todo => todo.completed);

// reduce - summarize
const total = todos.reduce((acc) => acc + 1, 0);
```

### 3. **ES6+ Features (Week 2 Day 4)**
```javascript
// Arrow functions
const toggleTodo = (id) => { ... }

// Destructuring
const {text, completed} = todo;

// Template literals
li.innerHTML = `<span>${escapeHtml(todo.text)}</span>`

// Spread operator
const updated = {...todo, completed: !todo.completed}
```

### 4. **Advanced Functions (Week 2 Day 5)**
```javascript
// Higher-order function
function filterTodos(todoArray, filter) {
  return todoArray.filter(filters[filter]);
}

// Callbacks
btn.addEventListener('click', () => toggleTodo(id));

// Closures
setupEventListeners creates closures over todo data
```

---

## 🧪 How to Test

1. **Add todos** - Type in input and click "Add Todo" or press Enter
2. **Toggle complete** - Click the checkbox next to a todo
3. **Delete todo** - Click the "Delete" button
4. **Filter todos** - Click "All", "Active", or "Completed"
5. **Check stats** - View the statistics section
6. **Refresh page** - Todos persist in localStorage

---

## 🎯 Challenges to Extend

### Challenge 1: Edit Todos
Add an "Edit" button that allows users to modify existing todos.

**Hint:** You'll need to:
- Add an edit mode state to each todo
- Create an edit input that appears when in edit mode
- Save changes back to the array

### Challenge 2: Priority Sorting
Add ability to sort todos by priority (high → medium → low).

**Hint:** Use `.sort()` method:
```javascript
const priorities = {high: 1, medium: 2, low: 3};
todos.sort((a, b) => priorities[a.priority] - priorities[b.priority]);
```

### Challenge 3: Due Dates
Add due dates to todos and show which are overdue.

**Hint:** 
- Add a `dueDate` property to todos
- Compare with current date
- Highlight overdue todos

### Challenge 4: Categories
Let users organize todos into categories.

**Hint:**
- Add `category` property to todos
- Create category buttons in filter section
- Filter by category like you do with status

### Challenge 5: Local Storage Improvements
Show when todos were last modified.

**Hint:**
- Add `modifiedAt` timestamp
- Update it when todo changes
- Display in UI

---

## 🏆 Project Checklist

Before submitting, verify:

- ✅ Can add todos with text input
- ✅ Input clears after adding
- ✅ Can toggle todo complete/incomplete
- ✅ Can delete todos (with confirmation)
- ✅ Filter buttons work (All, Active, Completed)
- ✅ Statistics update correctly
- ✅ Empty state shows when no todos
- ✅ Todos persist after page reload
- ✅ UI is responsive on mobile
- ✅ Code uses arrow functions
- ✅ Code uses array methods (.map, .filter)
- ✅ Code uses destructuring or spread operator
- ✅ Code has event listeners with callbacks

---

## 🎓 What You've Learned

By completing this project, you've practiced:

✅ Creating and managing array/object data  
✅ Rendering dynamic HTML from data  
✅ Event-driven programming with callbacks  
✅ Array methods for transforming data  
✅ ES6+ syntax (arrow functions, template literals)  
✅ State management basics  
✅ Browser storage with localStorage  
✅ Responsive CSS design  
✅ Building complete feature-rich application  

---

**Completion Time:** 3-4 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next:** Week 3 - DOM & Events
