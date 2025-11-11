# Week 3 Project: Build an Interactive Todo App

**Duration:** 4 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Type:** Full-featured interactive app  
**Goal:** Apply DOM manipulation, events, and delegation to build a professional todo app

---

## 📚 Project Overview

You'll build a **full-featured todo application** with:
- ✅ Add/remove tasks
- ✅ Mark complete/incomplete
- ✅ Edit existing tasks
- ✅ Filter by status
- ✅ Persistent storage (localStorage)
- ✅ Keyboard shortcuts
- ✅ Professional UI

This project combines:
- **DOM Selection** (Days 1-2)
- **DOM Manipulation** (Day 3)
- **Events & Event Handling** (Day 4)
- **Event Delegation** (Day 5)
- **Week 2 Array/Object methods**

---

## 🏗️ Project Structure

```
todo-app/
├── index.html          (Layout & structure)
├── styles.css          (Professional styling)
└── app.js              (All logic)
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
  <title>Advanced Todo App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app-container">
    <header class="app-header">
      <h1>📋 Advanced Todo App</h1>
      <p class="subtitle">Stay organized and productive</p>
    </header>

    <main class="app-main">
      <!-- Input Section -->
      <div class="input-section">
        <input 
          type="text" 
          id="todoInput" 
          placeholder="What needs to be done? (Ctrl+Enter to add)"
          class="todo-input"
          autofocus
        >
        <button id="addBtn" class="btn btn-primary">+ Add Todo</button>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="active">Active</button>
        <button class="filter-btn" data-filter="completed">Completed</button>
      </div>

      <!-- Stats Section -->
      <div class="stats-section">
        <div class="stat">
          <span class="stat-label">Total</span>
          <span class="stat-value" id="totalCount">0</span>
        </div>
        <div class="stat">
          <span class="stat-label">Active</span>
          <span class="stat-value" id="activeCount">0</span>
        </div>
        <div class="stat">
          <span class="stat-label">Done</span>
          <span class="stat-value" id="completedCount">0</span>
        </div>
        <div class="stat">
          <span class="stat-label">Progress</span>
          <span class="stat-value" id="progress">0%</span>
        </div>
      </div>

      <!-- Todo List -->
      <div class="list-container">
        <ul id="todoList" class="todo-list">
          <!-- Todos rendered here -->
        </ul>
      </div>

      <!-- Empty State -->
      <div class="empty-state" id="emptyState">
        <div class="empty-icon">🎉</div>
        <p>No todos yet. Start typing above to add your first task!</p>
      </div>

      <!-- Clear Completed -->
      <div class="action-section">
        <button id="clearCompletedBtn" class="btn btn-secondary">
          Clear Completed
        </button>
      </div>
    </main>

    <footer class="app-footer">
      <p>💡 Tip: Use Ctrl+Enter to quickly add todos</p>
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
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #e0e7ff;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  color: var(--gray-900);
}

.app-container {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 90vh;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  opacity: 0.9;
  font-size: 0.95rem;
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Input Section */
.input-section {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.todo-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

/* Buttons */
.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: var(--gray-200);
  color: var(--gray-700);
}

.btn-secondary:hover {
  background: var(--gray-300);
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  margin: 0 0.25rem;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover {
  background: #059669;
}

/* Filter Section */
.filter-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1.25rem;
  border: 2px solid var(--gray-200);
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  color: var(--gray-600);
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  background: var(--gray-50);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--gray-500);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary);
}

/* List Container */
.list-container {
  margin-bottom: 2rem;
}

.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  border-left: 4px solid var(--gray-200);
}

.todo-item:hover {
  background: var(--gray-100);
  transform: translateX(4px);
  border-left-color: var(--primary);
}

.todo-item.completed {
  opacity: 0.6;
  background: var(--gray-100);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--gray-500);
}

.todo-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: var(--primary);
  flex-shrink: 0;
}

.todo-text {
  flex: 1;
  word-break: break-word;
  font-size: 1rem;
}

.todo-priority {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-low {
  background: #dbeafe;
  color: #2563eb;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.todo-actions button {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.todo-item:hover .todo-actions button {
  opacity: 1;
}

.todo-item:hover .todo-actions button:focus {
  opacity: 1;
}

.btn-edit {
  background: var(--primary);
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-edit:hover {
  background: var(--primary-dark);
}

.btn-delete {
  background: var(--danger);
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-delete:hover {
  background: #dc2626;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--gray-500);
  display: none;
}

.empty-state.show {
  display: block;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
}

/* Action Section */
.action-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Footer */
.app-footer {
  background: var(--gray-50);
  color: var(--gray-600);
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
  border-top: 1px solid var(--gray-200);
}

/* Responsive */
@media (max-width: 600px) {
  .app-container {
    border-radius: 0;
    min-height: 100vh;
  }

  .app-header {
    padding: 1.5rem;
  }

  .app-header h1 {
    font-size: 1.5rem;
  }

  .app-main {
    padding: 1rem;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .input-section {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .todo-item {
    flex-wrap: wrap;
  }

  .todo-actions {
    width: 100%;
  }
}
```

