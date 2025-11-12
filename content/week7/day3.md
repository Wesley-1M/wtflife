# Week 7: Day 3 - Testing Before Deploy

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 7 Days 1-2

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Write unit tests
- ✅ Test components (React Testing Library)
- ✅ Test API endpoints
- ✅ Setup test suites
- ✅ Achieve code coverage

---

## 1️⃣ Introduction to Testing

### Why Test?

```javascript
// ❌ Without tests - risk!
function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total;
}
// Who knows if this works for edge cases?

// ✅ With tests - confidence!
describe('calculateTotal', () => {
  test('should sum price * quantity', () => {
    const items = [{ price: 10, quantity: 2 }];
    expect(calculateTotal(items)).toBe(20);
  });
  
  test('should handle multiple items', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 }
    ];
    expect(calculateTotal(items)).toBe(35);
  });
  
  test('should handle empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

### Types of Tests

```
Unit Tests (functions, components)
├─ Test single function
├─ Fast to run
├─ Many per project
└─ 70% of tests

Integration Tests (multiple units)
├─ Test multiple parts together
├─ Slower than unit tests
├─ 20% of tests
└─ Catch real-world issues

End-to-End Tests (full user flows)
├─ Test entire app
├─ Slowest
├─ 10% of tests
└─ Verify user workflows
```

---

## 2️⃣ Jest Setup & Basics

### Install Jest

```bash
npm install --save-dev jest @babel/preset-env babel-jest
```

### Configure Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ]
};
```

### First Test

```javascript
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require('./sum');

describe('sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  
  test('adds -1 + 1 to equal 0', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 3️⃣ Testing Functions & Logic

### Basic Function Tests

```javascript
// utils.js
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

export function calculateDiscount(price, percent) {
  return price * (1 - percent / 100);
}

// utils.test.js
import { isValidEmail, formatPrice, calculateDiscount } from './utils';

describe('Utility Functions', () => {
  describe('isValidEmail', () => {
    test('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });
    
    test('should reject invalid email', () => {
      expect(isValidEmail('invalid.email')).toBe(false);
    });
    
    test('should reject empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });
  
  describe('formatPrice', () => {
    test('should format price with dollar sign', () => {
      expect(formatPrice(10)).toBe('$10.00');
    });
    
    test('should handle decimals', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
    });
  });
  
  describe('calculateDiscount', () => {
    test('should calculate 10% discount', () => {
      expect(calculateDiscount(100, 10)).toBe(90);
    });
    
    test('should handle 0% discount', () => {
      expect(calculateDiscount(100, 0)).toBe(100);
    });
  });
});
```

### Testing Async Functions

```javascript
// api.js
export async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// api.test.js
import { fetchUser } from './api';

describe('API Functions', () => {
  test('should fetch user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'John' })
      })
    );
    
    const user = await fetchUser(1);
    expect(user.name).toBe('John');
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });
});
```

---

## 4️⃣ Testing React Components

### Setup React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Simple Component Test

```jsx
// Button.jsx
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// Button.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
  test('should render with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('should call onClick handler', async () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    const button = screen.getByText('Click me');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Component State

```jsx
// Counter.jsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

// Counter.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter Component', () => {
  test('should start at 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
  
  test('should increment on button click', async () => {
    render(<Counter />);
    const button = screen.getByText('Increment');
    
    await userEvent.click(button);
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    
    await userEvent.click(button);
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });
  
  test('should decrement on button click', async () => {
    render(<Counter />);
    const button = screen.getByText('Decrement');
    
    await userEvent.click(button);
    expect(screen.getByTestId('count')).toHaveTextContent('-1');
  });
});
```

### Testing with API Calls

```jsx
// UserList.jsx
import { useState, useEffect } from 'react';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => setError(err.message));
  }, []);
  
  if (error) return <div>Error: {error}</div>;
  if (!users.length) return <div>Loading...</div>;
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// UserList.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from './UserList';

describe('UserList Component', () => {
  test('should display users', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ])
      })
    );
    
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });
});
```

---

## 5️⃣ Testing Backend/API

### Express Endpoint Tests

```bash
npm install --save-dev supertest
```

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/api/users/:id', (req, res) => {
  const user = { id: req.params.id, name: 'John' };
  res.json(user);
});

module.exports = app;

// app.test.js
const request = require('supertest');
const app = require('./app');

describe('GET /api/users/:id', () => {
  test('should return user', async () => {
    const response = await request(app)
      .get('/api/users/1')
      .expect(200);
    
    expect(response.body).toEqual({
      id: '1',
      name: 'John'
    });
  });
  
  test('should return 404 for invalid user', async () => {
    await request(app)
      .get('/api/users/invalid')
      .expect(404);
  });
});
```

---

## 6️⃣ Code Coverage

### Generate Coverage Report

```bash
npm run test:coverage
```

### Coverage Thresholds

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Understanding Coverage Metrics

```
Lines: % of code lines executed
Statements: % of statements executed
Functions: % of functions called
Branches: % of if/else branches tested

Typical Goal: 80%+ coverage
Critical Code: 95%+ coverage
```

---

## 📝 Practice Exercises

### Exercise 1: Write Unit Tests
Create tests for utility functions (validation, formatting, calculations)

### Exercise 2: Test Component
Write tests for React component with state and user interactions

### Exercise 3: API Testing
Write tests for backend endpoint

### Exercise 4: Coverage
Achieve 80%+ code coverage for a module

---

## ✅ Summary

- **Unit tests** validate individual functions
- **Component tests** verify React component behavior
- **API tests** ensure endpoints work correctly
- **Code coverage** tracks untested code
- **Mock external calls** (API, database)
- **Test edge cases** for robustness

---

## 🔗 Next Steps

**Tomorrow (Day 4):** Deployment Platforms  
**Continue Testing:** Always test before deploying!

