# Day 2: Promises - Better Async Pattern

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Prerequisites:** Week 4 Day 1  
**By the end:** You'll write clean async code with Promises

---

## 📚 Overview

Promises solve **callback hell**. Instead of deeply nested callbacks, you chain operations with `.then()`.

A Promise is an object that represents a value that **may not be available yet** but will be eventually.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Understand** what Promises are  
✅ **Create** new Promises  
✅ **Use** `.then()` for success  
✅ **Use** `.catch()` for errors  
✅ **Use** `.finally()` for cleanup  
✅ **Chain** multiple Promises  

---

## 🤝 Promise States

A Promise is always in one of three states:

```javascript
// 1. PENDING - waiting for result
let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done!"), 2000);
});

// 2. FULFILLED - operation succeeded
let promise2 = Promise.resolve("Success!");

// 3. REJECTED - operation failed
let promise3 = Promise.reject("Error!");
```

---

## ✅ Creating Promises

### Syntax

```javascript
let promise = new Promise((resolve, reject) => {
  // Do async work
  // Call resolve(value) on success
  // Call reject(error) on failure
});
```

### Simple Example

```javascript
let myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 2000);
});

console.log(myPromise);  // Promise { <pending> }
// After 2 seconds: Promise { 'Success!' }
```

### With Error Handling

```javascript
let myPromise = new Promise((resolve, reject) => {
  let success = Math.random() > 0.5;
  
  setTimeout(() => {
    if (success) {
      resolve("Operation successful!");
    } else {
      reject("Operation failed!");
    }
  }, 2000);
});
```

---

## 📥 Using Promises with .then()

### Syntax

```javascript
promise.then(
  (value) => { /* Success handler */ },
  (error) => { /* Error handler */ }
);
```

### Simple .then()

```javascript
let promise = new Promise((resolve) => {
  setTimeout(() => resolve("Done!"), 2000);
});

promise.then((result) => {
  console.log(result);  // "Done!" after 2 seconds
});
```

### .then() with Both Handlers

```javascript
let promise = Promise.resolve("Success!");

promise.then(
  (result) => {
    console.log("Success:", result);
  },
  (error) => {
    console.log("Error:", error);
  }
);
```

### Chaining .then()

```javascript
let promise = Promise.resolve(5);

promise
  .then((num) => {
    console.log(num);  // 5
    return num * 2;    // Return new value
  })
  .then((num) => {
    console.log(num);  // 10
    return num + 3;
  })
  .then((num) => {
    console.log(num);  // 13
  });
```

---

## ❌ Error Handling with .catch()

### Basic .catch()

```javascript
let promise = Promise.reject("Something went wrong!");

promise.catch((error) => {
  console.log("Caught error:", error);
});
```

### Catch in Chain

```javascript
Promise.resolve(5)
  .then((num) => {
    if (num < 10) {
      throw new Error("Number too small!");
    }
    return num * 2;
  })
  .then((num) => {
    console.log(num);  // Not reached if error
  })
  .catch((error) => {
    console.log("Error:", error.message);  // "Number too small!"
  });
```

### .catch() Comes After .then()

```javascript
Promise.reject("Error!")
  .then(
    (result) => console.log("Success:", result),
    (error) => console.log("Error:", error)  // Catches here
  );

// OR

Promise.reject("Error!")
  .then((result) => console.log("Success:", result))
  .catch((error) => console.log("Error:", error));  // Catches here
```

---

## 🔄 .finally() - Always Runs

### Syntax

```javascript
promise
  .then((result) => { /* ... */ })
  .catch((error) => { /* ... */ })
  .finally(() => { /* Runs no matter what */ });
```

### Example: Loading State

```javascript
let promise = fetchUserData(123);

console.log("Loading...");

promise
  .then((user) => {
    console.log("User:", user);
  })
  .catch((error) => {
    console.log("Error:", error);
  })
  .finally(() => {
    console.log("Loading complete!");  // Always runs
  });
```

---

## 🔗 Real-World Example: Sequential Requests

### Without Promises (Callback Hell)

```javascript
fetchUser(1, (user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      console.log(comments);
    });
  });
});
```

### With Promises (Clean Chain)

