# Week 9: Day 2 - State Management with Backend

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 9 Day 1

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Choose state management solution
- ✅ Integrate Redux with API
- ✅ Use async thunks
- ✅ Implement caching strategies
- ✅ Handle loading states

---

## 1️⃣ State Management Options

```javascript
// Context API - Built-in, simple
// Redux - Complex but powerful
// Zustand - Lightweight, simple syntax
// Recoil - Fine-grained reactivity
// MobX - Decorators and observables
```

---

## 2️⃣ Redux with Async Operations

```bash
npm install @reduxjs/toolkit react-redux axios
```

```javascript
// slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('/api/users');
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default userSlice.reducer;
```

---

## 3️⃣ Using Redux in Components

```jsx
// App.jsx
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './slices/userSlice';

export function UserList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {items.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 4️⃣ Zustand Alternative

```bash
npm install zustand
```

```javascript
// store.js
import create from 'zustand';

export const useStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      set({ users, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

// Usage
function UserList() {
  const { users, loading, fetchUsers } = useStore();
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return <div>{loading ? 'Loading' : users.map(u => <p>{u.name}</p>)}</div>;
}
```

---

## 5️⃣ Caching & Optimization

```javascript
// Cache layer
const cache = new Map();

async function getCachedUsers() {
  if (cache.has('users')) {
    return cache.get('users');
  }
  
  const response = await fetch('/api/users');
  const users = await response.json();
  cache.set('users', users);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete('users'), 5 * 60 * 1000);
  
  return users;
}
```

---

## 📝 Practice Exercises

### Exercise 1: Redux Setup
Create Redux store with user/product reducers

### Exercise 2: Async Thunks
Implement async thunks for API calls

### Exercise 3: Zustand Alternative
Rebuild Redux app with Zustand

### Exercise 4: Caching
Implement smart caching with invalidation

---

## ✅ Summary

- **Redux** for complex state
- **Zustand** for simple state
- **Async thunks** handle API calls
- **Loading states** improve UX
- **Caching** boosts performance

---

## 🔗 Next Steps

**Tomorrow (Day 3):** Real-time Features  
**Continue:** Master state management!
  email: String
});

const User = mongoose.model('User', schema);

// Create
await User.create({ name: 'John', email: 'john@example.com' });

// Read
const user = await User.findById(id);

// Update
await User.findByIdAndUpdate(id, { name: 'Jane' });

// Delete
await User.findByIdAndDelete(id);
```

## ✅ Checkpoint

- [ ] Know database types
- [ ] Can use ORM/ODM
- [ ] Understand CRUD
- [ ] Know queries

**Next:** Authentication! 🚀

