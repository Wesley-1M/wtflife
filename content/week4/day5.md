# Day 5: Working with APIs - Real-World Data

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Prerequisites:** Week 4 Days 1-4  
**By the end:** You'll integrate real APIs into applications

---

## 📚 Overview

Today we combine everything from Week 4 to work with **real public APIs**. You'll fetch data, handle errors, and display it beautifully.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Use** public APIs  
✅ **Handle** API responses  
✅ **Display** data in the DOM  
✅ **Handle** loading and error states  
✅ **Build** complete API-driven applications  

---

## 🌐 Popular Public APIs

### JSONPlaceholder (Mock Data)

```javascript
// No authentication needed
// Perfect for learning

fetch('https://jsonplaceholder.typicode.com/users')
```

### OpenWeatherMap

```javascript
// Requires API key (free)
fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY`)
```

### GitHub API

```javascript
// No auth for public data
fetch('https://api.github.com/users/torvalds')
```

### REST Countries

```javascript
// No auth needed
fetch('https://restcountries.com/v3.1/all')
```

---

## 📊 Loading Data and Displaying

### Pattern

```javascript
async function loadData() {
  // 1. Show loading state
  showLoadingState();
  
  try {
    // 2. Fetch data
    let response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load');
    let data = await response.json();
    
    // 3. Display data
    displayData(data);
  } catch (error) {
    // 4. Show error
    showError(error.message);
  }
}

function showLoadingState() {
  document.querySelector('#content').innerHTML = '<p>Loading...</p>';
}

function displayData(data) {
  document.querySelector('#content').innerHTML = renderData(data);
}

function showError(message) {
  document.querySelector('#content').innerHTML = `<p class="error">${message}</p>`;
}
```

---

## 🔄 Example: User Listing

```html
<div id="content"></div>

<script>
async function loadUsers() {
  try {
    document.querySelector('#content').innerHTML = 'Loading...';
    
    let response = await fetch('https://jsonplaceholder.typicode.com/users');
    let users = await response.json();
    
    let html = users.map(user => `
      <div class="user">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <p>${user.company.name}</p>
      </div>
    `).join('');
    
    document.querySelector('#content').innerHTML = html;
  } catch (error) {
    document.querySelector('#content').innerHTML = `Error: ${error.message}`;
  }
}

loadUsers();
</script>
```

---

## 🎭 Real Example: GitHub User Search

```javascript
async function searchGitHubUser(username) {
  try {
    // Fetch GitHub user
    let response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error('User not found');
    }
    
    let user = await response.json();
    
    // Display results
    document.querySelector('#result').innerHTML = `
      <div class="user-card">
        <img src="${user.avatar_url}" alt="${user.name}">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || 'No bio'}</p>
        <p>📍 ${user.location || 'No location'}</p>
        <p>Repos: ${user.public_repos}</p>
        <p>Followers: ${user.followers}</p>
      </div>
    `;
  } catch (error) {
    document.querySelector('#result').innerHTML = `<p class="error">${error.message}</p>`;
  }
}

// Use it
searchGitHubUser('torvalds');
```

---

## 🌍 Real Example: Country Info

```javascript
async function getCountryInfo(countryName) {
  try {
    let response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    let countries = await response.json();
    let country = countries[0];
    
    return {
      name: country.name.common,
      capital: country.capital?.[0] || 'N/A',
      population: country.population,
      languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
      flag: country.flags.svg
    };
  } catch (error) {
    throw new Error('Country not found');
  }
}

// Use it
getCountryInfo('France').then(info => {
  console.log(`${info.flag} ${info.name}`);
  console.log(`Capital: ${info.capital}`);
  console.log(`Population: ${info.population}`);
});
```

---

## 🏗️ Complete App Pattern

```javascript
class APIApp {
  constructor() {
    this.container = document.querySelector('#app');
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    document.querySelector('#search-btn').addEventListener('click', () => {
      let query = document.querySelector('#search-input').value;
      this.search(query);
    });
  }
  
  async search(query) {
    this.showLoading();
    
    try {
      let data = await this.fetchData(query);
      this.displayResults(data);
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  async fetchData(query) {
    let response = await fetch(`/api/search?q=${query}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  }
  
  displayResults(data) {
    this.container.innerHTML = this.renderHTML(data);
  }
  
  renderHTML(data) {
    return data.map(item => `<div>${item.name}</div>`).join('');
  }
  
  showLoading() {
    this.container.innerHTML = '<p>Loading...</p>';
  }
  
  showError(message) {
    this.container.innerHTML = `<p class="error">${message}</p>`;
  }
}

// Use it
let app = new APIApp();
```

---

## 💪 Practice Exercises

### Exercise 1: Fetch Posts

```javascript
async function displayPosts(userId) {
  try {
    let response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    let posts = await response.json();
    
    let html = posts.map(post => `
      <article>
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      </article>
    `).join('');
    
    document.querySelector('#posts').innerHTML = html;
  } catch (error) {
    console.log('Error:', error);
  }
}

displayPosts(1);
```

### Exercise 2: Pagination

```javascript
async function loadPage(page) {
  let limit = 10;
  let skip = (page - 1) * limit;
  
  let response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${skip}&_limit=${limit}`);
  let posts = await response.json();
  
  return posts;
}

let page1 = await loadPage(1);
let page2 = await loadPage(2);
```

### Exercise 3: Combine Multiple APIs

```javascript
async function getUserWithDetails(userId) {
  try {
    // Fetch user
    let userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    let user = await userRes.json();
    
    // Fetch user's posts
    let postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    let posts = await postsRes.json();
    
    // Fetch comments on first post
    let comments = [];
    if (posts.length > 0) {
      let commentsRes = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${posts[0].id}`);
      comments = await commentsRes.json();
    }
    
    return {user, posts, comments};
  } catch (error) {
    console.log('Error:', error);
  }
}

let details = await getUserWithDetails(1);
console.log(details);
```

---

## 🌟 API Tips

### CORS (Cross-Origin Resource Sharing)

Some APIs block requests from browsers. If you get a CORS error:

```
Access to XMLHttpRequest at 'https://api.example.com' from origin 'http://localhost:8000' 
has been blocked by CORS policy
```

Solutions:
- Use a backend proxy
- Use CORS-enabled APIs (like JSONPlaceholder, GitHub API)
- Use a CORS proxy service

### Rate Limiting

Many APIs limit requests per minute. Handle gracefully:

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      let response = await fetch(url);
      if (response.ok) return response;
      
      if (response.status === 429) {
        // Too many requests - wait and retry
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}
```

---

## 🏆 Checkpoint

Before the Week 4 Project, make sure you can:

- ✅ Fetch data from public APIs
- ✅ Handle API responses and errors
- ✅ Display data in the DOM
- ✅ Show loading and error states
- ✅ Combine multiple API calls
- ✅ Build API-driven applications

**Ready for the Week 4 Project?** 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next:** Week 4 Project - Build a Weather App
