# Week 13: Day 3 - Frontend Implementation

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Build React components
- Implement state management
- Integrate with API
- Handle authentication
- Create responsive UI

## Frontend Setup

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── Post/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   └── PostList.jsx
│   │   ├── User/
│   │   │   ├── UserProfile.jsx
│   │   │   └── UserCard.jsx
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   └── Common/
│   │       ├── Loading.jsx
│   │       ├── Error.jsx
│   │       └── Button.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── NotFound.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── post.service.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useForm.js
│   ├── store/
│   │   ├── authStore.js
│   │   ├── postStore.js
│   │   └── uiStore.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.jsx
│   └── index.jsx
├── public/
├── package.json
└── Dockerfile
```

### React Setup with Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

### API Service

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
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

### State Management (Zustand)

```javascript
// src/store/authStore.js
import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Login failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', 
        { email, password, username }
      );
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Registration failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

// src/store/postStore.js
export const usePostStore = create((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/posts');
      set({ posts: data.posts });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createPost: async (title, content) => {
    try {
      const { data } = await api.post('/posts', { title, content });
      set(state => ({ posts: [data, ...state.posts] }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  updatePost: async (id, title, content) => {
    try {
      const { data } = await api.put(`/posts/${id}`, { title, content });
      set(state => ({
        posts: state.posts.map(p => p.id === id ? data : p)
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  deletePost: async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      set(state => ({
        posts: state.posts.filter(p => p.id !== id)
      }));
    } catch (err) {
      set({ error: err.message });
    }
  }
}));
```

### Components

```javascript
// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white rounded p-2 disabled:bg-gray-400"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

// src/components/Post/PostList.jsx
import React, { useEffect } from 'react';
import { usePostStore } from '../../store/postStore';
import PostCard from './PostCard';
import Loading from '../Common/Loading';

export default function PostList() {
  const { posts, isLoading, error, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// src/components/Post/PostForm.jsx
import React, { useState } from 'react';
import { usePostStore } from '../../store/postStore';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createPost, isLoading } = usePostStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Create Post</h2>
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="5"
          className="w-full border rounded p-2"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white rounded p-2 disabled:bg-gray-400"
      >
        {isLoading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
```

### Routing

```javascript
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Layout from './components/Layout/Layout';

function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```

## ✅ Checkpoint

- [ ] React app running
- [ ] API service configured
- [ ] State management working
- [ ] Authentication flows complete
- [ ] Post CRUD working
- [ ] UI responsive
- [ ] Error handling in place

**Next:** Testing & Deployment! 🚀