```javascript
fetchUser(1)
  .then((user) => fetchPosts(user.id))
  .then((posts) => fetchComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((error) => console.log("Error:", error));
```

---

## 🎯 Promise.all() - Wait for All

### Syntax

```javascript
Promise.all([promise1, promise2, promise3])
  .then((results) => {
    // results = [value1, value2, value3]
  })
  .catch((error) => {
    // If ANY promise rejects
  });
```

### Example

```javascript
let p1 = Promise.resolve(10);
let p2 = new Promise(resolve => setTimeout(() => resolve(20), 1000));
let p3 = Promise.resolve(30);

Promise.all([p1, p2, p3])
  .then((results) => {
    console.log(results);  // [10, 20, 30]
  });
```

---

## 🏃 Promise.race() - First One Wins

### Syntax

```javascript
Promise.race([promise1, promise2, promise3])
  .then((firstResult) => {
    // Returns first promise that completes
  });
```

### Example

```javascript
let p1 = new Promise(resolve => setTimeout(() => resolve("Slow"), 3000));
let p2 = new Promise(resolve => setTimeout(() => resolve("Fast"), 100));

Promise.race([p1, p2])
  .then((result) => {
    console.log(result);  // "Fast"
  });
```

---

## 🧪 Try It Yourself

### Exercise 1: Simple Promise

```javascript
let promise = new Promise((resolve) => {
  setTimeout(() => resolve("Hello from Promise!"), 2000);
});

promise.then((message) => {
  console.log(message);
});
```

---

## 💪 Practice Exercises

### Exercise 2: Promise Chain

```javascript
Promise.resolve("Step 1")
  .then((value) => {
    console.log(value);
    return "Step 2";
  })
  .then((value) => {
    console.log(value);
    return "Step 3";
  })
  .then((value) => {
    console.log(value);
  });

// Output:
// Step 1
// Step 2
// Step 3
```

### Exercise 3: Error Handling

```javascript
new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("Something went wrong!");
  }, 1000);
})
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((error) => {
    console.log("Caught:", error);
  })
  .finally(() => {
    console.log("Done!");
  });
```

### Exercise 4: Promise.all()

```javascript
let users = Promise.resolve([{id: 1, name: "Alice"}]);
let posts = Promise.resolve([{id: 1, title: "First Post"}]);
let comments = Promise.resolve([{id: 1, text: "Great!"}]);

Promise.all([users, posts, comments])
  .then(([userData, postData, commentData]) => {
    console.log("All data:", userData, postData, commentData);
  });
```

### Exercise 5: Simulate API Calls

```javascript
function getUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({id, name: "Sarah", email: "sarah@example.com"});
    }, 1000);
  });
}

function getPostsByUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {id: 1, title: "First Post"},
        {id: 2, title: "Second Post"}
      ]);
    }, 1000);
  });
}

getUser(1)
  .then((user) => {
    console.log("User:", user);
    return getPostsByUser(user.id);
  })
  .then((posts) => {
    console.log("Posts:", posts);
  })
  .catch((error) => {
    console.log("Error:", error);
  });
```

---

## 🎯 Promise Cheat Sheet

| Method | Purpose | Example |
|--------|---------|---------|
| `.then()` | Handle success | `.then(result => ...)` |
| `.catch()` | Handle error | `.catch(error => ...)` |
| `.finally()` | Always run | `.finally(() => ...)` |
| `Promise.all()` | Wait for all | `Promise.all([p1, p2])` |
| `Promise.race()` | First one | `Promise.race([p1, p2])` |
| `Promise.resolve()` | Already resolved | `Promise.resolve(value)` |
| `Promise.reject()` | Already rejected | `Promise.reject(error)` |

---

## 🏆 Checkpoint

Before moving to Day 3, make sure you can:

- ✅ Create new Promises
- ✅ Use `.then()` for success
- ✅ Use `.catch()` for errors
- ✅ Use `.finally()`
- ✅ Chain multiple Promises
- ✅ Use `Promise.all()`
- ✅ Use `Promise.race()`

**Ready for Day 3?** 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next Lesson:** Day 3 - Async/Await (Modern Async Syntax)
