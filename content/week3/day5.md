# Day 5: Event Delegation - Advanced Event Handling

**Duration:** 2 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Prerequisites:** Week 3 Days 1-4  
**By the end:** You'll handle events efficiently on dynamic elements

---

## 📚 Overview

When you have many elements, adding a listener to each one is **inefficient**. Instead, use **event delegation** - listen on a parent and figure out which child was affected.

This is especially important for **dynamically created elements** that don't exist yet.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Understand** event bubbling and propagation  
✅ **Use** event delegation for efficiency  
✅ **Handle** events on dynamically created elements  
✅ **Use** `event.target` effectively  
✅ **Know** when to use delegation vs direct listeners  

---

## 🫧 Event Bubbling

### What Happens When You Click?

```html
<div id="outer">
  <div id="middle">
    <button id="inner">Click Me</button>
  </div>
</div>
```

When you click the button:
1. Click event fires on button
2. Bubbles up to middle
3. Bubbles up to outer
4. Bubbles up to document

```javascript
let button = document.getElementById('inner');
let middle = document.getElementById('middle');
let outer = document.getElementById('outer');

button.addEventListener('click', () => console.log('Button clicked'));
middle.addEventListener('click', () => console.log('Middle clicked'));
outer.addEventListener('click', () => console.log('Outer clicked'));

// Click button → Output:
// Button clicked
// Middle clicked
// Outer clicked
```

---

## 🛑 Stopping Propagation

### event.stopPropagation()

```javascript
let button = document.getElementById('inner');
let outer = document.getElementById('outer');

button.addEventListener('click', (event) => {
  event.stopPropagation();  // Stop bubbling
  console.log('Button clicked');
});

outer.addEventListener('click', () => {
  console.log('Outer clicked');
});

// Click button → Output:
// Button clicked
// (Outer clicked is NOT printed - propagation stopped)
```

---

## 🎯 Event Delegation Pattern

### Problem: Many Elements

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <!-- Many more items... -->
</ul>
```

### Old Way: Listener on Each Element

```javascript
// ❌ Inefficient
document.querySelectorAll('li').forEach(li => {
  li.addEventListener('click', (event) => {
    console.log(event.target.textContent);
  });
});

// Problem: If you add new items, they don't have listeners!
```

### New Way: Delegation on Parent

```javascript
// ✅ Efficient - one listener handles all
let list = document.getElementById('list');

list.addEventListener('click', (event) => {
  // Check if clicked element is a <li>
  if (event.target.tagName === 'LI') {
    console.log(event.target.textContent);
  }
});
```

### Why This is Better

```javascript
let list = document.getElementById('list');

list.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('Item clicked:', event.target.textContent);
  }
});

// Later, add new items dynamically
let newItem = document.createElement('li');
newItem.textContent = 'New Item 4';
list.appendChild(newItem);

// ✅ New item automatically has click handler!
// (Because the listener is on parent)
```

---

## 🎯 Checking event.target

### Matching by Tag Name

```javascript
let container = document.querySelector('.buttons');

container.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    console.log('Button clicked:', event.target.textContent);
  }
});
```

### Matching by Class

```javascript
let container = document.querySelector('.items');

container.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-btn')) {
    console.log('Delete clicked');
  }
});
```

### Matching by ID

```javascript
let container = document.querySelector('.app');

container.addEventListener('click', (event) => {
  if (event.target.id === 'my-button') {
    console.log('My button clicked');
  }
});
```

### Using Closest() Method

```javascript
let list = document.querySelector('ul');

list.addEventListener('click', (event) => {
  // Find closest li that is an ancestor
  let item = event.target.closest('li');
  
  if (item) {
    console.log('Item clicked:', item.textContent);
  }
});
```

`.closest()` is very useful because it matches the element or any parent!

---

## 🏗️ Real-World Example: Todo App

### HTML

```html
<ul id="todos">
  <li class="todo">
    <span>Learn JavaScript</span>
    <button class="delete">Delete</button>
  </li>
  <li class="todo">
    <span>Build Projects</span>
    <button class="delete">Delete</button>
  </li>
</ul>
<input id="new-todo" type="text">
<button id="add-btn">Add</button>
```

### JavaScript with Delegation

```javascript
let todoList = document.getElementById('todos');
let input = document.getElementById('new-todo');
let addBtn = document.getElementById('add-btn');

// Single listener handles all delete clicks
todoList.addEventListener('click', (event) => {
  // Delete button clicked
  if (event.target.classList.contains('delete')) {
    let todoItem = event.target.closest('.todo');
    todoItem.remove();
  }
});

// Add new todo
addBtn.addEventListener('click', () => {
  let text = input.value.trim();
  if (!text) return;
  
  let li = document.createElement('li');
  li.className = 'todo';
  li.innerHTML = `
    <span>${text}</span>
    <button class="delete">Delete</button>
  `;
  
  todoList.appendChild(li);
  input.value = '';
  input.focus();
  
  // ✅ New item's delete button automatically works!
  // (Because of event delegation on todoList)
});
```

---

## 🎛️ Event Capturing (Advanced)

### Event Phases

```javascript
// Phase 1: CAPTURING - from document down to target
// Phase 2: TARGET - on the target element
// Phase 3: BUBBLING - from target up to document

