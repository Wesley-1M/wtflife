# Week 10: Day 4 - Monitoring & Scaling

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Monitoring

- Application metrics
- Infrastructure monitoring
- Log aggregation
- Error tracking
- Performance metrics

## Tools

- Prometheus (metrics)
- Grafana (visualization)
- ELK Stack (logs)
- Sentry (errors)
- DataDog (full stack)

## Scaling

- Horizontal scaling
- Load balancing
- Caching
- Database optimization
- CDN usage

## Example

```javascript
// Prometheus metrics
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests',
  labelNames: ['method', 'status']
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({
      method: req.method,
      status: res.statusCode
    }, duration);
  });
  next();
});
```

## ✅ Checkpoint

- [ ] Know monitoring tools
- [ ] Can set up metrics
- [ ] Understand scaling
- [ ] Know optimization

**Next:** Week 10 Project! 🚀

