# Week 5: React Basics - Building UIs with Components

**Duration:** 5 days + 1 project (40 hours total)  
**Difficulty:** ⭐⭐⭐⭐⭐ Expert  
**Prerequisites:** Weeks 1-4 (Full JavaScript mastery)

---

## Week Overview

React is a **JavaScript library** for building user interfaces with **components**. Instead of manipulating the DOM directly, you describe what the UI should look like, and React handles updates.

---

## Day 1: What is React?

- Why React? (Why not just vanilla JavaScript?)
- JSX (JavaScript + HTML hybrid syntax)
- Components (reusable UI pieces)
- Virtual DOM (How React updates efficiently)
- Setup (Create React App, Node.js, npm)

**Key Concept:** React = UI = Function(State)

---

## Day 2: Components & JSX

- Functional components
- JSX syntax and rules
- Props (passing data to components)
- Component composition (components within components)
- Conditional rendering

```jsx
function Welcome({name}) {
  return <h1>Hello, {name}!</h1>;
}

export default Welcome;
```

---

## Day 3: State with Hooks

- useState hook (manage component state)
- Handling events
- Re-rendering when state changes
- Lists and keys

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## Day 4: Effects & Side Effects

- useEffect hook
- Fetching data in React
- Dependency arrays
- Cleanup functions

```jsx
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return <div>{users.map(u => <div key={u.id}>{u.name}</div>)}</div>;
}
```

---

## Day 5: Component Patterns

- Custom hooks
- Context API (global state)
- Error boundaries
- Performance optimization

---

## Project: Build a React Todo App

Rebuild Week 3 todo app using React instead of vanilla JavaScript!

Features:
- Add/remove/complete todos
- Filter by status
- Persist with localStorage
- Professional UI with React

**Key Learning:** How much easier React makes complex UIs!

---

---

# Week 6: State Management & Advanced Hooks

**Duration:** 5 days + 1 project (40 hours total)  
**Difficulty:** ⭐⭐⭐⭐⭐ Expert

---

## Week Overview

Master state management techniques to handle complex applications.

---

## Day 1: Advanced useState

- Multiple state variables
- State updates with objects
- Complex state logic
- useReducer hook (advanced state management)

---

## Day 2: useContext API

- Global state without prop drilling
- Creating and consuming context
- Multiple contexts

```jsx
const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{user, setUser}}>
      <Profile />
    </UserContext.Provider>
  );
}

function Profile() {
  const {user} = useContext(UserContext);
  return <h1>{user.name}</h1>;
}
```

---

## Day 3: Custom Hooks

Creating reusable logic hooks:
- useFetch (fetch data)
- useForm (form state)
- useLocalStorage (persist state)

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError);
  }, [url]);

  return {data, error};
}
```

---

## Day 4: Performance Optimization

- React.memo (prevent unnecessary re-renders)
- useMemo (memoize values)
- useCallback (memoize functions)
- Code splitting and lazy loading

---

## Day 5: Form Handling

- Controlled components
- Form libraries (React Hook Form)
- Validation
- Handling complex forms

---

## Project: Build a Crypto Dashboard

Fetch cryptocurrency data from API and display:
- Current prices
- Price charts
- Watchlist
- Real-time updates

---

---

# Week 7: React Router & Routing

**Duration:** 5 days + 1 project (40 hours total)  
**Difficulty:** ⭐⭐⭐⭐ Advanced

---

## Week Overview

Build multi-page applications with React Router.

---

## Day 1: React Router Basics

- Setting up React Router
- Routes and Links
- Navigation

```jsx
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Day 2: Route Parameters

- URL parameters (:id)
- Query parameters (?page=1)
- useParams hook
- useSearchParams hook

---

## Day 3: Navigation & Redirects

- useNavigate hook
- Conditional redirects
- Authentication redirects

---

## Day 4: Nested Routes

- Child routes
- Outlets
- Route hierarchies

---

## Day 5: Advanced Routing

- Lazy loading routes
- Route guards
- Error pages

---

## Project: Build a Blog Platform

Multi-page blog with:
- Home page (list all posts)
- Post detail pages
- Author pages
- Search functionality
- Category filtering

---

---

# Week 8: Advanced React & TypeScript

**Duration:** 5 days + 1 project (40 hours total)  
**Difficulty:** ⭐⭐⭐⭐⭐ Expert

---

## Week Overview

