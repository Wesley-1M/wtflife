# Week 12: Day 2 - Security Best Practices

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Understand common security vulnerabilities
- Know OWASP Top 10
- Be able to implement security measures
- Understand compliance requirements

## Topics

- SQL injection prevention
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Authentication & authorization
- Data encryption
- Dependency vulnerabilities

## OWASP Top 10 (2023)

### 1. Broken Access Control
```javascript
// ❌ Bad: No authorization check
app.delete('/api/users/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

// ✅ Good: Check if user is admin
app.delete('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  User.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});
```

### 2. Cryptographic Failures
```javascript
// ❌ Bad: Storing plain text passwords
users.push({ email, password });

// ✅ Good: Hash passwords with bcrypt
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

