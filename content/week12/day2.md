# Week 12: Day 2 - React Testing Library Advanced

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Week 12 Day 1

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Use React Testing Library best practices
- ✅ Test complex interactions
- ✅ Work with async operations
- ✅ Test custom hooks
- ✅ Avoid testing implementation details

---

## 1️⃣ React Testing Library Philosophy

### User-Centric Testing

```javascript
// ❌ Bad - Tests implementation
test('calls setState', () => {
  const { rerender } = render(<App />);
  // rerender tests internal state
});

// ✅ Good - Tests user behavior
test('displays welcome message', () => {
  render(<App />);
  const message = screen.getByText(/welcome/i);
  expect(message).toBeInTheDocument();
});
```

### Query Priority

```javascript
// 1. Accessible (best)
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);

// 2. Semantic
screen.getByPlaceholderText(/enter name/i);
screen.getByText(/welcome/i);

// 3. Test IDs (last resort)
screen.getByTestId('user-card');
```

---

## 2️⃣ Advanced Component Testing

### Async Operations

```jsx
// UserProfile.test.js
test('loads and displays user', async () => {
  render(<UserProfile userId="1" />);
  
  // Wait for element to appear
  const name = await screen.findByText('John Doe');
  expect(name).toBeInTheDocument();
});

// With waitFor
test('handles loading state', async () => {
  render(<UserProfile userId="1" />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### User Interactions

```jsx
test('opens and closes modal', async () => {
  const user = userEvent.setup();
  render(<Modal />);
  
  const button = screen.getByRole('button', { name: /open/i });
  await user.click(button);
  
  expect(screen.getByText('Modal content')).toBeInTheDocument();
  
  const closeButton = screen.getByRole('button', { name: /close/i });
  await user.click(closeButton);
  
  expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
});

// Type into input
test('searches users', async () => {
  const user = userEvent.setup();
  render(<UserSearch />);
  
  const input = screen.getByRole('textbox');
  await user.type(input, 'john');
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Complex Interactions

```jsx
test('completes form submission', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();
  render(<SignupForm onSubmit={handleSubmit} />);
  
  // Fill form fields
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'Password123!');
  
  // Check checkbox
  await user.click(screen.getByRole('checkbox', { name: /agree/i }));
  
  // Submit form
  await user.click(screen.getByRole('button', { name: /signup/i }));
  
  // Verify submission
  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'Password123!',
    agree: true
  });
});
```

---

## 3️⃣ Testing Custom Hooks

### Hook Testing Setup

```jsx
// useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Hook with Dependencies

```jsx
test('resets counter', () => {
  const { result, rerender } = renderHook(
    ({ initialValue }) => useCounter(initialValue),
    { initialProps: { initialValue: 0 } }
  );
  
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
  
  // Change initial value
  rerender({ initialValue: 10 });
  expect(result.current.count).toBe(10);
});
```

---

## 4️⃣ Testing Context & Providers

### Context Wrapper

```jsx
// UserContext.test.js
const UserProvider = ({ children }) => (
  <UserContext.Provider value={{ user: { id: 1 } }}>
    {children}
  </UserContext.Provider>
);

test('accesses user from context', () => {
  render(<UserProfile />, { wrapper: UserProvider });
  expect(screen.getByText('User: 1')).toBeInTheDocument();
});
```

### Custom Render with Provider

```jsx
// test-utils.js
import { render } from '@testing-library/react';
import { UserProvider } from './UserContext';

const AllTheProviders = ({ children }) => (
  <UserProvider>
    {children}
  </UserProvider>
);

export const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Usage
test('component with context', () => {
  renderWithProviders(<UserProfile />);
  // Now component has access to context
});
```

---

## 5️⃣ Accessibility Testing

### Testing Accessibility

```jsx
test('has proper ARIA labels', () => {
  render(<LoginForm />);
  
  expect(screen.getByLabelText(/email/i)).toHaveAttribute('required');
  expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
});

test('keyboard navigation works', async () => {
  const user = userEvent.setup();
  render(<Menu />);
  
  // Tab through items
  await user.tab();
  expect(screen.getByText('Item 1')).toHaveFocus();
  
  await user.tab();
  expect(screen.getByText('Item 2')).toHaveFocus();
});
```

### Accessibility Testing Library

```bash
npm install --save-dev @testing-library/jest-axe
```

```jsx
import { axe, toHaveNoViolations } from 'jest-axe';

test('has no accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 📝 Practice Exercises

### Exercise 1: Async Testing
Test component with data fetching

### Exercise 2: User Interactions
Test complex form interactions

### Exercise 3: Custom Hooks
Test custom React hooks

### Exercise 4: Accessibility
Test component accessibility

---

## ✅ Summary

- **User-centric** testing is key
- **Queries** follow accessibility priority
- **userEvent** simulates real user actions
- **Async** operations need waitFor/findBy
- **Custom hooks** use renderHook
- **Providers** wrap components for context

---

## 🔗 Next Steps

**Tomorrow (Day 3):** E2E Testing with Playwright  
**Continue:** Master all testing levels!
const hashedPassword = await bcrypt.hash(password, 10);
users.push({ email, password: hashedPassword });

// Verify
const isValid = await bcrypt.compare(password, user.password);
```

### 3. Injection
```javascript
// ❌ Bad: SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good: Parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
const users = await db.query(query, [email]);

// ❌ Bad: Command Injection
const output = exec(`ls ${directory}`);

// ✅ Good: Use safe alternatives
const files = fs.readdirSync(directory);
```

### 4. Insecure Design
```javascript
// ❌ Bad: No rate limiting
app.post('/api/login', (req, res) => {
  // Vulnerable to brute force
});

// ✅ Good: Implement rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // 5 requests per 15 minutes
});

app.post('/api/login', limiter, (req, res) => {
  // Protected
});
```

### 5. Security Misconfiguration
```javascript
// ✅ Use security headers
const helmet = require('helmet');
app.use(helmet());

// ✅ Secure CORS
app.use(cors({
  origin: 'https://trustedomain.com',
  credentials: true,
  optionsSuccessStatus: 200
}));

// ✅ Enforce HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 6. Vulnerable Components
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0"
  }
}
```

```
// Check for vulnerabilities
npm audit

