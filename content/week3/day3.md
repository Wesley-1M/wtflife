# Day 3: Manipulating DOM - Changing Elements

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Prerequisites:** Week 3 Days 1-2  
**By the end:** You'll dynamically create and modify HTML with JavaScript

---

## 📚 Overview

Now that you can **select** elements, it's time to **modify** them. JavaScript lets you:
- Change text and HTML content
- Add/remove/toggle CSS classes
- Modify attributes
- Create new elements
- Delete elements

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Change** text content with `.textContent`  
✅ **Change** HTML content with `.innerHTML`  
✅ **Modify** CSS with `.style` and `.className`  
✅ **Use** `.classList` for modern class management  
✅ **Create** new elements  
✅ **Add/remove** elements from the DOM  

---

## 📝 Changing Text Content

### .textContent - Safe Text Only

```javascript
let heading = document.querySelector('h1');

// Read current text
console.log(heading.textContent);  // "Welcome"

// Change text
heading.textContent = "Hello There!";

// Now the page shows the new text
```

### Real Example

```html
<h1 id="title">Old Title</h1>

<script>
  let title = document.getElementById('title');
  title.textContent = "New Title";
</script>
```

### Why textContent?

```javascript
let element = document.querySelector('p');

// Safe - treats everything as plain text
element.textContent = "Price: $10 & tax";
// Shows: "Price: $10 & tax"

// Don't worry about: <, >, &, etc.
```

---

## 🌐 Changing HTML Content

### .innerHTML - HTML Support

```javascript
let container = document.querySelector('#content');

// Read current HTML
console.log(container.innerHTML);

// Change to new HTML
container.innerHTML = "<h2>New Heading</h2><p>Some text</p>";

// Now the page has new elements!
```

### Real Example

```html
<div id="content">
  <p>Old content</p>
</div>

<script>
  let content = document.getElementById('content');
  content.innerHTML = "<h3>Updated!</h3>";
</script>
```

### innerHTML vs textContent

```javascript
let element = document.querySelector('div');

// textContent - treats as plain text
element.textContent = "<h2>Title</h2>";
// Shows literally: "<h2>Title</h2>"

// innerHTML - interprets as HTML
element.innerHTML = "<h2>Title</h2>";
// Shows as actual heading
```

### ⚠️ innerHTML Security Warning

```javascript
// ⚠️ DANGEROUS if user input!
let userInput = "<img src=x onerror='alert(1)'>";
element.innerHTML = userInput;  // Could execute malicious code!

// ✅ SAFE
element.textContent = userInput;  // Displays as plain text
```

---

## 🎨 Modifying Styles

### .style Property

```javascript
let box = document.querySelector('.box');

// Change individual properties
box.style.color = "red";
box.style.fontSize = "20px";
box.style.backgroundColor = "yellow";
box.style.borderRadius = "10px";

// CSS properties become JavaScript properties
// CSS: background-color → JavaScript: backgroundColor
// CSS: font-size → JavaScript: fontSize
```

### Common Style Properties

```javascript
let element = document.querySelector('p');

// Colors and backgrounds
element.style.color = "#333";
element.style.backgroundColor = "lightblue";

// Sizing
element.style.width = "300px";
element.style.height = "100px";

// Text
element.style.fontSize = "18px";
element.style.fontWeight = "bold";

// Positioning
element.style.position = "absolute";
element.style.top = "50px";
element.style.left = "100px";

// Display
element.style.display = "none";
element.style.visibility = "hidden";
element.style.opacity = "0.5";
```

### Better: Use CSS Classes Instead!

```html
<style>
  .highlight {
    background-color: yellow;
    color: red;
    font-weight: bold;
  }
</style>

<p id="text">Important message</p>

<script>
  let text = document.getElementById('text');
  
  // Instead of: text.style.backgroundColor = "yellow";
  //             text.style.color = "red";
  //             text.style.fontWeight = "bold";
  
  // Do this:
  text.classList.add('highlight');
</script>
```

---

