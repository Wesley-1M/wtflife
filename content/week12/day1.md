# Week 12: Day 1 - Testing Fundamentals

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 11 Complete

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Understand testing pyramid
- ✅ Write unit tests with Jest
- ✅ Test React components
- ✅ Mock dependencies
- ✅ Achieve good test coverage

---

## 1️⃣ Testing Pyramid

### Test Types

```
         E2E Tests (few)
              /\
             /  \
            /    \
           /      \
          /--------\
         /  Integration Tests
        /            (some)
       /\
      /  \
     /    \
    /------\
   / Unit Tests (many)
  /                  \
 /____________________\
```

### Test Categories

```javascript
// Unit Tests - Test single functions
describe('Math', () => {
  test('adds numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});

// Integration Tests - Test components together
describe('Form', () => {
  test('submits form data', () => {
    // render component, interact, verify result
  });
});

// E2E Tests - Test entire workflows
describe('User signup', () => {
  test('complete signup flow', () => {
    // navigate, fill form, submit, verify in DB
  });
});
```

---

## 2️⃣ Jest Setup & Basics

### Installation

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npx jest --init
```

### Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

// jest.setup.js
import '@testing-library/jest-dom';
```

### Basic Tests

```javascript
// math.test.js
describe('Math functions', () => {
  test('adds numbers', () => {
    expect(2 + 3).toBe(5);
  });

  test('subtracts numbers', () => {
    expect(5 - 2).toBe(3);
  });

  test('multiplies numbers', () => {
    expect(4 * 5).toBe(20);
  });

  test('handles negative numbers', () => {
    expect(-5 + 3).toBe(-2);
  });
});
```

---

## 3️⃣ Testing React Components

### Component Tests

```jsx
// Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onClick handler', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Form Component Testing

```jsx
// LoginForm.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  test('submits form with email and password', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  test('shows error message', async () => {
    render(<LoginForm onSubmit={jest.fn()} error="Invalid credentials" />);
    
    const error = screen.getByText(/invalid credentials/i);
    expect(error).toBeInTheDocument();
  });
});
```

---

## 4️⃣ Mocking & Dependencies

### Mocking Functions

```javascript
// api.js
export async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// api.test.js
import { fetchUser } from './api';

jest.mock('./api');

test('fetches user', async () => {
  const mockUser = { id: 1, name: 'John' };
  fetchUser.mockResolvedValueOnce(mockUser);
  
  const user = await fetchUser(1);
  
  expect(user).toEqual(mockUser);
  expect(fetchUser).toHaveBeenCalledWith(1);
});
```

### Mocking HTTP Requests

```javascript
// user.service.test.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getUser } from './user.service';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, name: 'John' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches user', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('John');
});
```

### Mocking React Hooks

```jsx
// useUser.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from './useUser';

jest.mock('./api', () => ({
  fetchUser: jest.fn()
}));

test('loads user data', async () => {
  const { result } = renderHook(() => useUser(1));
  
  await waitFor(() => {
    expect(result.current.user).toBeDefined();
  });
});
```

---

## 5️⃣ Test Coverage

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Generate Coverage Report

```bash
# Run tests with coverage
npm test -- --coverage

# Output shows:
# Lines: 85.2%
# Statements: 85.2%
# Functions: 80.5%
# Branches: 75.3%
```

---

## 6️⃣ Testing Best Practices

### Good Test Patterns

```javascript
// ✅ Good - Clear, focused test
test('validates email format', () => {
  const isValid = validateEmail('test@example.com');
  expect(isValid).toBe(true);
});

// ❌ Bad - Tests too much
test('user registration', () => {
  // Tests email, password, validation, submission, etc.
});
```

### Test Organization

```javascript
describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('createUser', () => {
    test('creates user with valid data', () => {
      // test
    });

    test('throws error with invalid email', () => {
      // test
    });
  });

  describe('updateUser', () => {
    test('updates user properties', () => {
      // test
    });
  });
});
```

---

## 📝 Practice Exercises

### Exercise 1: Unit Tests
Test utility functions thoroughly

### Exercise 2: Component Tests
Test React components with Jest

### Exercise 3: Mocking
Mock API calls and dependencies

### Exercise 4: Coverage
Achieve 80% code coverage

---

## ✅ Summary

- **Unit tests** test individual functions
- **Jest** is the testing framework
- **React Testing Library** tests components
- **Mocking** isolates code under test
- **Coverage** measures test quality
- **Best practices** lead to maintainable tests

---

## 🔗 Next Steps

**Tomorrow (Day 2):** React Testing Library Advanced  
**Continue:** Master modern testing!

### 2. First Input Delay (FID)
- Time from user input to browser response
- Target: < 100ms
- Optimize: Reduce JavaScript, use Web Workers

### 3. Cumulative Layout Shift (CLS)
- Visual stability during load
- Target: < 0.1
- Optimize: Set image dimensions, avoid inserting content above

## Frontend Optimization

### Code Splitting

```javascript
// Before: All code in one bundle
import Dashboard from './Dashboard';
import Settings from './Settings';
import Analytics from './Analytics';

