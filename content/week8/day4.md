# Week 8: Day 4 - Authentication & Security

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 8 Days 1-3

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Implement user authentication
- ✅ Work with JWT tokens
- ✅ Hash passwords securely
- ✅ Protect API routes
- ✅ Handle authorization

---

## 1️⃣ Password Hashing

### Why Hash Passwords?

```javascript
// ❌ Never store plain passwords!
const user = { email: 'john@example.com', password: 'secret123' };

// ✅ Always hash passwords
const bcrypt = require('bcrypt');

// Hash password
const hashedPassword = await bcrypt.hash('secret123', 10);
// "$2b$10$..." - impossible to reverse

// Store hashedPassword in database
const user = { email: 'john@example.com', password: hashedPassword };
```

### Using bcrypt

```bash
npm install bcrypt
```

```javascript
const bcrypt = require('bcrypt');

// Hash password on registration
async function registerUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.createUser({ email, password: hashedPassword });
}

// Compare password on login
async function loginUser(email, password) {
  const user = await db.getUser(email);
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}
```

---

## 2️⃣ JWT Authentication

### What is JWT?

```
JWT = JSON Web Token
Format: header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Decoded:
{
  header: { alg: 'HS256', typ: 'JWT' },
  payload: { sub: '1234567890', name: 'John Doe', iat: 1516239022 },
  signature: 'verified with secret key'
}
```

### Generate JWT

```bash
npm install jsonwebtoken
```

```javascript
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

// Create token
function createToken(user) {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    secret,
    { expiresIn: '24h' }
  );
  return token;
}

// Usage
const token = createToken(user);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verify JWT

```javascript
// Verify token
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded; // { id, email, iat, exp }
  } catch (error) {
    return null; // Invalid or expired
  }
}

// Check if token is expired
const decoded = jwt.decode(token);
if (decoded.exp * 1000 < Date.now()) {
  // Token expired
}
```

---

## 3️⃣ Authentication Middleware

### Protect Routes

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware to verify token
function authenticateToken(req, res, next) {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

---

## 4️⃣ Login & Registration

### User Registration

```javascript
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Check if exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    // Create token
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '24h' });
    
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### User Login

```javascript
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Create token
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '24h' });
    
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 5️⃣ Security Best Practices

### Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet()); // Adds security headers

// Results in:
// X-Frame-Options: DENY
// X-Content-Type-Options: nosniff
// Strict-Transport-Security: max-age=31536000
```

### Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Stricter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // 5 attempts per 15 minutes
});

app.post('/api/login', loginLimiter, (req, res) => {
  // ...
});
```

### Input Validation

```bash
npm install joi
```

```javascript
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

app.post('/api/register', (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Process validated data
});
```

---

## 📝 Practice Exercises

### Exercise 1: Password Hashing
Implement bcrypt hashing for passwords

### Exercise 2: JWT Tokens
Create and verify JWT tokens

### Exercise 3: Authentication
Build login/register endpoints

### Exercise 4: Protected Routes
Add middleware to protect API endpoints

---

## ✅ Summary

- **Hash passwords** with bcrypt
- **JWT tokens** for stateless auth
- **Middleware** protects routes
- **Validation** prevents attacks
- **Rate limiting** prevents abuse
- **HTTPS** encrypts data

---

## 🔗 Next Steps

**Tomorrow (Day 5):** Advanced Backend Patterns  
**Continue:** Secure your applications!
- Cypress/Playwright
- GitHub Actions
- Husky (pre-commit hooks)

## Examples

```javascript
// Unit test
test('Button renders with label', () => {
  render(<Button label="Click me" onClick={() => {}} />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// Integration test
test('Form submission works', async () => {
  render(<LoginForm />);
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('Submit'));
  await screen.findByText('Success');
});

// E2E test with Cypress
it('User can login', () => {
  cy.visit('/login');
  cy.get('input[type=email]').type('test@example.com');
  cy.get('button').click();
  cy.url().should('include', '/dashboard');
});
```

## ✅ Checkpoint

- [ ] Can write tests
- [ ] Know testing strategies
- [ ] Can set up CI/CD
- [ ] Know tools

**Next:** Week 8 Project! 🚀