## 🏷️ Managing CSS Classes

### .className (Old Way)

```javascript
let element = document.querySelector('p');

// Get current classes
console.log(element.className);  // "intro active"

// Replace all classes
element.className = "newclass";  // Only "newclass" now

// Hard to add/remove individual classes
```

### .classList (Modern Way)

```javascript
let button = document.querySelector('button');

// Add a class
button.classList.add('active');

// Remove a class
button.classList.remove('active');

// Toggle a class (add if missing, remove if present)
button.classList.toggle('active');

// Check if has class
if (button.classList.contains('active')) {
  console.log("Button is active!");
}

// Get all classes
console.log(button.classList);
```

### Real Example: Toggle Theme

```html
<style>
  body.dark-mode {
    background-color: #333;
    color: #fff;
  }
</style>

<button id="theme-toggle">Toggle Dark Mode</button>

<script>
  let toggle = document.getElementById('theme-toggle');
  
  toggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });
</script>
```

---

## 🏗️ Creating New Elements

### document.createElement()

```javascript
// Create new element
let newParagraph = document.createElement('p');

// Set content
newParagraph.textContent = "This is a new paragraph";

// Set classes
newParagraph.className = "intro";
// or: newParagraph.classList.add('intro');

// Set ID
newParagraph.id = "my-para";

// Set attributes
newParagraph.setAttribute('data-id', '123');

// Add to page
let container = document.querySelector('#content');
container.appendChild(newParagraph);
```

### Steps Breakdown

```javascript
// Step 1: Create element
let newDiv = document.createElement('div');

// Step 2: Set properties
newDiv.textContent = "Hello";
newDiv.className = "box";

// Step 3: Add to DOM
let parent = document.querySelector('body');
parent.appendChild(newDiv);

// Element now appears on page!
```

### Create Complex Elements

```javascript
// Create a list with items
let list = document.createElement('ul');

for (let i = 1; i <= 5; i++) {
  let item = document.createElement('li');
  item.textContent = `Item ${i}`;
  list.appendChild(item);
}

document.body.appendChild(list);
```

---

## ➕ Adding Elements to DOM

### .appendChild() - Add at End

```javascript
let parent = document.querySelector('#main');
let newElement = document.createElement('p');
newElement.textContent = "New paragraph";

parent.appendChild(newElement);
// Added as last child
```

### .insertBefore() - Add at Specific Position

```javascript
let parent = document.querySelector('ul');
let newItem = document.createElement('li');
newItem.textContent = "New Item";

let reference = parent.querySelector('.special');
parent.insertBefore(newItem, reference);
// Inserted before .special element
```

### .insertAdjacentHTML() - Insert Around Element

```javascript
let element = document.querySelector('p');

// Insert before element
element.insertAdjacentHTML('beforebegin', '<h2>Title</h2>');

// Insert inside, at start
element.insertAdjacentHTML('afterbegin', '<span>Start:</span>');

// Insert inside, at end
element.insertAdjacentHTML('beforeend', '<span>End</span>');

// Insert after element
element.insertAdjacentHTML('afterend', '<footer>Footer</footer>');
```

---

## 🗑️ Removing Elements

### .remove() - Remove Element

```javascript
let element = document.querySelector('#old-content');
element.remove();
// Element is removed from DOM
```

### .removeChild() - Remove Child Element

```javascript
let parent = document.querySelector('ul');
let item = document.querySelector('li:last-child');

parent.removeChild(item);
// Item removed from list
```

### Remove All Children

```javascript
let container = document.querySelector('#content');

// Clear all content
container.innerHTML = '';
```

---

## 🏗️ Modifying Attributes

### .getAttribute() - Read Attribute

```javascript
let link = document.querySelector('a');

// Get href
let url = link.getAttribute('href');
console.log(url);

// Get title
let title = link.getAttribute('title');
```

### .setAttribute() - Set Attribute