---

## 💻 Part 3: JavaScript Logic

Create `app.js`:

```javascript
// ==========================================
// Advanced Todo App - Full Logic
// ==========================================

// State
let todos = [];
let currentFilter = 'all';
let editingId = null;

// ==========================================
// Initialization
// ==========================================

function init() {
  loadTodosFromStorage();
  render();
  setupEventListeners();
  console.log('Todo app initialized!');
}

// ==========================================
// Create Todo
// ==========================================

function createTodo(text, priority = 'medium') {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    priority: priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// ==========================================
// Add Todo (CREATE)
// ==========================================

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  // Determine priority based on text
  let priority = 'medium';
  if (text.endsWith('!!!')) {
    priority = 'high';
    text = text.replace(/!!!$/, '').trim();
  } else if (text.endsWith('?')) {
    priority = 'low';
  }

  const newTodo = createTodo(text, priority);
  todos.unshift(newTodo);  // Add at beginning

  input.value = '';
  input.focus();

  saveTodosToStorage();
  render();
  updateStats();
}

// ==========================================
// Render Todo List (READ)
// ==========================================

function render() {
  const todoList = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
  });

  // Show/hide empty state
  if (filteredTodos.length === 0) {
    todoList.innerHTML = '';
    emptyState.classList.add('show');
  } else {
    emptyState.classList.remove('show');
    todoList.innerHTML = filteredTodos.map(todo => createTodoHTML(todo)).join('');
  }
}

function createTodoHTML(todo) {
  const priorityClass = `priority-${todo.priority}`;

  return `
    <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.completed ? 'checked' : ''}
      >
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <span class="todo-priority ${priorityClass}">${todo.priority}</span>
      <div class="todo-actions">
        <button class="btn-edit edit-btn">Edit</button>
        <button class="btn-delete delete-btn">Delete</button>
      </div>
    </li>
  `;
}

// ==========================================
// Toggle Todo Complete (UPDATE)
// ==========================================

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    todo.updatedAt = new Date().toISOString();
    saveTodosToStorage();
    render();
    updateStats();
  }
}

// ==========================================
// Delete Todo (DELETE)
// ==========================================

function deleteTodo(id) {
  if (confirm('Delete this todo?')) {
    todos = todos.filter(t => t.id !== id);
    saveTodosToStorage();
    render();
    updateStats();
  }
}

// ==========================================
// Edit Todo
// ==========================================

function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const newText = prompt('Edit todo:', todo.text);
  if (newText && newText.trim()) {
    todo.text = newText.trim();
    todo.updatedAt = new Date().toISOString();
    saveTodosToStorage();
    render();
  }
}

// ==========================================
// Clear Completed
// ==========================================

function clearCompleted() {
  const completedCount = todos.filter(t => t.completed).length;

  if (completedCount === 0) {
    alert('No completed todos to clear!');
    return;
  }

  if (confirm(`Clear ${completedCount} completed todos?`)) {
    todos = todos.filter(t => !t.completed);
    saveTodosToStorage();
    render();
    updateStats();
  }
}

// ==========================================
// Update Statistics
// ==========================================

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('totalCount').textContent = total;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('activeCount').textContent = active;
  document.getElementById('progress').textContent = progress + '%';
}

// ==========================================
// Storage Functions
// ==========================================

function saveTodosToStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromStorage() {
  const stored = localStorage.getItem('todos');
  if (stored) {
    todos = JSON.parse(stored);
  } else {
    // Sample todos for first time
    todos = [
      createTodo('Learn DOM manipulation', 'high'),
      createTodo('Practice event handling', 'high'),
      createTodo('Build a real project', 'medium')
    ];
    saveTodosToStorage();
  }
}

// ==========================================
// Utility Functions
// ==========================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==========================================
// Event Listeners Setup
// ==========================================

function setupEventListeners() {
  const input = document.getElementById('todoInput');
  const addBtn = document.getElementById('addBtn');
  const todoList = document.getElementById('todoList');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearBtn = document.getElementById('clearCompletedBtn');

  // Add button
  addBtn.addEventListener('click', addTodo);

  // Enter key to add
  input.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      addTodo();
    }
  });

  // Also allow just Enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      addTodo();
    }
  });

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      render();
    });
  });

  // Clear completed button
  clearBtn.addEventListener('click', clearCompleted);

  // Event delegation for todo list
  todoList.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const id = parseInt(todoItem.dataset.id);

    // Toggle complete (checkbox)
    if (e.target.classList.contains('todo-checkbox')) {
      toggleTodo(id);
    }

    // Delete button
    if (e.target.classList.contains('delete-btn')) {
      deleteTodo(id);
    }

    // Edit button
    if (e.target.classList.contains('edit-btn')) {
      editTodo(id);
    }
  });
}

// ==========================================
// Start App
// ==========================================

document.addEventListener('DOMContentLoaded', init);

// Focus input on page load
window.addEventListener('load', () => {
  document.getElementById('todoInput').focus();
});
```

