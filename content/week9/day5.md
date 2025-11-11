# Week 9: Day 5 - Backend Testing & Deployment

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Topics

- Unit testing
- Integration testing
- API testing
- Database testing
- Deployment strategies
- Environment management

## Tools

- Jest for testing
- Supertest for API testing
- Docker for containerization
- Heroku/Railway for hosting

## Example

```javascript
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  test('GET /api/users returns users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  test('POST /api/users creates user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John', email: 'john@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});
```

## ✅ Checkpoint

- [ ] Can test APIs
- [ ] Know testing tools
- [ ] Can deploy
- [ ] Understand CI/CD

**Next:** Week 9 Project! 🚀

