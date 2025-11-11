# Week 10: Day 5 - Security & Best Practices

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Security Topics

- HTTPS/SSL
- CORS configuration
- Rate limiting
- Input sanitization
- CSRF protection
- Dependency updates

## Best Practices

- Secrets management
- API versioning
- Documentation
- Code review process
- Monitoring alerts

## Example

```javascript
// Security middleware
app.use(helmet()); // Headers
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Input validation
app.post('/api/users', 
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);

// Secrets
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;
```

## ✅ Checkpoint

- [ ] Understand security
- [ ] Know best practices
- [ ] Can implement security
- [ ] Know OWASP top 10

**Next:** Week 10 Project! 🚀