let button = document.querySelector('button');

// By default, listeners react to BUBBLING phase
button.addEventListener('click', () => console.log('Bubbling'), false);

// With true, listener reacts to CAPTURING phase
button.addEventListener('click', () => console.log('Capturing'), true);
```

In practice, you almost always use bubbling (the default). Capturing is rarely needed.

---

## 🧪 Try It Yourself

### Exercise 1: Simple Delegation

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<script>
  let list = document.getElementById('list');
  
  list.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
      event.target.style.backgroundColor = 'yellow';
    }
  });
</script>
```

---

## 💪 Practice Exercises

### Exercise 2: Delete Items with Delegation

```html
<ul id="items">
  <li>
    Item 1
    <button class="delete-btn">X</button>
  </li>
  <li>
    Item 2
    <button class="delete-btn">X</button>
  </li>
</ul>

<script>
  let list = document.getElementById('items');
  
  list.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      let item = event.target.parentElement;
      item.remove();
    }
  });
</script>
```

### Exercise 3: Dynamic List

```html
<input id="task-input" type="text" placeholder="New task">
<button id="add-task">Add</button>
<ul id="tasks"></ul>

<script>
  let input = document.getElementById('task-input');
  let addBtn = document.getElementById('add-task');
  let taskList = document.getElementById('tasks');
  
  // Add new task
  function addTask() {
    if (!input.value.trim()) return;
    
    let li = document.createElement('li');
    li.innerHTML = `
      <span>${input.value}</span>
      <button class="remove">Remove</button>
    `;
    
    taskList.appendChild(li);
    input.value = '';
    input.focus();
  }
  
  // Event delegation for remove buttons
  taskList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove')) {
      event.target.closest('li').remove();
    }
  });
  
  addBtn.addEventListener('click', addTask);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
</script>
```

### Exercise 4: Using Closest()

```html
<div class="container">
  <div class="card">
    <h3>Card 1</h3>
    <button class="edit">Edit</button>
    <button class="delete">Delete</button>
  </div>
  <div class="card">
    <h3>Card 2</h3>
    <button class="edit">Edit</button>
    <button class="delete">Delete</button>
  </div>
</div>

<script>
  let container = document.querySelector('.container');
  
  container.addEventListener('click', (event) => {
    let card = event.target.closest('.card');
    
    if (!card) return;
    
    if (event.target.classList.contains('edit')) {
      console.log('Edit:', card.querySelector('h3').textContent);
    }
    
    if (event.target.classList.contains('delete')) {
      card.remove();
    }
  });
</script>
```

### Exercise 5: Toggle with Delegation

```html
<ul id="options">
  <li>
    <input type="checkbox"> Option 1
  </li>
  <li>
    <input type="checkbox"> Option 2
  </li>
  <li>
    <input type="checkbox"> Option 3
  </li>
</ul>

<script>
  let list = document.getElementById('options');
  
  list.addEventListener('change', (event) => {
    if (event.target.tagName === 'INPUT') {
      let li = event.target.closest('li');
      
      if (event.target.checked) {
        li.style.backgroundColor = 'lightgreen';
      } else {
        li.style.backgroundColor = 'white';
      }
    }
  });
</script>
```

---

## 📊 Event Delegation vs Direct Listeners

| Aspect | Direct Listener | Delegation |
|--------|-----------------|-----------|
| **Setup** | Add to each element | Add to parent once |
| **New elements** | ❌ No automatic handling | ✅ Automatic handling |
| **Memory** | ❌ More listeners | ✅ One listener |
| **Performance** | ❌ Slower with many items | ✅ Faster |
| **Complexity** | Simple | Slightly complex |

---

## 🎯 When to Use Each

### Use Direct Listener When:
- Only a few elements
- Elements don't change
- Need element-specific logic

```javascript
// Direct listener - fine
let oneButton = document.getElementById('submit-btn');
oneButton.addEventListener('click', handleSubmit);
```

### Use Delegation When:
- Many elements
- Elements added/removed dynamically
- Need consistent handling

```javascript
// Delegation - better
let form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  if (event.target.tagName === 'INPUT') {
    // Handle input
  }
});
```

---

## 🏆 Checkpoint

Before moving to the Week 3 Project, make sure you can:

- ✅ Explain event bubbling
- ✅ Use event delegation on parent elements
- ✅ Check `event.target` to identify which element was clicked
- ✅ Use `.closest()` to find parent elements
- ✅ Handle dynamically created elements with delegation
- ✅ Know when to use delegation vs direct listeners

**Can you do all of these?** If yes, you're ready for the Week 3 Project! 🚀

---

**Completion Time:** ~2 hours with exercises  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next:** Week 3 Project - Build an Interactive Todo App with DOM
