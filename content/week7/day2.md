# Week 7: Day 2 - Environment Configuration & Variables

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 7 Day 1

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Manage environment variables
- ✅ Configure different environments (dev, staging, production)
- ✅ Handle secrets securely
- ✅ Use .env files
- ✅ Conditional configuration

---

## 1️⃣ Environment Variables Basics

### Why Environment Variables?

```javascript
// ❌ BAD - hardcoded values
const API_URL = 'https://api.example.com';
const SECRET_KEY = 'secret123';
const DATABASE_URL = 'mongodb://user:pass@host:port/db';

// Exposed secrets if committed to GitHub!
// Can't change without code changes
// Different URLs for dev/prod

// ✅ GOOD - use environment variables
const API_URL = process.env.REACT_APP_API_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

// Can be changed via .env files or CI/CD
// Different values for each environment
// Secrets never exposed in code
```

### .env File Format

Create `.env` in project root:

```bash
# Frontend (.env)
REACT_APP_API_URL=https://api.example.com
REACT_APP_AUTH_DOMAIN=auth.example.com
REACT_APP_DEBUG=false

# Backend (.env)
DATABASE_URL=mongodb://localhost:27017/myapp
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret
NODE_ENV=development
PORT=3000
```

### Accessing Variables

```javascript
// React
const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl); // https://api.example.com

// Node.js
const dbUrl = process.env.DATABASE_URL;
const port = process.env.PORT || 3000;

// Check if production
if (process.env.NODE_ENV === 'production') {
  // Production-only code
}
```

---

## 2️⃣ Multiple Environments

### Create .env Files for Each Environment

```bash
# .env (local development)
REACT_APP_API_URL=http://localhost:3000
NODE_ENV=development
DEBUG=true

# .env.staging
REACT_APP_API_URL=https://staging.example.com
NODE_ENV=staging
DEBUG=false

# .env.production
REACT_APP_API_URL=https://api.example.com
NODE_ENV=production
DEBUG=false
```

### Load Correct .env File

```javascript
// webpack.config.js or build script
const dotenv = require('dotenv');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `.env.${env}`);

dotenv.config({ path: envPath });
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "NODE_ENV=development npm run start",
    "staging": "NODE_ENV=staging npm run start",
    "build:prod": "NODE_ENV=production npm run build"
  }
}
```

---

## 3️⃣ Frontend Environment Variables (React)

### Using dotenv-webpack

```bash
npm install --save-dev dotenv-webpack
```

```javascript
// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: './.env',
      safe: true,
      systemvars: true,
      silent: true
    })
  ]
};
```

### Using in React

```jsx
function App() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    fetch(`${apiUrl}/api/data`)
      .then(res => res.json())
      .then(data => console.log(data));
  }, [apiUrl]);

  return (
    <div>
      <h1>Environment: {process.env.NODE_ENV}</h1>
      <p>API: {apiUrl}</p>
      {!isProduction && <DebugPanel />}
    </div>
  );
}
```

### .gitignore - Never Commit .env

```bash
# .gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
build/
```

---

## 4️⃣ Backend Environment Variables (Node.js)

### dotenv Package

```bash
npm install dotenv
```

```javascript
// server.js - FIRST LINE!
require('dotenv').config();

const express = require('express');
const app = express();

// Now access variables
const dbUrl = process.env.DATABASE_URL;
const secret = process.env.JWT_SECRET;
const port = process.env.PORT || 3000;

if (!dbUrl || !secret) {
  throw new Error('Missing required environment variables');
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

### Configuration Pattern

```javascript
// config.js
require('dotenv').config();

module.exports = {
  database: {
    url: process.env.DATABASE_URL,
    name: process.env.DB_NAME || 'myapp'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  email: {
    provider: process.env.EMAIL_PROVIDER,
    apiKey: process.env.EMAIL_API_KEY
  }
};

// Usage
const config = require('./config');
const dbUrl = config.database.url;
```

---

## 5️⃣ CI/CD Environment Variables

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Deploy
        run: npm run deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

### Vercel Environment Variables

```bash
# vercel.json
{
  "env": {
    "REACT_APP_API_URL": "@api_url",
    "REACT_APP_DEBUG": "@debug"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database_url"
    }
  }
}
```

### Netlify Environment Variables

```toml
# netlify.toml
[build]
  command = "npm run build"
  
[build.environment]
  REACT_APP_API_URL = "https://api.example.com"
  NODE_VERSION = "18.0.0"
```

---

## 6️⃣ Managing Secrets Securely

### What Should Be a Secret?

```javascript
// 🔒 Secrets (never in code)
DATABASE_PASSWORD
JWT_SECRET
API_KEYS
PRIVATE_KEYS
OAUTH_SECRETS
PAYMENT_API_KEYS

// 📝 Not secrets (can be in code/env)
API_ENDPOINTS
FEATURE_FLAGS
ENVIRONMENT_NAME
DEBUG_MODE
```

### Accessing Secrets in Code

```javascript
// Safe - don't expose to frontend
const paymentKey = process.env.STRIPE_SECRET_KEY; // ✅ Backend only

// Backend API endpoint (secure)
app.post('/api/payment', (req, res) => {
  // Use secret here, never expose it
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
});

// ❌ Never do this
const secret = process.env.STRIPE_SECRET_KEY;
app.get('/api/config', (req, res) => {
  res.json({ secret }); // Exposed to frontend!
});
```

### Password Hashing

```javascript
const bcrypt = require('bcrypt');

// Hash password before storing
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Never store raw passwords
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid;
}
```

---

## 🎯 Environment Variable Checklist

```javascript
Development (.env):
- [ ] API URL (local)
- [ ] Debug mode enabled
- [ ] No real secrets

Staging (.env.staging):
- [ ] API URL (staging server)
- [ ] Real secrets
- [ ] Staging database

Production (.env.production):
- [ ] API URL (production)
- [ ] Real secrets
- [ ] Production database
- [ ] Error tracking
- [ ] Analytics keys
```

---

## 📝 Practice Exercises

### Exercise 1: Setup .env Files
Create `.env`, `.env.staging`, `.env.production` with:
- API URLs for each environment
- Feature flags
- Debug settings

### Exercise 2: React Configuration
Create `config.js` that loads environment variables and provides them to app

### Exercise 3: Secure Backend Config
Build configuration system that validates required secrets on startup

### Exercise 4: CI/CD Variables
Setup environment variables in GitHub Actions for deployment

---

## ✅ Summary

- **Environment variables** manage configuration
- **Never hardcode secrets** in code
- **Use .env files** for local development
- **Different .env files** for each environment
- **Validate required variables** on startup
- **Use CI/CD secrets** for deployment

---

## 🔗 Next Steps

**Tomorrow (Day 3):** Testing Before Deploy  
**This Week:** Deploy your application!

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

