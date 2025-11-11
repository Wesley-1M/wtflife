# Week 13: Day 4 - Testing & Quality Assurance

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Write comprehensive tests
- Achieve good code coverage
- Test API endpoints
- Test React components
- Handle edge cases

## Backend Testing

### Unit Tests (Jest)

```javascript
// tests/models/user.test.js
const User = require('../../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Create user with valid data', async () => {
    const user = await User.create({
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedpassword'
    });

    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
  });

  test('Duplicate email rejected', async () => {
    await User.create({
      email: 'test@example.com',
      username: 'user1',
      password: 'password'
    });

    expect(async () => {
      await User.create({
        email: 'test@example.com',
        username: 'user2',
        password: 'password'
      });
    }).rejects.toThrow();
  });

  test('Password must be hashed', async () => {
    const plainPassword = 'mypassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword
    });

    expect(user.password).not.toBe(plainPassword);
  });
});
```

### API Tests (Supertest)

```javascript
// tests/routes/auth.test.js
const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user.model');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    test('Register with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('test@example.com');
    });

    test('Register with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          username: 'testuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
    });

    test('Register with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'pass'
        });

      expect(res.statusCode).toBe(400);
    });

    test('Duplicate email rejected', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'user1',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'user2',
          password: 'password123'
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123'
        });
    });

    test('Login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('Login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });

    test('Login with nonexistent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
```

### Integration Tests

```javascript
// tests/integration/post.integration.test.js
const request = require('supertest');
const app = require('../../src/index');
const User = require('../../src/models/user.model');
const Post = require('../../src/models/post.model');

describe('Post Integration Tests', () => {
  let token, userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    // Register user
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      });

    token = res.body.token;
    userId = res.body.user.id;
  });

  test('Complete post lifecycle', async () => {
    // Create post
    const createRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post'
      });

    expect(createRes.statusCode).toBe(201);
    const postId = createRes.body.id;

    // Read post
    const getRes = await request(app)
      .get(`/api/posts/${postId}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.title).toBe('Test Post');

    // Update post
    const updateRes = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Post',
        content: 'Updated content'
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.title).toBe('Updated Post');

    // Delete post
    const deleteRes = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);

    // Verify deleted
    const finalRes = await request(app)
      .get(`/api/posts/${postId}`);

    expect(finalRes.statusCode).toBe(404);
  });
});
```

## Frontend Testing

### Component Tests (React Testing Library)

```javascript
// tests/components/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/components/Auth/Login';
import * as api from '../../src/services/api';

jest.mock('../../src/services/api');

test('Login form submission', async () => {
  api.post.mockResolvedValueOnce({
    data: { token: 'test-token', user: { id: 1 } }
  });

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
  });
});

test('Display error on failed login', async () => {
  api.post.mockRejectedValueOnce({
    response: { data: { error: 'Invalid credentials' } }
  });

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  const submitButton = screen.getByRole('button', { name: /login/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

### Hook Tests

```javascript
// tests/hooks/useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../src/store/authStore';
import * as api from '../../src/services/api';

jest.mock('../../src/services/api');

test('Login hook updates state', async () => {
  api.post.mockResolvedValueOnce({
    data: { token: 'test-token', user: { id: 1, email: 'test@example.com' } }
  });

  const { result } = renderHook(() => useAuthStore());

  await act(async () => {
    await result.current.login('test@example.com', 'password123');
  });

  expect(result.current.token).toBe('test-token');
  expect(result.current.user.email).toBe('test@example.com');
});
```

### E2E Tests (Cypress)

```javascript
// tests/e2e/auth.cy.js
describe('Authentication Flow', () => {
  it('Should register and login', () => {
    // Visit registration page
    cy.visit('http://localhost:3000/register');

    // Fill registration form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');

    // Submit
    cy.get('button[type="submit"]').click();

    // Should be redirected to dashboard
    cy.url().should('include', '/dashboard');

    // Logout
    cy.get('button[name="logout"]').click();

    // Should be redirected to login
    cy.url().should('include', '/login');

    // Login
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Should be back at dashboard
    cy.url().should('include', '/dashboard');
  });
});
```

## Code Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Expected output:
# ======= Coverage summary =======
# Statements   : 85% ( 200/235 )
# Branches     : 80% ( 150/188 )
# Functions    : 88% ( 100/114 )
# Lines        : 85% ( 180/212 )
```

## Test Running Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:all": "npm test && npm run test:e2e"
  }
}
```

## ✅ Checkpoint

- [ ] Unit tests (70%+ coverage)
- [ ] API tests all passing
- [ ] Component tests passing
- [ ] E2E tests passing
- [ ] No errors in console
- [ ] Performance acceptable
- [ ] Accessibility checked

**Next:** Deployment! 🚀

