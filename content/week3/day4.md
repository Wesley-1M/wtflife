# Day 4: Events - Making Pages Interactive

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Prerequisites:** Week 3 Days 1-3  
**By the end:** You'll handle user interactions with event listeners

---

## 📚 Overview

Events are how users interact with web pages:
- Clicking buttons
- Typing in inputs
- Hovering over elements
- Scrolling the page
- Submitting forms

JavaScript lets you **listen for** and **respond to** these events.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Understand** what events are  
✅ **Use** `.addEventListener()` to listen for events  
✅ **Handle** common events (click, input, submit)  
✅ **Access** event data  
✅ **Prevent** default event behavior  

---

## 📡 What Are Events?

Events are **notifications** that something happened on the page:

```javascript
// Click event - user clicked an element
element.addEventListener('click', function() {
  console.log("Clicked!");
});

// Input event - user typed in field
input.addEventListener('input', function() {
  console.log("User typed something");
});

// Submit event - user submitted form
form.addEventListener('submit', function() {
  console.log("Form submitted");
});
```

---

## 🎧 addEventListener() - Main Event Method

### Syntax

```javascript
element.addEventListener('eventType', callbackFunction);
```

### Simple Example

```html
<button id="myButton">Click Me</button>

<script>
  let button = document.getElementById('myButton');
  
  button.addEventListener('click', function() {
    console.log("Button was clicked!");
  });
</script>
```

### Arrow Function (Modern)

```javascript
let button = document.getElementById('myButton');

button.addEventListener('click', () => {
  console.log("Button was clicked!");
});
```

### Multiple Listeners

```javascript
let button = document.getElementById('myButton');

// Add multiple listeners
button.addEventListener('click', () => {
  console.log("First listener");
});

button.addEventListener('click', () => {
  console.log("Second listener");
});

// Both run when button is clicked!
```

---

## 🖱️ Mouse Events

### Click Event

```javascript
let button = document.querySelector('button');

button.addEventListener('click', () => {
  console.log("Clicked!");
});
```

### Hover Events (mouseenter, mouseleave)

```javascript
let box = document.querySelector('.box');

box.addEventListener('mouseenter', () => {
  console.log("Mouse entered");
  box.style.backgroundColor = 'yellow';
});

box.addEventListener('mouseleave', () => {
  console.log("Mouse left");
  box.style.backgroundColor = 'white';
});
```

### Hover Events (mouseover, mouseout)

```javascript
// Similar to mouseenter/mouseleave
element.addEventListener('mouseover', () => {
  console.log("Mouse is over element");
});

element.addEventListener('mouseout', () => {
  console.log("Mouse left element");
});
```

### Double Click

```javascript
let text = document.querySelector('p');

text.addEventListener('dblclick', () => {
  console.log("Double clicked!");
  text.style.color = 'red';
});
```

### Mouse Coordinates

```javascript
let box = document.querySelector('.box');

box.addEventListener('mousemove', (event) => {
  console.log(`Mouse X: ${event.clientX}, Y: ${event.clientY}`);
});
```

---

## ⌨️ Keyboard Events

### keydown - Key Pressed

```javascript
let input = document.querySelector('input');

input.addEventListener('keydown', (event) => {
  console.log(`Key pressed: ${event.key}`);
});
```

### keyup - Key Released

```javascript
input.addEventListener('keyup', (event) => {
  console.log(`Key released: ${event.key}`);
});
```

### Detect Specific Key

```javascript
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    console.log("Enter pressed!");
  }
  
  if (event.key === 'Escape') {
    console.log("Escape pressed!");
  }
  
  if (event.code === 'ArrowUp') {
    console.log("Up arrow pressed!");
  }
});
```

### Common Key Values

```javascript
// Letters and numbers
event.key === 'a', 'A', '1', etc.

// Special keys
event.key === 'Enter'
event.key === 'Escape'
event.key === ' '  // Space
event.key === 'Backspace'

// Use event.code for arrow keys
event.code === 'ArrowUp'
event.code === 'ArrowDown'
event.code === 'ArrowLeft'
event.code === 'ArrowRight'
```

---

## 📝 Form Events

### input Event - User Types

```javascript
let input = document.querySelector('input');

input.addEventListener('input', (event) => {
  console.log(`Current value: ${event.target.value}`);
});
```

### change Event - Value Changed

```javascript
let select = document.querySelector('select');

select.addEventListener('change', (event) => {
  console.log(`Selected: ${event.target.value}`);
});
```

### submit Event - Form Submitted

```html
<form id="contact">
  <input type="email" placeholder="Email">
  <button type="submit">Send</button>
</form>

<script>
  let form = document.getElementById('contact');
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();  // Stop form from submitting
    console.log("Form submitted!");
  });
</script>
```

### Prevent Default Behavior

```javascript
let form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();  // Prevents page reload
  
  // Now you can validate and process form
  console.log("Form data processed by JavaScript");
});
```

---

## 📌 The Event Object

### Accessing Event Information

```javascript
element.addEventListener('click', (event) => {
  // event object contains info about what happened
  console.log(event);
});
```

### Common Event Properties

```javascript
element.addEventListener('click', (event) => {
  // What element was clicked
  console.log(event.target);
  
  // What element the listener is on
  console.log(event.currentTarget);
  
  // Event type
  console.log(event.type);  // "click"
  
  // Stop propagation
  event.stopPropagation();
  
  // Prevent default
  event.preventDefault();
});
```

