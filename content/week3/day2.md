# Day 2: Selecting Elements - Finding What You Need

**Duration:** 2 hours  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Prerequisites:** Week 3 Day 1  
**By the end:** You'll master every way to select DOM elements

---

## 📚 Overview

To manipulate elements, you first need to **select** them. JavaScript provides multiple ways to find elements in the DOM, each with pros and cons.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Use** `getElementById()`  
✅ **Use** `getElementsByClassName()` and `getElementsByTagName()`  
✅ **Use** `querySelector()` and `querySelectorAll()`  
✅ **Understand** CSS selectors  
✅ **Choose** the best selection method for each situation  

---

## 🔎 Selection Methods (Overview)

| Method | Returns | Speed | Best For |
|--------|---------|-------|----------|
| `getElementById()` | Single element | ⚡ Fast | Single unique element |
| `getElementsByClassName()` | HTMLCollection | ⚡ Fast | Multiple elements by class |
| `getElementsByTagName()` | HTMLCollection | ⚡ Fast | All elements of type |
| `querySelector()` | Single element | 🔄 Slower | Complex CSS selector |
| `querySelectorAll()` | NodeList | 🔄 Slower | Complex CSS selector |

---

## 🎯 getElementById() - Get By ID

### Syntax

```javascript
let element = document.getElementById('idName');
```

### Requirements

Element must have an **id attribute** in HTML:

```html
<h1 id="main-title">Welcome</h1>
<button id="submit-btn">Submit</button>
```

### Usage

```javascript
// Get element by ID
let title = document.getElementById('main-title');
console.log(title);
// <h1 id="main-title">Welcome</h1>

// Works with any element type
let button = document.getElementById('submit-btn');
console.log(button);

// If ID doesn't exist, returns null
let notFound = document.getElementById('nonexistent');
console.log(notFound);  // null
```

### Important Notes

- Returns **single element** only
- **Must be unique** - don't repeat IDs
- **Fastest** method (browsers optimize this)
- Only works on `document`, not other elements

---

## 📚 getElementsByClassName() - Get By Class

### Syntax

```javascript
let elements = document.getElementsByClassName('className');
```

### Requirements

Elements must have **class attribute** in HTML:

```html
<p class="intro">First paragraph</p>
<p class="intro">Second paragraph</p>
<p class="outro">Last paragraph</p>
```

### Usage

```javascript
// Get all elements with class "intro"
let intros = document.getElementsByClassName('intro');
console.log(intros);
// HTMLCollection [p.intro, p.intro]

console.log(intros.length);  // 2

// Access individual elements
console.log(intros[0]);      // First p
console.log(intros[1]);      // Second p

// Loop through results
for (let i = 0; i < intros.length; i++) {
  console.log(intros[i].textContent);
}
```

### Multiple Classes

```javascript
// Get elements with BOTH classes
let special = document.getElementsByClassName('intro special');
console.log(special);  // Only elements with both classes
```

### Important Notes

- Returns **HTMLCollection** (live collection)
- Can have **multiple elements** with same class
- **Live** - updates if DOM changes
- Works on any element (not just document)

---

## 🏷️ getElementsByTagName() - Get By Tag

### Syntax

```javascript
let elements = document.getElementsByTagName('tagName');
```

### Requirements

Just uses HTML tag names like "p", "div", "button", etc.

### Usage

```javascript
// Get all paragraphs
let paragraphs = document.getElementsByTagName('p');
console.log(paragraphs);
// HTMLCollection [p, p, p, ...]

console.log(paragraphs.length);  // How many paragraphs

// Get all divs
let divs = document.getElementsByTagName('div');

// Get all images
let images = document.getElementsByTagName('img');

// Access individual elements
console.log(paragraphs[0]);  // First p
console.log(paragraphs[0].textContent);
```

### Use on Specific Container

```html
<div id="main">
  <p>Inside main</p>
  <p>Also inside</p>
</div>

<div id="sidebar">
  <p>Different section</p>
</div>
```

