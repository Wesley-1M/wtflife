# Day 1: Async Basics - Understanding Asynchronous JavaScript

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Prerequisites:** Week 1 + Week 2 (Callbacks, Higher-Order Functions)  
**By the end:** You'll understand why async code is essential

---

## 📚 Overview

Most JavaScript runs **synchronously** (line by line). But some operations take time:
- Downloading data from internet
- Reading files
- Database queries

JavaScript has **asynchronous programming** to handle these without freezing the page.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Understand** synchronous vs asynchronous code  
✅ **Understand** the event loop  
✅ **Use** setTimeout for delayed execution  
✅ **Use** callbacks for asynchronous operations  
✅ **Understand** why callbacks are important  

---

## ⏱️ Synchronous vs Asynchronous

### Synchronous Code (Blocking)

```javascript
console.log("Start");

// This blocks everything!
function sleep(milliseconds) {
  const start = Date.now();
  while (Date.now() - start < milliseconds) {}
}

sleep(3000);  // Wait 3 seconds - page is frozen!
console.log("End");

// Output:
// Start
// (3 second delay - page frozen)
// End
```

### Asynchronous Code (Non-Blocking)

```javascript
console.log("Start");

setTimeout(() => {
  console.log("After 3 seconds");
}, 3000);

console.log("End");

// Output:
// Start
// End
// (3 second delay)
// After 3 seconds
```

**Key difference:** Page doesn't freeze!

---

## 🕐 setTimeout - Schedule Code

### Syntax

```javascript
setTimeout(function, milliseconds);
```

### Simple Example

```javascript
// Run code after 2 seconds
setTimeout(() => {
  console.log("Delayed message!");
}, 2000);

console.log("This prints first");

// Output:
// This prints first
// (2 second delay)
// Delayed message!
```

### Parameters and Scopes

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

setTimeout(greet, 2000, "Sarah");
// After 2 seconds: Hello, Sarah!
```

### Returning a Timer ID

```javascript
let timerId = setTimeout(() => {
  console.log("This will not run");
}, 5000);

// Cancel it before it runs
clearTimeout(timerId);
console.log("Timer cancelled!");
```

---

## 🔄 setInterval - Repeat Code

### Syntax

```javascript
setInterval(function, milliseconds);
```

### Simple Example

```javascript
let count = 0;

let intervalId = setInterval(() => {
  count++;
  console.log(`Count: ${count}`);
}, 1000);

// Logs every 1 second:
// Count: 1
// Count: 2
// Count: 3
// ...
```

### Stop Interval

```javascript
let count = 0;

let intervalId = setInterval(() => {
  count++;
  console.log(`Count: ${count}`);
  
  if (count === 5) {
    clearInterval(intervalId);  // Stop after 5 times
  }
}, 1000);
```

---

## 📞 Callbacks - The Original Async Pattern

### What is a Callback?

A callback is a function passed to another function, called **later** (not immediately).

```javascript
// Synchronous callback (called immediately)
let numbers = [1, 2, 3];
numbers.forEach(num => console.log(num));

// Asynchronous callback (called later)
setTimeout(() => console.log("Later!"), 1000);
```

### Simulating Async Operation

```javascript
// Simulate downloading data (takes time)
function fetchData(userId, callback) {
  console.log(`Fetching user ${userId}...`);
  
  setTimeout(() => {
    let user = {id: userId, name: "Sarah", email: "sarah@example.com"};
    callback(user);  // Call callback when done
  }, 2000);
}

// Use it
fetchData(1, (user) => {
  console.log("User:", user);
});

console.log("Request sent, page continues...");

// Output:
// Fetching user 1...
// Request sent, page continues...
// (2 second wait)
// User: {id: 1, name: "Sarah", email: "sarah@example.com"}
```

### Error Handling with Callbacks

```javascript
function fetchDataWithError(userId, onSuccess, onError) {
  console.log(`Fetching user ${userId}...`);
  
  setTimeout(() => {
    // Simulate random success/failure
    if (Math.random() > 0.3) {
      let user = {id: userId, name: "Sarah"};
      onSuccess(user);
    } else {
      onError("Network error!");
    }
  }, 2000);
}

// Use it
fetchDataWithError(
  1,
  (user) => {
    console.log("Success:", user);
  },
  (error) => {
    console.log("Error:", error);
  }
);
```

---

## 🔁 The Event Loop

The event loop is how JavaScript handles asynchronous code.

### How It Works

1. **Synchronous code** runs first (call stack)
2. **Asynchronous code** waits in a queue
3. When synchronous code finishes, run queued code

```javascript
console.log("1. Start");