### event.target vs event.currentTarget

```html
<button id="btn">
  Click <span>me</span>
</button>

<script>
  let btn = document.getElementById('btn');
  
  btn.addEventListener('click', (event) => {
    console.log(event.target);       // What you clicked (span or button)
    console.log(event.currentTarget); // The element with listener (button)
  });
</script>
```

---

## 🛑 Preventing Default Behavior

### Stop Form Submission

```html
<form id="search">
  <input type="text" placeholder="Search...">
  <button type="submit">Search</button>
</form>

<script>
  let form = document.getElementById('search');
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();  // Page doesn't reload
    
    let query = form.querySelector('input').value;
    console.log(`Searching for: ${query}`);
  });
</script>
```

### Stop Link Navigation

```html
<a href="https://google.com" id="google-link">Go to Google</a>

<script>
  let link = document.getElementById('google-link');
  
  link.addEventListener('click', (event) => {
    event.preventDefault();  // Link doesn't navigate
    console.log("Link was clicked, but didn't navigate");
  });
</script>
```

---

## 🎯 Common Events List

| Event | Triggers | Example |
|-------|----------|---------|
| `click` | Element clicked | Button press |
| `dblclick` | Element double-clicked | Double click |
| `mouseenter` | Mouse enters | Hover over |
| `mouseleave` | Mouse leaves | Hover away |
| `keydown` | Key pressed down | Press any key |
| `keyup` | Key released | Release key |
| `input` | Input value changes | Type in field |
| `change` | Dropdown/checkbox changes | Select option |
| `submit` | Form submitted | Submit form |
| `focus` | Element focused | Click in input |
| `blur` | Element loses focus | Click away |
| `scroll` | Page scrolled | Scroll down |

---

## 🧪 Try It Yourself

### Exercise 1: Click Handler

```html
<button id="btn">Click Me</button>
<p id="text">Ready</p>

<script>
  let btn = document.getElementById('btn');
  let text = document.getElementById('text');
  
  btn.addEventListener('click', () => {
    text.textContent = "You clicked!";
  });
</script>
```

---

## 💪 Practice Exercises

### Exercise 2: Key Detection

```html
<input id="input" type="text" placeholder="Type something">
<p id="output">Type above...</p>

<script>
  let input = document.getElementById('input');
  let output = document.getElementById('output');
  
  input.addEventListener('input', () => {
    output.textContent = `You typed: ${input.value}`;
  });
  
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      output.textContent = `You pressed ENTER with: "${input.value}"`;
    }
  });
</script>
```

### Exercise 3: Form Submission

```html
<form id="form">
  <input type="text" id="name" placeholder="Your name">
  <input type="email" id="email" placeholder="Your email">
  <button type="submit">Submit</button>
</form>

<div id="result"></div>

<script>
  let form = document.getElementById('form');
  let result = document.getElementById('result');
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    
    result.textContent = `Thanks ${name}! Email: ${email}`;
  });
</script>
```

### Exercise 4: Toggle on Click

```html
<button id="toggle-btn">Turn Light Off</button>
<div id="light" style="width: 100px; height: 100px; background: yellow;"></div>

<script>
  let btn = document.getElementById('toggle-btn');
  let light = document.getElementById('light');
  let isOn = true;
  
  btn.addEventListener('click', () => {
    if (isOn) {
      light.style.backgroundColor = 'black';
      btn.textContent = 'Turn Light On';
    } else {
      light.style.backgroundColor = 'yellow';
      btn.textContent = 'Turn Light Off';
    }
    isOn = !isOn;
  });
</script>
```

### Exercise 5: Real-Time List

```html
<input id="todo-input" type="text" placeholder="Add a todo">
<button id="add-btn">Add</button>
<ul id="todo-list"></ul>

<script>
  let input = document.getElementById('todo-input');
  let btn = document.getElementById('add-btn');
  let list = document.getElementById('todo-list');
  
  function addTodo() {
    if (!input.value) return;
    
    let li = document.createElement('li');
    li.textContent = input.value;
    list.appendChild(li);
    
    input.value = '';
    input.focus();
  }
  
  btn.addEventListener('click', addTodo);
  
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });
</script>
```

---

## 🎯 Event Handling Pattern

```javascript
// Step 1: Select element
let element = document.querySelector('#myElement');

// Step 2: Define handler function
function handleClick(event) {
  console.log("Element clicked!");
  console.log(event.target);
  console.log(event.type);
}

// Step 3: Add event listener
element.addEventListener('click', handleClick);

// Or with arrow function:
element.addEventListener('click', (event) => {
  console.log("Element clicked!");
});
```

---

## 🏆 Checkpoint

Before moving to Day 5, make sure you can:

- ✅ Use `.addEventListener()` to add event listeners
- ✅ Handle click events
- ✅ Handle keyboard events
- ✅ Handle form submission
- ✅ Access event properties
- ✅ Prevent default behavior with `event.preventDefault()`
- ✅ Get values from inputs when events occur

**Can you do all of these?** If yes, you're ready for Day 5! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐⭐ (Intermediate)  
**Next Lesson:** Day 5 - Event Delegation (Advanced Patterns)
