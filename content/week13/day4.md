# Week 13: Day 4 - Final Capstone Showcase

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** All 12 Weeks Complete

---

## 📚 Learning Objectives

By the end of this capstone, you'll have:
- ✅ Completed a full-stack application
- ✅ Demonstrated all learned skills
- ✅ Created production-quality code
- ✅ Built a compelling portfolio project
- ✅ Documented everything professionally
- ✅ Prepared for your career

---

## 1️⃣ Capstone Project Requirements

### Project Scope

```
Capstone Project Checklist:

Architecture:
- [ ] Full-stack application
- [ ] React/Next.js frontend
- [ ] Node.js/Express backend
- [ ] PostgreSQL/MongoDB database
- [ ] RESTful API (20+ endpoints)
- [ ] Real-time features

Features:
- [ ] User authentication/authorization
- [ ] CRUD operations
- [ ] Search/filtering
- [ ] File uploads
- [ ] Error handling
- [ ] Loading states

Performance:
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 3s
- [ ] Core Web Vitals good
- [ ] Optimized images
- [ ] Lazy loading

Quality:
- [ ] 80%+ test coverage
- [ ] ESLint passing
- [ ] TypeScript strict mode
- [ ] Zero console errors
- [ ] Accessibility (WCAG AA)

Deployment:
- [ ] Live on production URL
- [ ] CI/CD pipeline configured
- [ ] Monitoring/logging active
- [ ] Backup strategy
- [ ] Disaster recovery plan
```

---

## 2️⃣ Exemplary Project Architecture

### Complete Application Structure

```
capstone-app/
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ProjectCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TeamMember.tsx
│   │   └── NavBar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProjects.ts
│   │   └── useTasks.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── projects.ts
│   │   │   ├── tasks.ts
│   │   │   └── team.ts
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.ts
│   ├── tests/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
└── README.md
```

---

## 3️⃣ Production-Ready Code Examples

### Type-Safe API Integration

```typescript
// lib/api.ts
import axios from 'axios'

interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  ownerId: string
}

class ApiClient {
  private client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  })

  async getProjects(): Promise<Project[]> {
    const response = await this.client.get<ApiResponse<Project[]>>(
      '/projects'
    )
    return response.data.data
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const response = await this.client.post<ApiResponse<Project>>(
      '/projects',
      data
    )
    return response.data.data
  }

  async updateProject(
    id: string,
    data: Partial<Project>
  ): Promise<Project> {
    const response = await this.client.patch<ApiResponse<Project>>(
      `/projects/${id}`,
      data
    )
    return response.data.data
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`)
  }
}

export const api = new ApiClient()
```

### Secure Authentication

```typescript
// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  email: string
  role: 'user' | 'admin'
}

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-role', payload.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
```

---

## 4️⃣ Deployment Strategy

### Docker Setup

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY package.json .

EXPOSE 3000

CMD ["npm", "start"]
```

### GitHub Actions CI/CD

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
      
      - uses: codecov/codecov-action@v3

  deploy:
    needs: build-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 5️⃣ Documentation & Presentation

### Professional README

```markdown
# Project Name

[Project Description]

## Features

- Real-time collaboration
- Advanced search
- Team management
- Performance monitoring

## Tech Stack

**Frontend:**
- Next.js 14
- TypeScript
- TailwindCSS
- Zustand

**Backend:**
- Node.js
- Express
- PostgreSQL
- Prisma ORM

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

\`\`\`bash
git clone [repo]
cd capstone-app
npm install
\`\`\`

### Environment Variables

Create `.env.local`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
\`\`\`

### Running

\`\`\`bash
npm run dev
\`\`\`

## Deployment

Deployed on Vercel: [URL]

## Testing

\`\`\`bash
npm test
npm run e2e
\`\`\`

## Contributing

[Contribution guidelines]

## License

MIT
```

### Presentation Talking Points

```
Capstone Presentation Structure (15 minutes):

1. Problem & Solution (2 min)
   - What problem does this solve?
   - How is it innovative?

2. Features Demo (5 min)
   - Live walkthrough
   - Key features
   - User workflow

3. Technical Architecture (4 min)
   - Frontend tech choices
   - Backend design
   - Database schema
   - Why these choices?

4. Lessons Learned (2 min)
   - What worked well
   - What was challenging
   - Future improvements

5. Questions (2 min)
   - Open for questions
   - Discuss code/decisions

Key Points to Emphasize:
- Scale and performance
- Code quality and testing
- Attention to user experience
- Production-ready practices
```

---

## 📝 Submission Checklist

### Code Quality
- [ ] All tests passing (80%+ coverage)
- [ ] No console errors or warnings
- [ ] ESLint/Prettier configured
- [ ] TypeScript strict mode
- [ ] WCAG AA accessibility

### Features
- [ ] Authentication working
- [ ] All CRUD operations working
- [ ] Error handling comprehensive
- [ ] Loading states implemented
- [ ] Responsive design

### Documentation
- [ ] Professional README
- [ ] API documentation
- [ ] Setup instructions
- [ ] Deployment guide
- [ ] Architecture decisions documented

### Deployment
- [ ] Live on production URL
- [ ] CI/CD pipeline passing
- [ ] Monitoring configured
- [ ] Error tracking active
- [ ] Performance optimized

### Presentation
- [ ] 15-minute presentation prepared
- [ ] Demo ready
- [ ] Code review ready
- [ ] Q&A prepared
- [ ] Portfolio updated

---

## ✅ Summary

- **Full-stack application** demonstrates complete mastery
- **Production-quality code** shows professionalism
- **Comprehensive testing** ensures reliability
- **Professional documentation** aids collaboration
- **Successful deployment** proves real-world capability
- **Strong portfolio project** opens career opportunities
- **Clear presentation** communicates your value
- **Attention to detail** differentiates your work

---

## 🔗 Next Steps

**Tomorrow (Day 5):** Career Planning & Next Steps  
**Congratulations:** You've completed the full course!
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

