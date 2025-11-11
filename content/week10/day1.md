# Week 10: Day 1 - Frontend-Backend Integration

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Topics

- API consumption
- Error handling
- Loading states
- Authentication flow
- State management
- Real-time updates

## Integration Pattern

```javascript
// Frontend - API client
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Custom hook
function useAuth() {
  const [user, setUser] = useState(null);
  
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };
  
  return { user, login };
}
```

## ✅ Checkpoint

- [ ] Can integrate frontend & backend
- [ ] Handle errors properly
- [ ] Manage auth flow
- [ ] Use real APIs

**Next:** Full-Stack Testing! 🚀