```javascript
// Get all p tags in entire document
let allPs = document.getElementsByTagName('p');
console.log(allPs.length);  // 3

// Get only p tags inside main div
let mainDiv = document.getElementById('main');
let mainPs = mainDiv.getElementsByTagName('p');
console.log(mainPs.length);  // 2
```

### Important Notes

- Returns **HTMLCollection** (live collection)
- Case-insensitive ("p", "P", "P" all work)
- **Live** - updates if DOM changes
- Works on any element (not just document)

---

## 🎨 querySelector() - Get By CSS Selector

### Syntax

```javascript
let element = document.querySelector('CSS-selector');
```

### Power: CSS Selectors

You can use **any CSS selector**:

```javascript
// By ID
let title = document.querySelector('#main-title');

// By class
let intro = document.querySelector('.intro');

// By tag
let heading = document.querySelector('h1');

// By attribute
let input = document.querySelector('input[type="email"]');

// Descendant
let link = document.querySelector('#container a');

// Child
let div = document.querySelector('body > div');

// Combination
let btn = document.querySelector('form .btn-primary');
```

### Multiple Conditions (Complex Selectors)

```javascript
// Element with specific class
let element = document.querySelector('div.important');

// Element with ID
let specific = document.querySelector('button#submit');

// Element with attribute value
let email = document.querySelector('input[name="email"]');

// Pseudo-selectors
let firstChild = document.querySelector('li:first-child');
let lastChild = document.querySelector('li:last-child');
```

### Important Notes

- Returns **first matching element only**
- Returns `null` if no match found
- **Slower** than getElementById (must parse CSS)
- **More flexible** than other methods
- Works on any element (not just document)

---

## 📋 querySelectorAll() - Get All By CSS Selector

### Syntax

```javascript
let elements = document.querySelectorAll('CSS-selector');
```

### Usage

```javascript
// Get all paragraphs
let allPs = document.querySelectorAll('p');
console.log(allPs);  // NodeList [p, p, p, ...]

// Get all intro paragraphs
let intros = document.querySelectorAll('p.intro');
console.log(intros);

// Get all divs inside main
let nested = document.querySelectorAll('#main div');
console.log(nested);

// Complex selector
let buttons = document.querySelectorAll('form button:not(.cancel)');
console.log(buttons);
```

### Looping Through Results

```javascript
let items = document.querySelectorAll('.item');

// Traditional loop
for (let i = 0; i < items.length; i++) {
  console.log(items[i]);
}

// forEach (modern)
items.forEach(function(item) {
  console.log(item);
});

// Arrow function (even shorter)
items.forEach(item => console.log(item));
```

### Important Notes

- Returns **NodeList** (static collection)
- **Not live** - doesn't update if DOM changes
- **Slower** than getElementsBy methods
- **Most flexible** - works with any CSS selector
- Works on any element (not just document)

---

## 🔀 querySelector vs querySelectorAll

### Key Difference

```javascript
// querySelector - returns first element OR null
let one = document.querySelector('.btn');
console.log(one);  // <button class="btn">...</button> (or null)

// querySelectorAll - returns NodeList (can be empty)
let all = document.querySelectorAll('.btn');
console.log(all);  // NodeList [button.btn, button.btn, ...] (or empty)
console.log(all.length);  // 0 if none found
```

---

## 🧪 Try It Yourself

### Exercise 1: Simple Selection

```html
<div id="main">
  <h1>Title</h1>
  <p class="intro">First paragraph</p>
  <p>Second paragraph</p>
  <button>Click me</button>
</div>
```

```javascript
// By ID
let main = document.getElementById('main');
console.log(main);

// By class
let intro = document.querySelector('.intro');
console.log(intro);

// By tag
let button = document.querySelector('button');
console.log(button);
```

---

## 💪 Practice Exercises

### Exercise 2: Multiple Elements

```html
<ul>
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
  <li class="item special">Item 3</li>
  <li class="item">Item 4</li>
</ul>
```

```javascript
// Get all items
let allItems = document.querySelectorAll('.item');
console.log(`Found ${allItems.length} items`);

// Get only special items
let special = document.querySelectorAll('.item.special');
console.log(`Found ${special.length} special items`);

// Loop through all
allItems.forEach(item => {
  console.log(item.textContent);
});
```

