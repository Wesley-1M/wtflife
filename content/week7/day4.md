# Week 7: Day 4 - API Integration & Data Fetching

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐

---

## Topics

- REST APIs
- Authentication
- Error handling
- Caching
- Pagination
- Real-time updates

## Key Concepts

```javascript
Fetch API - HTTP requests
Axios - HTTP client
React Query - Data fetching
SWR - Stale-while-revalidate
Interceptors - Request/response handling
```

## Example

```jsx
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api.example.com'
});

// Interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function UserData() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    API.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);
  
  return users.map(user => <p key={user.id}>{user.name}</p>);
}
```

## ✅ Checkpoint

- [ ] Can fetch from APIs
- [ ] Can handle auth
- [ ] Can handle errors
- [ ] Know caching patterns

**Next:** State Management Libraries! 🚀

