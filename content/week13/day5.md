# Week 13: Day 5 - Deployment & Launch

**Duration:** 2 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Set up CI/CD pipeline
- Deploy to cloud
- Monitor production
- Handle deployment issues
- Plan rollback strategy

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Backend
        run: cd backend && npm install
      
      - name: Run Backend Tests
        run: cd backend && npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
      
      - name: Install Frontend
        run: cd frontend && npm install
      
      - name: Run Frontend Tests
        run: cd frontend && npm test
      
      - name: Build Frontend
        run: cd frontend && npm run build
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v2

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to AWS
        run: |
          aws configure set aws_access_key_id ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws configure set aws_secret_access_key ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws configure set region us-east-1
          
          # Build and push Docker images
          docker build -t myapp-backend:latest ./backend
          docker push ${{ secrets.AWS_ECR_REGISTRY }}/myapp-backend:latest
          
          docker build -t myapp-frontend:latest ./frontend
          docker push ${{ secrets.AWS_ECR_REGISTRY }}/myapp-frontend:latest
          
          # Update ECS service
          aws ecs update-service \
            --cluster production \
            --service myapp-backend \
            --force-new-deployment
```

## Docker Deployment

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src
COPY migrations ./migrations

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "src/index.js"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Cloud Deployment

### AWS ECS Deployment

```json
{
  "family": "myapp-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "myregistry.azurecr.io/myapp-backend:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:..."
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"],
        "interval": 30,
        "timeout": 10,
        "retries": 3,
        "startPeriod": 60
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/myapp",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp-backend
  template:
    metadata:
      labels:
        app: myapp-backend
    spec:
      containers:
      - name: backend
        image: myregistry.azurecr.io/myapp-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Monitoring & Observability

### Health Checks

```javascript
// src/health.js
const express = require('express');
const db = require('./config/database');
const redis = require('./config/redis');

const app = express();

app.get('/health', (req, res) => {
  const health = {
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  };
  res.json(health);
});

app.get('/health/live', (req, res) => {
  // Kubernetes liveness probe
  res.json({ status: 'ALIVE' });
});

app.get('/health/ready', async (req, res) => {
  // Kubernetes readiness probe
  try {
    await db.query('SELECT 1');
    await redis.ping();
    res.json({ status: 'READY' });
  } catch (err) {
    res.status(503).json({ status: 'NOT_READY', error: err.message });
  }
});

app.listen(3000);
```

### Logging

```javascript
// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### APM Integration

```javascript
// src/apm.js
const apm = require('elastic-apm-node');

apm.start({
  serverUrl: process.env.APM_SERVER_URL,
  serviceName: 'myapp-backend',
  environment: process.env.NODE_ENV
});

module.exports = apm;
```

## Deployment Checklist

- [ ] **Code Quality**
  - [ ] All tests passing
  - [ ] Code coverage > 80%
  - [ ] No security vulnerabilities
  - [ ] Linting passed

- [ ] **Infrastructure**
  - [ ] Docker images built
  - [ ] Database migrations ready
  - [ ] Environment variables configured
  - [ ] Secrets stored securely

- [ ] **Security**
  - [ ] HTTPS/SSL enabled
  - [ ] Security headers set
  - [ ] Rate limiting configured
  - [ ] Authentication working

- [ ] **Monitoring**
  - [ ] Logging configured
  - [ ] Health checks working
  - [ ] APM instrumented
  - [ ] Alerts set up

- [ ] **Performance**
  - [ ] Bundle size acceptable
  - [ ] API response time < 200ms
  - [ ] Database queries optimized
  - [ ] Caching configured

- [ ] **Documentation**
  - [ ] API docs complete
  - [ ] Setup guide written
  - [ ] Deployment guide ready
  - [ ] Runbook created

## Rollback Strategy

```bash
# Kubernetes rollback
kubectl rollout history deployment/myapp-backend
kubectl rollout undo deployment/myapp-backend --to-revision=1

# Docker rollback
docker service update --image myapp-backend:v1.0 myapp_backend

# Database rollback
npm run migrate:down
```

## Post-Deployment

1. **Monitoring** (24 hours)
   - Watch error rates
   - Monitor performance
   - Check user feedback

2. **Validation** (1 week)
   - All features working
   - No performance degradation
   - User adoption metrics

3. **Documentation** (ongoing)
   - Update runbooks
   - Document issues found
   - Plan improvements

## ✅ Deployment Checkpoint

- [ ] Application deployed
- [ ] Health checks passing
- [ ] Monitoring active
- [ ] Logging working
- [ ] Backups configured
- [ ] Team trained
- [ ] Documentation ready
- [ ] Rollback plan ready

**CONGRATULATIONS!** 🎉

You've completed the entire course and deployed a production application!

