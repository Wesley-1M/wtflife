# Day 4: Fetch API - Making HTTP Requests

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Prerequisites:** Week 4 Days 1-3  
**By the end:** You'll fetch data from APIs and handle responses

---

## 📚 Overview

The **Fetch API** lets JavaScript make HTTP requests to servers. This is how web apps communicate with backends and get data from APIs.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Use** `fetch()` to make requests  
✅ **Handle** responses with `.json()`  
✅ **Use** async/await with Fetch  
✅ **Handle** errors properly  
✅ **Send** data with POST requests  

---

## 📡 Basic Fetch

### Syntax

```javascript
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

### Simple GET Request

```javascript
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(users => {
    console.log(users);  // Array of users
  })
  .catch(error => {
    console.log('Error:', error);
  });
```

### Response Object

```javascript
fetch(url)
  .then(response => {
    console.log(response.status);      // 200, 404, 500, etc.
    console.log(response.statusText);  // "OK", "Not Found", etc.
    console.log(response.headers);     // Response headers
    console.log(response.url);         // Final URL (after redirects)
    
    return response.json();  // Parse JSON
  });
```

---

## 🔄 With Async/Await

### Modern Way

```javascript
async function getUsers() {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/users');
    let users = await response.json();
    console.log(users);
  } catch (error) {
    console.log('Error:', error);
  }
}

getUsers();
```

### Checking Status

```javascript
async function getUser(id) {
  try {
    let response = await fetch(`https://api.example.com/users/${id}`);
    
    // Check if response was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let user = await response.json();
    return user;
  } catch (error) {
    console.log('Error:', error);
  }
}
```

---

## 📨 POST Requests - Sending Data

### Syntax

```javascript
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### Example: Create User

```javascript
async function createUser(userData) {
  try {
    let response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        company: {name: userData.company}
      })
    });
    
    let newUser = await response.json();
    console.log('User created:', newUser);
    return newUser;
  } catch (error) {
    console.log('Error:', error);
  }
}

createUser({name: 'Sarah', email: 'sarah@example.com', company: 'Acme'});
```

---

## 🔄 Common Request Methods

### GET - Retrieve Data

```javascript
fetch(url);  // GET is default

// Or explicit:
fetch(url, {method: 'GET'});
```

### POST - Create Data

```javascript
fetch(url, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(data)
});
```

### PUT - Update Data

```javascript
fetch(url, {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(updatedData)
});
```

### DELETE - Remove Data

```javascript
fetch(url, {method: 'DELETE'});
```

---

## 🌐 Real-World Example: Weather App

```javascript
async function getWeather(city) {
  try {
    // Fetch from weather API
    let response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${city}`
    );
    
    if (!response.ok) {
      throw new Error('City not found');
    }
    
    let data = await response.json();
    
    return {
      city: data.location.name,
      temp: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity
    };
  } catch (error) {
    console.log('Error getting weather:', error);
  }
}

getWeather('London').then(weather => {
  console.log(`Weather in ${weather.city}: ${weather.temp}°C, ${weather.condition}`);
});
```

---

## 🛡️ Error Handling

### Fetch Doesn't Reject on HTTP Errors

```javascript
// ⚠️ This doesn't reject!
fetch('https://httpstat.us/404')
  .then(response => {
    // response.ok is false, but no error
    console.log(response.ok);  // false
  });

// ✅ Check response.ok
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .catch(error => console.log('Error:', error));
```

### Network Errors Only Reject

```javascript
// Rejects when network fails (no internet)
fetch(url)
  .catch(error => {
    console.log('Network error:', error);
  });
```

---

## 📦 Parsing Different Content Types

### JSON (Most Common)

```javascript
let data = await response.json();
```

### Plain Text

```javascript
let text = await response.text();
```

### Blob (Images, Files)

```javascript
let blob = await response.blob();
let url = URL.createObjectURL(blob);
let img = document.querySelector('img');
img.src = url;
```

---

## 💪 Practice Exercises

### Exercise 1: Fetch Users

```javascript
async function listUsers() {
  let response = await fetch('https://jsonplaceholder.typicode.com/users');
  let users = await response.json();
  
  users.forEach(user => {
    console.log(`${user.name} (${user.email})`);
  });
}

listUsers();
```

### Exercise 2: Fetch with Error Handling

```javascript
async function getPost(id) {
  try {
    let response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    
    if (!response.ok) {
      throw new Error(`Post ${id} not found`);
    }
    
    let post = await response.json();
    console.log(post.title);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

getPost(1);
```

### Exercise 3: Create Data

```javascript
async function createTodo() {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      title: 'Learn Fetch API',
      completed: false,
      userId: 1
    })
  });
  
  let todo = await response.json();
  console.log('Created:', todo);
}

createTodo();
```

### Exercise 4: Multiple Requests

```javascript
async function getUserWithPosts(userId) {
  try {
    let userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    let user = await userRes.json();
    
    let postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    let posts = await postsRes.json();
    
    return {user, posts};
  } catch (error) {
    console.log('Error:', error);
  }
}

getUserWithPosts(1).then(data => console.log(data));
```

---

## 🏆 Checkpoint

Before moving to Day 5, make sure you can:

- ✅ Use `fetch()` to make GET requests
- ✅ Handle responses with `.json()`
- ✅ Use async/await with fetch
- ✅ Make POST requests
- ✅ Handle errors properly
- ✅ Check `response.ok`

**Ready for Day 5?** 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next Lesson:** Day 5 - Working with APIs (Real-World Data)
