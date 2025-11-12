# Week 7: Day 4 - Deployment Platforms

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 7 Days 1-3

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Deploy to Vercel
- ✅ Deploy to Netlify
- ✅ Deploy to Heroku
- ✅ Configure deployment settings
- ✅ Setup continuous deployment

---

## 1️⃣ Deployment Essentials

### What is Deployment?

```
Development (Local)
    ↓
Staging (Test Server)
    ↓
Production (Live Server)

Deployment = Moving code from local → server
```

### Pre-Deployment Checklist

```bash
✅ All tests passing
✅ No console errors
✅ No hardcoded secrets
✅ Environment variables configured
✅ Build succeeds
✅ Performance acceptable
✅ Security headers set
✅ Error handling works
```

---

## 2️⃣ Vercel Deployment (Recommended for Next.js/React)

### Why Vercel?

- Built for Next.js/React
- Zero-config deployment
- Automatic SSL
- Global CDN
- Preview deployments
- Git integration

### Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# Follow prompts:
# - Link to GitHub project (optional)
# - Configure build settings
# - Deploy!

# 3. For production
vercel --prod
```

### Vercel Configuration (vercel.json)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@api_url",
    "DATABASE_URL": "@database_url"
  },
  "regions": ["iad1"],
  "functions": {
    "api/**/*.js": {
      "maxDuration": 60
    }
  }
}
```

### GitHub Integration (CI/CD)

```bash
# 1. Connect GitHub repo to Vercel
# 2. Every push to main -> auto deploy
# 3. Every PR -> creates preview deployment
# 4. View diff before merging
```

### Environment Variables in Vercel

```
1. Go to Project Settings
2. Environment Variables
3. Add for each environment:
   - Development
   - Preview
   - Production
4. Restart deployments for changes to apply
```

---

## 3️⃣ Netlify Deployment (Great for SPA/Static Sites)

### Why Netlify?

- Easy for static sites
- Form handling built-in
- Functions (serverless)
- Split testing
- Drag & drop deploy
- Git integration

### Deploy to Netlify

```bash
# 1. Install CLI
npm install -g netlify-cli

# 2. Connect to GitHub
netlify connect

# 3. Deploy
netlify deploy

# 4. Deploy to production
netlify deploy --prod
```

### Netlify Configuration (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18.0.0"
  REACT_APP_API_URL = "https://api.example.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Netlify Functions (Serverless)

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Netlify!' })
  };
};

// Access from React
async function callFunction() {
  const response = await fetch('/.netlify/functions/hello');
  const data = await response.json();
  console.log(data);
}
```

---

## 4️⃣ Heroku Deployment (For Full-Stack Apps)

### Why Heroku?

- Easy backend deployment
- Database hosting
- Dynos (containers)
- Add-ons (Redis, databases)
- Logging & monitoring
- Good for learning

### Deploy Node.js App to Heroku

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create my-awesome-app

# 4. Add environment variables
heroku config:set DATABASE_URL=mongodb://...
heroku config:set JWT_SECRET=your-secret

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

### Procfile (Tells Heroku how to run app)

```
web: node server.js
worker: node worker.js
```

### Heroku Configuration

```bash
# Add database
heroku addons:create heroku-postgresql

# View config
heroku config

# Run migrations
heroku run npm run migrate

# Scale dynos
heroku ps:scale web=2
```

---

## 5️⃣ Docker & Container Deployment

### Docker Basics

```dockerfile
# Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Build & Run Docker Image

```bash
# Build
docker build -t my-app .

# Run
docker run -p 3000:3000 my-app

# Push to registry
docker tag my-app myregistry/my-app:latest
docker push myregistry/my-app:latest
```

### Deploy with Docker

Can deploy to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean
- Railway
- Render

---

## 6️⃣ SSL/HTTPS & Security

### HTTPS in Production

```
Always use HTTPS in production!
Protects user data
Required for most browsers
```

### Security Headers

```javascript
// Express.js
const helmet = require('helmet');
const app = express();

app.use(helmet()); // Sets security headers

// Results in:
// X-Frame-Options: DENY
// X-Content-Type-Options: nosniff
// X-XSS-Protection: 1; mode=block
// Strict-Transport-Security: max-age=31536000
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));
```

---

## 7️⃣ Monitoring & Analytics

### Error Tracking (Sentry)

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/123456",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Automatic error capture
// Manual capture
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}
```

### Performance Monitoring

```javascript
// Measure key metrics
const startTime = performance.now();

// ... some operation ...

const endTime = performance.now();
console.log(`Operation took ${endTime - startTime}ms`);

// Send to analytics
sendMetric('operation-time', endTime - startTime);
```

### Uptime Monitoring

```
Services:
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor your API endpoints
Get alerts if down
Track uptime percentage
```

---

## 📝 Practice Exercises

### Exercise 1: Deploy to Vercel
Create React app, deploy to Vercel, configure environment variables

### Exercise 2: Deploy to Netlify
Deploy static site to Netlify with custom domain

### Exercise 3: Deploy Node.js to Heroku
Deploy Express API to Heroku with PostgreSQL database

### Exercise 4: Add Monitoring
Integrate Sentry for error tracking in production app

---

## ✅ Summary

- **Vercel** best for Next.js/React
- **Netlify** great for static sites
- **Heroku** good for backends
- **Docker** for full control
- **HTTPS** always in production
- **Monitor** your applications
- **Test before deploy**

---

## 🔗 Next Steps

**Tomorrow (Day 5):** Monitoring & Maintenance  
**Start Deploying:** Get your apps live!

