# Week 9: Day 1 - API Integration from React

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 8 Complete

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Connect React to backend APIs
- ✅ Handle async data fetching
- ✅ Manage loading and error states
- ✅ Use custom hooks for API calls
- ✅ Implement proper error handling patterns

---

## 1️⃣ Setting Up API Client

### Basic Fetch Setup

```javascript
// api/client.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }

  return response.json();
}

export const API = {
  // User endpoints
  getUsers: () => apiCall('/api/users'),
  getUser: (id) => apiCall(`/api/users/${id}`),
  createUser: (data) => apiCall('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => apiCall(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => apiCall(`/api/users/${id}`, { method: 'DELETE' }),
  
  // Todo endpoints
  getTodos: () => apiCall('/api/todos'),
  createTodo: (data) => apiCall('/api/todos', { method: 'POST', body: JSON.stringify(data) }),
  updateTodo: (id, data) => apiCall(`/api/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTodo: (id) => apiCall(`/api/todos/${id}`, { method: 'DELETE' })
};
```

### Using Axios (Alternative)

```bash
npm install axios
```

```javascript
// api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 2️⃣ Fetching Data in Components

### Basic Data Fetching

```jsx
import { useState, useEffect } from 'react';
import { API } from '../api/client';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const data = await API.getUsers();
        if (isMounted) {
          setUsers(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="user-list">
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Fetching with Parameters

```jsx
export function UserDetail({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const data = await API.getUser(userId);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]); // Re-fetch when userId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-detail">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
    </div>
  );
}
```

---

## 3️⃣ Custom Hook for API Calls

### useFetch Hook

```javascript
// hooks/useFetch.js
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ data: null, loading: false, error: error.message });
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
}

// Usage
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### useAsync Hook (More Advanced)

```javascript
// hooks/useAsync.js
import { useState, useCallback, useEffect } from 'react';

export function useAsync(asyncFunction, immediate = true) {
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
      return response;
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
}

// Usage
function Dashboard() {
  const { data: dashboard, loading, error, execute } = useAsync(
    () => fetch('/api/dashboard').then(r => r.json())
  );

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {dashboard && <p>Welcome {dashboard.userName}</p>}
      <button onClick={execute}>Refresh</button>
    </div>
  );
}
```

---

## 4️⃣ Handling Form Submissions

### POST Request Example

```jsx
export function CreateUserForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const newUser = await API.createUser(formData);
      
      setSuccess(true);
      setFormData({ name: '', email: '' });
      
      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={loading}
        />
      </div>
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">User created successfully!</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

---

## 5️⃣ Error Handling Patterns

### Retry Logic

```javascript
export async function fetchWithRetry(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      // Exponential backoff
      const delay = Math.pow(2, 3 - retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
```

### Error Boundary Component

```jsx
export class ApiErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 6️⃣ Request/Response Interceptors

```javascript
// api/interceptors.js
export function setupInterceptors(api) {
  // Add request interceptor
  api.interceptors.request.use(
    config => {
      // Add auth token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request ID for tracking
      config.headers['X-Request-ID'] = generateRequestId();
      
      console.log('Request:', config.url);
      return config;
    },
    error => Promise.reject(error)
  );

  // Add response interceptor
  api.interceptors.response.use(
    response => {
      console.log('Response:', response.status);
      return response;
    },
    error => {
      const { status } = error.response || {};
      
      // Handle specific errors
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );
}

function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## 📝 Practice Exercises

### Exercise 1: Build Product Listing Page
Fetch products from API and display with loading states

### Exercise 2: Create Product Form
Build form to POST new product to backend

### Exercise 3: Implement Search
Add search functionality with query parameters

### Exercise 4: Error Handling
Add retry logic and error boundaries

---

## ✅ Summary

- **API integration** connects frontend to backend
- **Custom hooks** reuse API logic
- **Error handling** improves reliability
- **Loading states** enhance UX
- **Interceptors** handle auth and errors
- **Best practices** prevent common issues

---

## 🔗 Next Steps

**Tomorrow (Day 2):** State Management with Backend  
**Continue:** Master full-stack development!
- [ ] Understand routing

**Next:** Databases! 🚀

