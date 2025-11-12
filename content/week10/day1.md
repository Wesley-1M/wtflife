# Week 10: Day 1 - Advanced JavaScript & Async Patterns

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** JavaScript Fundamentals

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Master Promises and async/await
- ✅ Handle concurrent operations
- ✅ Understand event loop deeply
- ✅ Use generators and iterators
- ✅ Implement error handling patterns

---

## 1️⃣ Promises Deep Dive

```javascript
// Promise states: pending → fulfilled/rejected
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));

// Promise.all - wait for all
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results))
  .catch(error => console.error(error));

// Promise.race - first one wins
Promise.race([promise1, promise2])
  .then(result => console.log(result));

// Promise.allSettled - all results
Promise.allSettled([promise1, promise2])
  .then(results => console.log(results));
```

---

## 2️⃣ Async/Await

```javascript
// Better syntax for promises
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Concurrent requests
async function getMultipleUsers(ids) {
  const users = await Promise.all(
    ids.map(id => fetch(`/api/users/${id}`).then(r => r.json()))
  );
  return users;
}
```

---

## 3️⃣ Generators & Iterators

```javascript
// Generator function
function* countUp() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = countUp();
console.log(generator.next()); // { value: 1, done: false }

// Async generator
async function* fetchPages(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    yield await response.json();
  }
}
```

---

## 4️⃣ Event Loop & Microtasks

```javascript
console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve()
  .then(() => console.log('Promise'));

console.log('End');

// Output: Start, End, Promise, Timeout
```

---

## 5️⃣ Error Handling Patterns

```javascript
async function robustOperation() {
  try {
    const data = await fetchData();
    const processed = await processData(data);
    await saveData(processed);
  } catch (error) {
    console.error(error);
  }
}

// Retry mechanism
async function fetchWithRetry(url, retries = 3) {
  try {
    return await fetch(url).then(r => r.json());
  } catch (error) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}
```

---

## 📝 Practice Exercises

### Exercise 1: Concurrent Requests
Fetch multiple APIs concurrently with Promise.all

### Exercise 2: Async Generator
Create async generator for paginated data fetching

### Exercise 3: Error Handling
Implement retry logic with exponential backoff

### Exercise 4: Event Loop
Trace execution order with mixed async operations

---

## ✅ Summary

- **Promises** for async operations
- **Async/await** cleaner syntax
- **Generators** for iterative operations
- **Concurrency** with Promise.all
- **Error handling** with try-catch
- **Event loop** understanding critical

---

## 🔗 Next Steps

**Week 11:** Next.js & Advanced React  
**Continue:** Master asynchronous programming!

