# Day 1: DOM Basics - Understanding the Document Object Model

**Duration:** 2 hours  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Prerequisites:** Week 1 + Week 2  
**By the end:** You'll understand how browsers represent HTML as objects

---

## 📚 Overview

The **DOM (Document Object Model)** is how JavaScript interacts with HTML. Instead of seeing HTML as text, JavaScript sees it as a tree of **objects** that can be read and modified.

When you load a webpage:
1. Browser reads HTML (text)
2. Browser creates DOM tree (JavaScript objects)
3. JavaScript can query and modify this tree
4. Browser updates the visual page

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Understand** what the DOM is  
✅ **Visualize** the DOM tree structure  
✅ **Access** the document object  
✅ **Understand** parent/child relationships  
✅ **Navigate** through DOM elements  

---

## 🌳 What is the DOM?

The DOM is a **tree structure** representing your HTML.

### HTML Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>Welcome</p>
  </body>
</html>
```

### DOM Tree Structure

```
document
  └─ html (root element)
      ├─ head
      │   └─ title (text: "My Page")
      └─ body
          ├─ h1 (text: "Hello")
          └─ p (text: "Welcome")
```

Each **element** becomes a **node object** with properties:
- `.tagName` - "H1", "P", "DIV", etc.
- `.textContent` - inner text
- `.children` - child elements
- `.parentElement` - parent element
- `.attributes` - id, class, etc.

---

## 📄 The Document Object

The **document** is the root object for interacting with the DOM.

```javascript
// Access document
console.log(document);
console.log(typeof document);  // "object"

// Document properties
console.log(document.title);           // Page title
console.log(document.url);             // Current URL
console.log(document.domain);          // Domain name
console.log(document.body);            // <body> element
console.log(document.head);            // <head> element
```

---

## 🔍 Viewing the DOM Tree

### Browser DevTools

Open DevTools (F12 or Right-click → Inspect):
1. Go to **Elements** tab
2. You see the DOM tree structure
3. You can expand/collapse elements
4. Hover to highlight elements on page

### Programmatically

```javascript
// Log the HTML structure
console.log(document.documentElement.outerHTML);

// Log just body
console.log(document.body.innerHTML);

// See element structure
let element = document.querySelector('h1');
console.log(element);
```

---

## 👨‍👩‍👧‍👦 Parent, Child, Sibling Relationships

### HTML Example

```html
<div id="container">
  <p id="para1">First</p>
  <p id="para2">Second</p>
  <p id="para3">Third</p>
</div>
```

### Relationships

```javascript
let para2 = document.getElementById('para2');

// Parent
console.log(para2.parentElement);
// <div id="container">...</div>

// Children of parent
let container = para2.parentElement;
console.log(container.children);
// HTMLCollection [p#para1, p#para2, p#para3]

// Siblings
console.log(para2.previousElementSibling);  // p#para1
console.log(para2.nextElementSibling);      // p#para3

// All children
console.log(container.children[0]);  // p#para1
console.log(container.children[1]);  // p#para2
console.log(container.children[2]);  // p#para3
```

---

## 🌲 Traversing the DOM Tree

### Going Down (To Children)

```javascript
let div = document.querySelector('div');

// First child element
console.log(div.firstElementChild);

// Last child element
console.log(div.lastElementChild);

// All children as collection
console.log(div.children);          // HTMLCollection
console.log(div.childNodes);        // NodeList (includes text nodes)
```

### Going Up (To Parent)

```javascript
let p = document.querySelector('p');

// Get parent
console.log(p.parentElement);

// Get parent's parent
console.log(p.parentElement.parentElement);

// Check if element has parent
if (p.parentElement) {
  console.log("Has parent!");
}
```

### Going Sideways (To Siblings)

```javascript
let p2 = document.querySelector('#para2');

// Previous sibling
let p1 = p2.previousElementSibling;
console.log(p1);  // p#para1

// Next sibling
let p3 = p2.nextElementSibling;
console.log(p3);  // p#para3

// All siblings
let siblings = p2.parentElement.children;
console.log(siblings);
```

---

## 📊 DOM Node Properties

### Element Properties

```javascript
let heading = document.querySelector('h1');

// Tag name
console.log(heading.tagName);           // "H1"
console.log(heading.nodeName);          // "H1"

// Content
console.log(heading.textContent);       // Just text
console.log(heading.innerText);         // Just text (visible)
console.log(heading.innerHTML);         // HTML content

// Attributes
console.log(heading.id);                // Element ID
console.log(heading.className);         // CSS classes
console.log(heading.classList);         // List of classes

// Dimensions
console.log(heading.offsetWidth);       // Width in pixels
console.log(heading.offsetHeight);      // Height in pixels