---

## 🎯 Features Implemented

### DOM Concepts (Week 3)
✅ **Selection**: querySelector, querySelectorAll
✅ **Manipulation**: innerHTML, classList.add/remove
✅ **Event Handling**: addEventListener, event.target
✅ **Event Delegation**: Single listener for all todo actions
✅ **Creation**: createElement, appendChild

### Advanced Patterns
✅ **Filter Logic**: Using array.filter()
✅ **Object Mapping**: Using array.map() for rendering
✅ **Higher-Order Functions**: setupEventListeners with closures
✅ **Data Persistence**: localStorage integration
✅ **Responsive UI**: Mobile-friendly design

---

## 📝 Test Cases

**Test 1: Add Todo**
- Type text and click Add
- Or type text and press Ctrl+Enter
- Todo appears in list

**Test 2: Complete/Incomplete**
- Click checkbox to mark complete
- Strikethrough text appears
- Stats update

**Test 3: Delete Todo**
- Click Delete button
- Confirm dialog appears
- Todo is removed

**Test 4: Edit Todo**
- Click Edit button
- Prompt appears to edit text
- Changes are saved

**Test 5: Filter**
- Click Active to show only incomplete
- Click Completed to show only complete
- Click All to show everything

**Test 6: Persistence**
- Add/complete some todos
- Refresh page
- Todos remain (from localStorage)

**Test 7: Clear Completed**
- Mark some todos complete
- Click "Clear Completed"
- Completed todos are removed
- Active todos remain

---

## 🎨 Customization Ideas

### Easy Enhancements
1. **Color Themes** - Add light/dark mode toggle
2. **Categories** - Add category selector
3. **Due Dates** - Add date picker
4. **Priority Colors** - Change color scheme
5. **Sound Effects** - Play sound on complete

### Medium Enhancements
1. **Sorting** - Sort by priority, date, completion
2. **Search** - Search todos by text
3. **Drag & Drop** - Reorder todos
4. **Tags** - Add tags to todos
5. **Undo/Redo** - Undo last action

### Advanced Enhancements
1. **API Integration** - Sync with backend
2. **User Accounts** - Login/logout
3. **Sharing** - Share todo lists
4. **Recurring** - Recurring todos
5. **Analytics** - Track productivity

---

## 🏆 Learning Outcomes

By completing this project, you've learned:

✅ How DOM selection and manipulation work together  
✅ How to handle user interactions with events  
✅ Event delegation for efficient event handling  
✅ Creating dynamic HTML from data  
✅ Persisting data with localStorage  
✅ Building responsive, professional UI  
✅ Managing application state  
✅ Organizing JavaScript in a real project  

---

## 🚀 Next Steps

After completing this project:
1. **Week 4**: Learn asynchronous programming to connect with real APIs
2. **Week 5-8**: Learn React to build this app with a framework
3. **Weeks 9-11**: Learn backend to persist todos on a server

---

**Project Type:** Full-Stack Web Application  
**Completion Time:** 4 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next:** Week 4 - Asynchronous JavaScript
