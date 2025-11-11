# Week 7: Day 2 - Advanced Routing

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐

---

## Topics

- Nested routes
- Dynamic routing
- Query parameters
- Redirects
- Protected routes
- Route guards
- 404 handling

## Examples

```jsx
// Protected route
function ProtectedRoute({ children, isAuth }) {
  return isAuth ? children : <Navigate to="/login" />;
}

// Nested routes
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} />
</Route>

// Query parameters
const navigate = useNavigate();
navigate(`/search?q=${query}`);

const [params] = useSearchParams();
const query = params.get('q');
```

## ✅ Checkpoint

- [ ] Understand nested routes
- [ ] Can create protected routes
- [ ] Know query parameters

**Next:** Forms & Validation! 🚀

