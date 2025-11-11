# Week 7: Day 1 - React Router Basics

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)

---

## Topics

- Setting up React Router
- Creating routes
- Navigation with Link and Navigate
- Route parameters
- Nested routes
- Layout patterns

## Key Concepts

```javascript
BrowserRouter - Router provider
Routes - Route container
Route - Individual route
Link - Navigation link
useNavigate - Programmatic navigation
useParams - Get route parameters
useLocation - Get current location
```

## Examples

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserDetail() {
  const { id } = useParams();
  return <h1>User {id}</h1>;
}
```

## ✅ Checkpoint

- [ ] Can set up React Router
- [ ] Can create routes
- [ ] Can use Link for navigation
- [ ] Can get route parameters

**Next:** Advanced Routing! 🚀