```javascript
let image = document.querySelector('img');

// Set src
image.setAttribute('src', 'new-image.jpg');

// Set alt text
image.setAttribute('alt', 'Description');

// Set data attribute
image.setAttribute('data-id', '123');
```

### .removeAttribute() - Remove Attribute

```javascript
let button = document.querySelector('button');

// Remove disabled attribute
button.removeAttribute('disabled');
```

### Direct Property Access

```javascript
let input = document.querySelector('input');

// Some attributes can be accessed as properties
input.value = "New value";
input.disabled = true;

// Read them back
console.log(input.value);
console.log(input.disabled);
```

---

## 🧪 Try It Yourself

### Exercise 1: Change Text

```html
<h1 id="greeting">Hello</h1>

<script>
  let heading = document.getElementById('greeting');
  heading.textContent = "Welcome to my website!";
</script>
```

---

## 💪 Practice Exercises

### Exercise 2: Create and Add Elements

```javascript
// Create new list
let list = document.createElement('ul');

// Create items
let items = ['Learn JS', 'Build Apps', 'Get Job'];
items.forEach(text => {
  let li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
});

// Add to page
document.body.appendChild(list);
```

### Exercise 3: Toggle Class

```html
<style>
  .active { color: green; }
  .inactive { color: gray; }
</style>

<button id="toggle">Toggle</button>
<p id="text">Click the button</p>

<script>
  let btn = document.getElementById('toggle');
  let text = document.getElementById('text');
  
  btn.addEventListener('click', function() {
    text.classList.toggle('active');
  });
</script>
```

### Exercise 4: Dynamic Card Creation

```javascript
let cards = [
  {title: "Card 1", desc: "First card"},
  {title: "Card 2", desc: "Second card"},
  {title: "Card 3", desc: "Third card"}
];

let container = document.querySelector('#container');

cards.forEach(card => {
  let div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <h3>${card.title}</h3>
    <p>${card.desc}</p>
  `;
  container.appendChild(div);
});
```

### Exercise 5: Remove and Clear

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li class="special">Item 3</li>
</ul>

<button id="remove-special">Remove Special</button>
<button id="clear-list">Clear All</button>

<script>
  // Remove special item
  document.getElementById('remove-special').addEventListener('click', () => {
    let special = document.querySelector('.special');
    if (special) special.remove();
  });
  
  // Clear entire list
  document.getElementById('clear-list').addEventListener('click', () => {
    let list = document.getElementById('list');
    list.innerHTML = '';
  });
</script>
```

---

## 🎯 DOM Manipulation Cheat Sheet

| Task | Method | Example |
|------|--------|---------|
| **Change text** | `.textContent` | `el.textContent = "New"` |
| **Change HTML** | `.innerHTML` | `el.innerHTML = "<p>New</p>"` |
| **Change style** | `.style.property` | `el.style.color = "red"` |
| **Add class** | `.classList.add()` | `el.classList.add('active')` |
| **Remove class** | `.classList.remove()` | `el.classList.remove('active')` |
| **Toggle class** | `.classList.toggle()` | `el.classList.toggle('active')` |
| **Create element** | `document.createElement()` | `let div = document.createElement('div')` |
| **Add to DOM** | `.appendChild()` | `parent.appendChild(child)` |
| **Remove from DOM** | `.remove()` | `element.remove()` |
| **Set attribute** | `.setAttribute()` | `el.setAttribute('data-id', '1')` |
| **Get attribute** | `.getAttribute()` | `el.getAttribute('data-id')` |

---

## 🏆 Checkpoint

Before moving to Day 4, make sure you can:

- ✅ Change text with `.textContent`
- ✅ Change HTML with `.innerHTML`
- ✅ Modify styles with `.style`
- ✅ Add/remove/toggle classes with `.classList`
- ✅ Create new elements
- ✅ Add elements to DOM
- ✅ Remove elements from DOM
- ✅ Get/set attributes

**Can you do all of these?** If yes, you're ready for Day 4! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐⭐ (Intermediate)  
**Next Lesson:** Day 4 - Events (Making Pages Interactive)
