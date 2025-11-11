# Week 10: Day 3 - DevOps & Docker

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Topics

- Docker basics
- Container management
- Docker Compose
- Registry (Docker Hub)
- Kubernetes (intro)

## Docker Example

```dockerfile
# Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build & run
docker build -t myapp .
docker run -p 3000:3000 myapp
```

## Docker Compose

```yaml
version: '3'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mongodb://db:27017/myapp
  
  db:
    image: mongo:5
    ports:
      - "27017:27017"
```

## ✅ Checkpoint

- [ ] Understand Docker
- [ ] Can containerize apps
- [ ] Know Docker Compose
- [ ] Understand K8s basics

**Next:** Monitoring & Scaling! 🚀

