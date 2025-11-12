# Week 7: Day 5 - Monitoring & Maintenance

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 7 Days 1-4

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Monitor application performance
- ✅ Track errors in production
- ✅ Set up alerting
- ✅ Optimize application performance
- ✅ Maintain production applications

---

## 1️⃣ Production Monitoring Overview

### Why Monitor?

```
❌ Without monitoring:
- Won't know if site is down
- Users discover bugs before you
- Performance issues undetected
- Can't debug production issues
- Users have bad experience

✅ With monitoring:
- Immediate alerts
- Track user experience
- Catch issues early
- Debug with real data
- Happy users!
```

### Types of Monitoring

```
Performance Monitoring
├─ Page load times
├─ API response times
├─ Database queries
└─ Memory usage

Error Monitoring
├─ JavaScript errors
├─ API errors
├─ Database errors
└─ Error stack traces

Uptime Monitoring
├─ Is site up?
├─ Response time
├─ SSL certificate validity
└─ Alerts if down

User Experience
├─ User location
├─ Device type
├─ Browser version
└─ User interactions
```

---

## 2️⃣ Application Performance Monitoring (APM)

### Core Metrics

```javascript
// Measure key metrics
const metrics = {
  // Frontend metrics
  'first-contentful-paint': 1200,    // ms
  'largest-contentful-paint': 2400,  // ms
  'cumulative-layout-shift': 0.1,    // score
  'time-to-interactive': 3500,       // ms
  
  // Backend metrics
  'api-response-time': 150,          // ms
  'database-query-time': 50,         // ms
  'error-rate': 0.1,                 // %
  'uptime': 99.95                    // %
};
```

### Using Web Vitals

```javascript
// Measure Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getFCP(console.log);  // First Contentful Paint
getLCP(console.log);  // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

### Performance API

```javascript
// Mark operations
performance.mark('api-start');
const data = await fetch('/api/data').then(r => r.json());
performance.mark('api-end');

// Measure time
performance.measure('api-call', 'api-start', 'api-end');

// Get measurements
const measure = performance.getEntriesByName('api-call')[0];
console.log(`API took ${measure.duration}ms`);

// Send to analytics
sendToAnalytics('api-duration', measure.duration);
```

---

## 3️⃣ Error Tracking with Sentry

### Setup Sentry

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// main.js - Initialize first!
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [
    new BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV
});
```

### Capture Errors

```javascript
// Automatic - errors are captured
throw new Error('Something went wrong');

// Manual - capture specific errors
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// Add context
Sentry.captureException(error, {
  contexts: {
    user: { email: user.email }
  },
  tags: {
    page: 'checkout',
    action: 'payment'
  }
});
```

### Sentry Dashboard

```
Errors page shows:
- Error frequency
- Stack traces
- Affected users
- Browser/OS info
- Release information
- Can mark as resolved
```

---

## 4️⃣ Backend Monitoring with Winston

### Setup Winston Logger

```bash
npm install winston
```

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Use Logger

```javascript
const logger = require('./logger');

// Info
logger.info('User logged in', { userId: 123 });

// Error
logger.error('Database connection failed', { error: err.message });

// Query times
logger.info('Query completed', {
  query: 'SELECT * FROM users',
  duration: 150,
  rows: 5
});
```

---

## 5️⃣ Uptime Monitoring

### UptimeRobot (Free Service)

```
1. Sign up at uptimerobot.com
2. Add monitoring for your API:
   - https://api.example.com/health
3. Set alert email
4. Get notified if down
5. View uptime report
```

### Health Check Endpoint

```javascript
// server.js
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  
  res.json(health);
});

// Check database
app.get('/health/db', async (req, res) => {
  try {
    const result = await db.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'DOWN', database: 'disconnected' });
  }
});
```

---

## 6️⃣ Alerting & Notifications

### Setup Alerts

```javascript
// If error rate > 1%, send alert
if (errorRate > 0.01) {
  sendAlert('High error rate detected', {
    errorRate: errorRate * 100,
    threshold: 1
  });
}

// If response time > 500ms, send alert
if (avgResponseTime > 500) {
  sendAlert('Slow API response', {
    avgTime: avgResponseTime,
    threshold: 500
  });
}
```

### Alert Channels

```
Email - For all alerts
Slack - For development team
SMS - For critical issues
PagerDuty - For on-call escalation
```

### Slack Integration

```javascript
const { IncomingWebhook } = require('@slack/webhook');
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

async function alertSlack(message) {
  await webhook.send({
    text: message,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `🚨 *Production Alert*\n${message}`
        }
      }
    ]
  });
}
```

---

## 7️⃣ Maintenance Best Practices

### Database Maintenance

```javascript
// Regular backups
0 2 * * * pg_dump mydb > backup.sql

// Cleanup old data
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';

// Optimize queries
VACUUM ANALYZE;
REINDEX DATABASE mydb;

// Monitor slow queries
SELECT query, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
```

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update major versions (careful!)
npm install package@latest

# Security audits
npm audit
npm audit fix
```

### Log Management

```javascript
// Rotate logs to prevent disk space issues
// Keep logs for analysis
// Archive old logs

// Example with Winston:
new winston.transports.File({
  filename: 'logs/error.log',
  maxsize: 1024 * 1024, // 1MB
  maxFiles: 10
})
```

---

## 📝 Practice Exercises

### Exercise 1: Setup Monitoring
Add Web Vitals tracking and Sentry to React app

### Exercise 2: Error Tracking
Setup Winston logger and test error scenarios

### Exercise 3: Health Checks
Create health check endpoints for monitoring

### Exercise 4: Alerting
Setup Slack alerts for critical errors

---

## ✅ Summary

- **Monitor performance** - Track metrics
- **Track errors** - Sentry for frontend, Winston for backend
- **Health checks** - Monitor uptime
- **Alerting** - Get notified of issues
- **Maintenance** - Keep apps running smoothly
- **Logging** - Store data for debugging

---

## 🔗 Next Steps

**Week 8:** Backend Development & Node.js  
**Continue:** Monitor your deployed applications!