Advanced React patterns and type safety with TypeScript.

---

## Day 1: TypeScript Basics

- Types and interfaces
- Function types
- Component types

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

function UserCard({user}: {user: User}) {
  return <div>{user.name}</div>;
}
```

---

## Day 2: TypeScript with React

- Typing props
- Typing state
- Typing hooks
- Generic types

---

## Day 3: Advanced Patterns

- Render props
- Higher-order components (HOCs)
- Compound components

---

## Day 4: Testing React

- Jest and React Testing Library
- Testing components
- Mocking APIs
- Integration tests

```javascript
test('renders greeting', () => {
  render(<Greeting name="Sarah" />);
  expect(screen.getByText('Hello, Sarah')).toBeInTheDocument();
});
```

---

## Day 5: State Management Libraries

- Redux basics
- Redux Toolkit
- Zustand (simpler alternative)
- When to use each

---

## Project: Full-Featured React App

Combine everything:
- TypeScript
- Multiple pages with routing
- Complex state management
- Testing
- Professional code structure

---

---

# Weeks 9-11: Full-Stack Development

---

## Week 9: Backend Fundamentals with Node.js

**Duration:** 5 days + 1 project (40 hours)

---

### Day 1: Node.js & Express

- What is Node.js?
- npm and packages
- Express.js basics
- Server setup
- Routing

```javascript
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json([{id: 1, name: 'Sarah'}]);
});

app.listen(3000);
```

---

### Day 2: Databases & SQL

- Databases (MongoDB, PostgreSQL)
- SQL basics
- Models and schemas
- CRUD operations

---

### Day 3: Authentication

- User registration/login
- Password hashing (bcrypt)
- JWT tokens
- Protected routes

---

### Day 4: API Development

- RESTful APIs
- Request validation
- Error handling
- API documentation

---

### Day 5: Backend Best Practices

- Environment variables
- Middleware
- Logging
- Security

---

### Project: Build a Backend API

Create a complete REST API:
- User management
- Authentication
- CRUD operations
- Error handling
- Documentation

---

## Week 10: Connecting Frontend & Backend

**Duration:** 5 days + 1 project (40 hours)

---

### Day 1: Frontend-Backend Integration

- Consuming APIs
- Error handling
- Loading states
- Token management

---

### Day 2: Deployment

- Hosting (Vercel, Heroku, Netlify)
- Environment variables
- CI/CD basics

---

### Day 3: Database Integration

- Connecting frontend to database
- Real-time data
- Caching strategies

---

### Day 4: Performance

- Optimization techniques
- Caching
- Lazy loading
- Monitoring

---

### Day 5: Scaling

- Handling many users
- Database optimization
- Load balancing concepts

---

### Project: Full-Stack Todo App

Complete application:
- React frontend with routing
- Node.js/Express backend
- Database integration
- User authentication
- Deployment

---

## Week 11: Advanced Topics & Job Readiness

**Duration:** 5 days (40 hours)

---

### Day 1: Clean Code

- Code organization
- Design patterns
- Best practices

---

### Day 2: Advanced Git

- Branching strategies
- Collaboration
- Pull requests
- Git workflows

---

### Day 3: Testing & QA

- Unit testing
- Integration testing
- End-to-end testing
- Test-driven development

---

### Day 4: System Design

- Scalable architecture
- Microservices intro
- Design patterns

---

### Day 5: Interview Prep

- Algorithm practice
- System design questions
- Behavioral questions
- Portfolio review

---

### Project: Capstone Project

Choose from:
- Social media platform
- Project management app
- E-commerce site
- Content management system

Complete with:
- Frontend (React)
- Backend (Node.js)
- Database
- Authentication
- Deployment
- Professional code quality

---

---

## Summary Statistics

**Total Course:**
- **13 Weeks** of instruction
- **78 Lessons** (6 per week)
- **13 Projects** (1 per week)
- **400+ hours** of content and practice

**Skills Gained:**
- ✅ Core JavaScript (Week 1-2)
- ✅ DOM & Events (Week 3)
- ✅ Async Programming (Week 4)
- ✅ Modern Frontend (Week 5-8)
- ✅ Full-Stack Development (Week 9-11)
- ✅ Professional Development Practices

**Job Ready:** By Week 11, you'll have:
- Portfolio of 13 projects
- Full-stack expertise
- Professional code quality
- Interview-ready skills