// Position
console.log(heading.offsetLeft);        // Left position
console.log(heading.offsetTop);         // Top position
```

---

## 🗂️ Common DOM Relationships

| Property | Returns | Example |
|----------|---------|---------|
| `.parentElement` | Parent | `child.parentElement` |
| `.children` | HTMLCollection of children | `parent.children[0]` |
| `.firstElementChild` | First child | `parent.firstElementChild` |
| `.lastElementChild` | Last child | `parent.lastElementChild` |
| `.nextElementSibling` | Next sibling | `element.nextElementSibling` |
| `.previousElementSibling` | Previous sibling | `element.previousElementSibling` |
| `.childNodes` | All nodes (including text) | `parent.childNodes` |

---

## 🧪 Try It Yourself

### Exercise 1: Explore Document

Open your browser console and run:

```javascript
// Check document properties
console.log(document.title);
console.log(document.body);
console.log(document.head);

// Count paragraphs
let paragraphs = document.querySelectorAll('p');
console.log(`Found ${paragraphs.length} paragraphs`);
```

---

## 💪 Practice Exercises

### Exercise 2: Navigate DOM Tree

```html
<div id="main">
  <section id="intro">
    <h2>Introduction</h2>
    <p>Welcome to DOM</p>
  </section>
  <section id="content">
    <h2>Content</h2>
    <p>Learn the DOM</p>
  </section>
</div>
```

```javascript
// Start with the intro section
let intro = document.getElementById('intro');
console.log(intro.tagName);  // "SECTION"

// Get parent
console.log(intro.parentElement.id);  // "main"

// Get next sibling
console.log(intro.nextElementSibling.id);  // "content"

// Get first child
console.log(intro.firstElementChild.tagName);  // "H2"

// Get parent's parent
console.log(intro.parentElement.parentElement);  // document.body or higher
```

### Exercise 3: Element Properties

```javascript
let heading = document.querySelector('h1');

// Log properties
console.log("Tag:", heading.tagName);
console.log("Text:", heading.textContent);
console.log("Classes:", heading.className);
console.log("ID:", heading.id);

// Check if element has class
console.log(heading.classList.contains('important'));

// Get all attributes
console.log(heading.attributes);
```

### Exercise 4: Traverse Siblings

```html
<ul>
  <li id="item1">Item 1</li>
  <li id="item2">Item 2</li>
  <li id="item3">Item 3</li>
  <li id="item4">Item 4</li>
</ul>
```

```javascript
let item2 = document.getElementById('item2');

// Previous sibling
console.log(item2.previousElementSibling.id);  // "item1"

// Next sibling
console.log(item2.nextElementSibling.id);      // "item3"

// Parent (the ul)
console.log(item2.parentElement.tagName);      // "UL"

// All siblings
let siblings = item2.parentElement.children;
console.log(siblings.length);  // 4
```

### Exercise 5: Understanding Tree Structure

```javascript
// Get any element
let element = document.querySelector('p');

// Walk up to find the main container
let current = element;
while (current.parentElement) {
  console.log(current.tagName);
  current = current.parentElement;
}

// Output:
// P
// SECTION (or whatever contains it)
// MAIN (or whatever contains that)
// BODY
// HTML
// Document
```

---

## 🎯 Real-World DOM Scenario

```javascript
// HTML:
// <article id="post-1">
//   <h3>My Post</h3>
//   <p>Content here</p>
//   <div class="metadata">
//     <span class="author">Sarah</span>
//     <span class="date">Dec 1</span>
//   </div>
// </article>

let post = document.getElementById('post-1');

// Get title (first h3)
let title = post.querySelector('h3');
console.log(title.textContent);  // "My Post"

// Get metadata section
let metadata = post.querySelector('.metadata');

// Get author
let author = metadata.querySelector('.author');
console.log(author.textContent);  // "Sarah"

// Get date (next sibling)
let date = author.nextElementSibling;
console.log(date.textContent);  // "Dec 1"

// Get parent article info
console.log(post.id);  // "post-1"
```

---

## 🏆 Checkpoint

Before moving to Day 2, make sure you can:

- ✅ Explain what the DOM is
- ✅ Access the document object
- ✅ Use `.parentElement` to get parent
- ✅ Use `.children` to get children
- ✅ Use `.nextElementSibling` and `.previousElementSibling`
- ✅ Read element properties like `.tagName` and `.textContent`
- ✅ Traverse the DOM tree in different directions

**Can you do all of these?** If yes, you're ready for Day 2! 🚀

---

**Completion Time:** ~2 hours with exercises  
**Difficulty:** ⭐⭐⭐ (Intermediate)  
**Next Lesson:** Day 2 - Selecting Elements (getElementById, querySelector, etc.)
