# Day 3: Async/Await - Modern Asynchronous Syntax

**Duration:** 2 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Prerequisites:** Week 4 Days 1-2  
**By the end:** You'll write async code that looks like synchronous code

---

## 📚 Overview

`async/await` is **syntactic sugar** for Promises. It makes async code look and feel like synchronous code - much easier to read!

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Create** async functions  
✅ **Use** await to pause execution  
✅ **Handle** errors with try/catch  
✅ **Understand** async/await vs Promises  

---

## 🔄 Async Functions

### Syntax

```javascript
async function myFunction() {
  return "result";
}
```

### What Makes It Async?

```javascript
// Regular function
function regular() {
  return 5;
}
console.log(regular());  // 5

// Async function
async function asyncVersion() {
  return 5;
}
console.log(asyncVersion());  // Promise { 5 }
```

**Key:** Async functions **always return a Promise**!

---

## ⏸️ Await Keyword

### Pause Until Promise Resolves

```javascript
async function getUser() {
  // Wait for promise to resolve
  let user = await fetchUser(1);
  
  // This line doesn't run until promise resolves
  console.log(user);
}

getUser();
```

### Compare: Promises vs Async/Await

```javascript
// With Promises
fetchUser(1)
  .then((user) => {
    console.log(user);
  });

// With Async/Await (looks like sync code!)
async function getUser() {
  let user = await fetchUser(1);
  console.log(user);
}
getUser();
```

### Sequential Operations

```javascript
async function workflow() {
  console.log("Step 1");
  
  await sleep(1000);
  console.log("Step 2 (after 1s)");
  
  await sleep(1000);
  console.log("Step 3 (after 2s)");
  
  return "Done!";
}

workflow();  // Returns Promise
```

---

## 🛡️ Error Handling with Try/Catch

### Syntax

```javascript
async function myFunction() {
  try {
    // Code that might fail
    let result = await riskyOperation();
    return result;
  } catch (error) {
    // Handle error
    console.log("Error:", error);
  }
}
```

### Example

```javascript
async function getUser(userId) {
  try {
    let user = await fetchUser(userId);
    console.log("User:", user);
    return user;
  } catch (error) {
    console.log("Failed to fetch user:", error);
  }
}
```

### Finally

```javascript
async function operation() {
  try {
    let result = await doSomething();
    return result;
  } catch (error) {
    console.log("Error:", error);
  } finally {
    console.log("Cleanup!");  // Always runs
  }
}
```

---

## 🔗 Multiple Awaits

### Sequential (One After Another)

```javascript
async function sequence() {
  let user = await fetchUser(1);
  console.log("User:", user);
  
  let posts = await fetchPosts(user.id);
  console.log("Posts:", posts);
  
  let comments = await fetchComments(posts[0].id);
  console.log("Comments:", comments);
  
  return comments;
}

sequence();  // Takes ~3 seconds total
```

### Parallel (All at Once)

```javascript
async function parallel() {
  // Start all at once
  let [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  
  return {users, posts, comments};
}

parallel();  // Takes ~1 second total (fastest operation)
```

---

## 🔄 Real-World Example

```javascript
async function getUserData(userId) {
  try {
    // Load user
    let user = await fetchUser(userId);
    console.log("User loaded:", user.name);
    
    // Load their posts
    let posts = await fetchPosts(userId);
    console.log("Posts loaded:", posts.length);
    
    // Combine data
    return {
      user,
      posts,
      postCount: posts.length
    };
  } catch (error) {
    console.log("Error loading user data:", error);
    return null;
  }
}

// Use it
let data = await getUserData(1);
console.log(data);
```

---

## ⚡ Async vs Promises Comparison

| Aspect | Promises | Async/Await |
|--------|----------|------------|
| **Syntax** | `.then().catch()` | `try/catch` |
| **Readability** | Chains | Looks sync |
| **Error Handling** | `.catch()` | `try/catch` |
| **When Ready** | Now | Modern browsers |

---

## 💪 Practice Exercises

### Exercise 1: Simple Async

```javascript
async function greet() {
  return "Hello!";
}

greet().then(msg => console.log(msg));
```

### Exercise 2: Await

```javascript
async function delayed() {
  console.log("Start");
  await new Promise(r => setTimeout(r, 2000));
  console.log("After 2 seconds");
}

delayed();
```

### Exercise 3: Error Handling

```javascript
async function safeFetch() {
  try {
    let data = await fetch('https://jsonplaceholder.typicode.com/users/1');
    let user = await data.json();
    return user;
  } catch (error) {
    console.log("Error:", error);
  }
}

safeFetch();
```

### Exercise 4: Sequential Operations

```javascript
async function sequence() {
  try {
    let user = await fetchUser(1);
    let posts = await fetchPosts(user.id);
    let firstComment = await fetchComments(posts[0].id);
    
    console.log(firstComment);
  } catch (error) {
    console.log("Error:", error);
  }
}

sequence();
```

---

## 🏆 Checkpoint

Before moving to Day 4, make sure you can:

- ✅ Create async functions
- ✅ Use await to pause execution
- ✅ Handle errors with try/catch
- ✅ Use await with multiple operations

**Ready for Day 4?** 🚀

---

**Completion Time:** ~2 hours with exercises  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next Lesson:** Day 4 - Fetch API (Making HTTP Requests)