// After: Lazy load routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const Analytics = lazy(() => import('./Analytics'));

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### Image Optimization

```javascript
// Bad: Large unoptimized image
<img src="hero.jpg" alt="Hero" />

// Good: Multiple formats and sizes
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### Bundle Size Reduction

```javascript
// Before: 150KB bundle
import _ from 'lodash'; // 70KB
const doubled = _.map([1, 2, 3], x => x * 2);

// After: Tree-shaking reduces to 5KB
import map from 'lodash/map';
const doubled = map([1, 2, 3], x => x * 2);

// Best: Use native JS
const doubled = [1, 2, 3].map(x => x * 2);
```

### Memoization

```javascript
// Without memoization: Re-renders on every prop change
function UserCard({ user, onClick }) {
  return (
    <div onClick={onClick}>
      <h2>{user.name}</h2>
    </div>
  );
}

// With memoization: Only re-renders if props change
const UserCard = React.memo(({ user, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{user.name}</h2>
    </div>
  );
});

// useMemo: Memoize expensive calculations
function Dashboard({ userId }) {
  const expensiveData = useMemo(() => {
    return calculateComplexMetrics(userId);
  }, [userId]);

  return <Analytics data={expensiveData} />;
}
```

## Backend Optimization

### Database Query Optimization

```javascript
// N+1 Query Problem
async function getUsers() {
  const users = await db.query('SELECT * FROM users');
  
  // This queries DB for each user!
  for (let user of users) {
    user.posts = await db.query(
      'SELECT * FROM posts WHERE user_id = ?',
      [user.id]
    );
  }
  return users; // N+1 queries!
}

// Solution: Use JOIN
async function getUsers() {
  return db.query(`
    SELECT u.*, p.* FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
  `);
}

// Or use batch loading
async function getUsers() {
  const users = await db.query('SELECT * FROM users');
  const userIds = users.map(u => u.id);
  
  const posts = await db.query(
    'SELECT * FROM posts WHERE user_id IN (?)',
    [userIds]
  );
  
  const postsMap = new Map();
  for (let post of posts) {
    if (!postsMap.has(post.user_id)) {
      postsMap.set(post.user_id, []);
    }
    postsMap.get(post.user_id).push(post);
  }
  
  users.forEach(u => {
    u.posts = postsMap.get(u.id) || [];
  });
  
  return users;
}
```

### Caching

```javascript
// In-memory cache
class Cache {
  constructor(ttl = 3600) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + (this.ttl * 1000)
    });
  }
}

// Usage with Redis
const redis = require('redis');
const client = redis.createClient();

async function getCachedUser(userId) {
  const cached = await client.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  await client.setex(`user:${userId}`, 3600, JSON.stringify(user));
  
  return user;
}
```

## Performance Profiling

### React DevTools Profiler

```javascript
// Wrap components to profile
import { Profiler } from 'react';

function onRenderCallback(
  id,      // Component name
  phase,   // "mount" or "update"
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <Dashboard />
</Profiler>
```

### Lighthouse Metrics

```javascript
// Measure Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Performance Monitoring

```javascript
// Set up performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = [];
  }

  recordMetric(name, duration) {
    this.metrics.push({ name, duration, timestamp: Date.now() });
    
    if (duration > 1000) {
      console.warn(`${name} took ${duration}ms (slow!)`);
    }
  }

  async sendToAnalytics() {
    await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(this.metrics)
    });
  }
}

const monitor = new PerformanceMonitor();

async function fetchData() {
  const start = performance.now();
  const data = await api.get('/data');
  monitor.recordMetric('fetchData', performance.now() - start);
  return data;
}
```

## ✅ Checkpoint

- [ ] Know Core Web Vitals
- [ ] Can optimize frontend
- [ ] Know caching strategies
- [ ] Can profile applications
- [ ] Understand database optimization

**Next:** Security Best Practices! 🔒