### Exercise 3: Complex Selectors

```html
<form id="contact">
  <input type="text" placeholder="Name">
  <input type="email" placeholder="Email">
  <textarea placeholder="Message"></textarea>
  <button type="submit">Send</button>
  <button type="reset">Clear</button>
</form>
```

```javascript
// Get form
let form = document.querySelector('#contact');

// Get email input
let email = form.querySelector('input[type="email"]');

// Get all inputs
let inputs = form.querySelectorAll('input');
console.log(`${inputs.length} inputs found`);

// Get submit button
let submit = form.querySelector('button[type="submit"]');

// Get all buttons
let buttons = form.querySelectorAll('button');
```

### Exercise 4: Method Comparison

```javascript
// Same result, different methods:

// Method 1: getElementById
let btn1 = document.getElementById('my-button');

// Method 2: querySelector with ID
let btn2 = document.querySelector('#my-button');

// Method 3: querySelector with universal
let btn3 = document.querySelector('[id="my-button"]');

// All return the same element!
console.log(btn1 === btn2);  // true (same object)
```

### Exercise 5: Working with Collections

```javascript
let paragraphs = document.querySelectorAll('p');

// Check if any found
if (paragraphs.length > 0) {
  console.log(`Found ${paragraphs.length} paragraphs`);
}

// Get first
let first = paragraphs[0];

// Get last
let last = paragraphs[paragraphs.length - 1];

// Loop through
paragraphs.forEach((p, index) => {
  console.log(`Paragraph ${index + 1}: ${p.textContent}`);
});
```

---

## 🎯 CSS Selector Cheat Sheet

| Selector | Meaning | Example |
|----------|---------|---------|
| `.class` | By class name | `.intro`, `.btn-primary` |
| `#id` | By element ID | `#main`, `#submit-btn` |
| `tag` | By element type | `p`, `div`, `button` |
| `[attr]` | Has attribute | `[disabled]`, `[data-id]` |
| `[attr="value"]` | Attribute equals | `[type="text"]`, `[name="email"]` |
| `tag.class` | Tag with class | `button.btn`, `div.container` |
| `tag#id` | Tag with ID | `div#main`, `h1#title` |
| `ancestor descendant` | Descendant | `div p`, `#main button` |
| `parent > child` | Direct child | `ul > li`, `div > p` |
| `:first-child` | First child | `li:first-child`, `p:first-child` |
| `:last-child` | Last child | `li:last-child`, `p:last-child` |
| `:not(selector)` | Negation | `button:not(.cancel)`, `p:not(.intro)` |

---

## ⚡ Performance Tips

### Speed Rankings (Fastest to Slowest)

```javascript
// ⚡⚡⚡ Fastest
let el = document.getElementById('myId');

// ⚡⚡ Fast
let els = document.getElementsByClassName('myClass');

// ⚡ Slower (but still good)
let el = document.querySelector('#myId');

// 🐌 Slowest
let els = document.querySelectorAll('.myClass');
```

### When to Use Each

```javascript
// Getting single element by ID → use getElementById()
let header = document.getElementById('header');

// Getting multiple elements by class → use getElementsByClassName()
let buttons = document.getElementsByClassName('btn');

// Complex CSS selector → use querySelector/querySelectorAll()
let form = document.querySelector('form.registration');
let inputs = form.querySelectorAll('input[type="text"]');
```

---

## 🏆 Checkpoint

Before moving to Day 3, make sure you can:

- ✅ Use `getElementById()` to get single element
- ✅ Use `getElementsByClassName()` to get multiple elements
- ✅ Use `getElementsByTagName()` to get by tag
- ✅ Use `querySelector()` with CSS selectors
- ✅ Use `querySelectorAll()` to get multiple elements
- ✅ Loop through collections with forEach
- ✅ Know when to use each method

**Can you do all of these?** If yes, you're ready for Day 3! 🚀

---

**Completion Time:** ~2 hours with exercises  
**Difficulty:** ⭐⭐⭐ (Intermediate)  
**Next Lesson:** Day 3 - Manipulating DOM (Changing Elements)