setTimeout(() => {
  console.log("2. After timeout");
}, 0);  // Even with 0ms!

console.log("3. End");

// Output:
// 1. Start
// 3. End
// (Then event loop processes timeout)
// 2. After timeout
```

### Why?

```javascript
// This demonstrates the event loop
function task1() {
  console.log("Task 1");
}

function task2() {
  console.log("Task 2");
}

function scheduleAsync() {
  setTimeout(() => {
    console.log("Async task");
  }, 0);
}

task1();        // Runs immediately
scheduleAsync(); // Scheduled for later
task2();        // Runs immediately

// Output:
// Task 1
// Task 2
// Async task (even though timeout was 0!)
```

---

## 🌐 Real-World Example: Button Click

```html
<button id="btn">Download Data</button>
<p id="status">Ready</p>

<script>
  let btn = document.getElementById('btn');
  let status = document.getElementById('status');
  
  btn.addEventListener('click', () => {
    status.textContent = "Downloading...";
    
    // Simulate network request
    setTimeout(() => {
      let data = {name: "Sarah", age: 28};
      status.textContent = `Downloaded: ${JSON.stringify(data)}`;
    }, 3000);
  });
</script>
```

---

## ⚠️ Callback Hell

### The Problem

```javascript
// Multiple nested callbacks = hard to read!
setTimeout(() => {
  console.log("Step 1");
  
  setTimeout(() => {
    console.log("Step 2");
    
    setTimeout(() => {
      console.log("Step 3");
      
      setTimeout(() => {
        console.log("Step 4");
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

// Output (after 4 seconds):
// Step 1
// Step 2
// Step 3
// Step 4
```

This is called **"Callback Hell"** or **"Pyramid of Doom"**.

Solution: **Promises** (next lesson) and **Async/Await** (lesson after)

---

## 🧪 Try It Yourself

### Exercise 1: Delayed Greeting

```javascript
setTimeout(() => {
  console.log("Hello from the future!");
}, 2000);
```

---

## 💪 Practice Exercises

### Exercise 2: Multiple Timeouts

```javascript
setTimeout(() => console.log("First (1s)"), 1000);
setTimeout(() => console.log("Third (3s)"), 3000);
setTimeout(() => console.log("Second (2s)"), 2000);

console.log("Logged first (synchronous)");

// Output:
// Logged first (synchronous)
// First (1s)
// Second (2s)
// Third (3s)
```

### Exercise 3: Counter with Interval

```javascript
let count = 10;
let intervalId = setInterval(() => {
  count--;
  console.log(count);
  
  if (count === 0) {
    clearInterval(intervalId);
    console.log("Blastoff!");
  }
}, 1000);
```

### Exercise 4: Callback Pattern

```javascript
function loadUser(userId, callback) {
  console.log("Loading user...");
  
  setTimeout(() => {
    let user = {
      id: userId,
      name: "John",
      email: "john@example.com"
    };
    callback(user);
  }, 2000);
}

loadUser(1, (user) => {
  console.log("User loaded:", user.name);
  console.log("Email:", user.email);
});

console.log("Request sent");
```

### Exercise 5: Error Callback

```javascript
function performTask(callback, onError) {
  setTimeout(() => {
    // 50% chance of success
    if (Math.random() > 0.5) {
      callback("Task completed successfully!");
    } else {
      onError("Task failed!");
    }
  }, 2000);
}

performTask(
  (success) => console.log("Success:", success),
  (error) => console.log("Error:", error)
);
```

---

## 🎯 Key Concepts

| Term | Meaning | Example |
|------|---------|---------|
| **Synchronous** | Code runs line by line, waits for each to finish | `let x = 5; let y = 10;` |
| **Asynchronous** | Code runs without waiting for previous to finish | `setTimeout(...)` |
| **Callback** | Function passed to another function, called later | `array.forEach(fn)` |
| **Event Loop** | Mechanism that handles async code | Runs queued code after sync |
| **setTimeout** | Run code after delay | `setTimeout(fn, ms)` |
| **setInterval** | Run code repeatedly | `setInterval(fn, ms)` |

---

## 🏆 Checkpoint

Before moving to Day 2, make sure you can:

- ✅ Explain difference between sync and async code
- ✅ Use `setTimeout()` and `clearTimeout()`
- ✅ Use `setInterval()` and `clearInterval()`
- ✅ Understand callbacks for async operations
- ✅ Understand the event loop
- ✅ Handle success and error callbacks

**Can you do all of these?** If yes, you're ready for Day 2! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next Lesson:** Day 2 - Promises (Better Async Pattern)