// Update packages
npm update

// Fix vulnerabilities
npm audit fix
```

## XSS (Cross-Site Scripting) Prevention

```javascript
// ❌ Bad: Direct HTML injection
function DisplayComment({ comment }) {
  return <div dangerousSetInnerHTML={{ __html: comment }} />;
}

// ✅ Good: React automatically escapes
function DisplayComment({ comment }) {
  return <div>{comment}</div>;
}

// ✅ Good: Sanitize if needed
import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(userInput);

// ❌ Bad: In backend
res.send(`<h1>${userInput}</h1>`);

// ✅ Good: Escape output
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};
```

## CSRF (Cross-Site Request Forgery) Prevention

```javascript
// ✅ Use CSRF tokens
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.send(`
    <form action="/process" method="POST">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <input type="submit">
    </form>
  `);
});

app.post('/process', csrfProtection, (req, res) => {
  res.send('Form processed');
});

// ✅ Validate origin
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && origin !== process.env.ALLOWED_ORIGIN) {
    return res.status(403).send('Forbidden');
  }
  next();
});
```

## Authentication & Authorization

```javascript
// JWT Authentication
const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};

app.delete('/api/users/:id', 
  authenticateToken, 
  authorize('admin'), 
  (req, res) => {
    // Only admins can delete
  }
);
```

## Data Encryption

```javascript
// Encryption for sensitive data
const crypto = require('crypto');

function encryptData(data, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

function decryptData(data, key) {
  const parts = data.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  
  let decrypted = decipher.update(parts[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

## Secrets Management

```javascript
// ✅ Use environment variables
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// ✅ Use secrets management service
const AWS = require('aws-sdk');
const client = new AWS.SecretsManager();

async function getSecret(secretName) {
  try {
    const data = await client.getSecretValue({ SecretId: secretName }).promise();
    return JSON.parse(data.SecretString);
  } catch (err) {
    throw err;
  }
}

// ✅ Don't commit secrets
// .gitignore: .env, *.key, secrets.json
```

## Security Headers

```javascript
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' trusted.com");
  
  // Strict Transport Security
  res.setHeader('Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains');
  
  next();
});
```

## ✅ Checkpoint

- [ ] Know OWASP Top 10
- [ ] Can prevent SQL injection
- [ ] Can prevent XSS
- [ ] Can implement authentication
- [ ] Know secrets management

**Next:** Cloud Architecture! ☁️

