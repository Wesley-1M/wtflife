# Week 9: Day 3 - Authentication & Security

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Topics

- Password hashing
- JWT tokens
- OAuth
- Sessions
- CORS
- Input validation

## Example

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hash password
app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.create({ email: req.body.email, password: hashedPassword });
  res.json({ success: true });
});

// Login
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const valid = await bcrypt.compare(req.body.password, user.password);
  
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id }, 'SECRET_KEY');
  res.json({ token });
});

// Protected route
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'SECRET_KEY');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/protected', auth, (req, res) => {
  res.json({ message: 'Protected data' });
});
```

## ✅ Checkpoint

- [ ] Know authentication methods
- [ ] Can hash passwords
- [ ] Can use JWT
- [ ] Understand security

**Next:** APIs & REST! 🚀

