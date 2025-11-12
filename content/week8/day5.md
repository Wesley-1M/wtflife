# Week 8: Day 5 - Advanced Backend Patterns

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 8 Days 1-4

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Implement pagination & filtering
- ✅ Use caching strategies
- ✅ Handle async operations
- ✅ Implement file uploads
- ✅ Build scalable APIs

---

## 1️⃣ Pagination & Filtering

### Pagination Implementation

```javascript
// Get users with pagination
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const total = await User.countDocuments();
  const users = await User.find().skip(skip).limit(limit);
  
  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Usage: GET /api/users?page=2&limit=20
```

### Filtering

```javascript
app.get('/api/users', async (req, res) => {
  const filters = {};
  
  // Filter by status
  if (req.query.status) {
    filters.status = req.query.status;
  }
  
  // Filter by role
  if (req.query.role) {
    filters.role = req.query.role;
  }
  
  // Filter by date range
  if (req.query.startDate || req.query.endDate) {
    filters.createdAt = {};
    if (req.query.startDate) {
      filters.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filters.createdAt.$lte = new Date(req.query.endDate);
    }
  }
  
  const users = await User.find(filters);
  res.json(users);
});

// Usage: GET /api/users?status=active&role=admin
```

### Sorting

```javascript
app.get('/api/users', async (req, res) => {
  const sortBy = req.query.sort || '-createdAt'; // '-' = descending
  
  const users = await User.find()
    .sort(sortBy)
    .limit(10);
  
  res.json(users);
});

// Usage: GET /api/users?sort=-createdAt
```

---

## 2️⃣ Caching Strategies

### In-Memory Caching

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

app.get('/api/users/:id', (req, res) => {
  const cacheKey = `user:${req.params.id}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // Get from database
  const user = database.getUser(req.params.id);
  
  // Store in cache
  cache.set(cacheKey, user);
  
  res.json(user);
});
```

### Redis Caching

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/users/:id', async (req, res) => {
  const cacheKey = `user:${req.params.id}`;
  
  // Check Redis cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Get from database
  const user = await User.findById(req.params.id);
  
  // Store in Redis (expire in 1 hour)
  await client.setex(cacheKey, 3600, JSON.stringify(user));
  
  res.json(user);
});
```

---

## 3️⃣ File Uploads

### Using Multer

```bash
npm install multer
```

```javascript
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG files allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    size: req.file.size
  });
});
```

---

## 4️⃣ Batch Operations

### Bulk Create

```javascript
app.post('/api/users/bulk', async (req, res) => {
  try {
    const users = req.body; // Array of user objects
    const result = await User.insertMany(users);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Bulk Update

```javascript
app.put('/api/users/bulk', async (req, res) => {
  try {
    const updates = req.body; // [{ id, name }, { id, name }]
    
    const result = await Promise.all(
      updates.map(update =>
        User.findByIdAndUpdate(update.id, update, { new: true })
      )
    );
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 5️⃣ Queue Systems

### Job Queues with Bull

```bash
npm install bull redis
```

```javascript
const Queue = require('bull');
const emailQueue = new Queue('emails');

// Create job
app.post('/api/send-email', async (req, res) => {
  const job = await emailQueue.add({
    to: req.body.email,
    subject: 'Welcome!',
    message: 'Thanks for signing up'
  });
  
  res.json({ jobId: job.id });
});

// Process jobs
emailQueue.process(async (job) => {
  console.log('Sending email to:', job.data.to);
  // Send email
  return { success: true };
});

// Handle completions/errors
emailQueue.on('completed', (job) => {
  console.log('Email sent:', job.id);
});

emailQueue.on('failed', (job, error) => {
  console.error('Email failed:', error.message);
});
```

---

## 📝 Practice Exercises

### Exercise 1: Pagination
Implement pagination with filters

### Exercise 2: Caching
Add Redis caching to API

### Exercise 3: File Upload
Create file upload endpoint with validation

### Exercise 4: Bulk Operations
Implement bulk create/update endpoints

---

## ✅ Summary

- **Pagination** handles large datasets
- **Filtering** refines results
- **Caching** improves performance
- **File uploads** with validation
- **Batch operations** efficient bulk work
- **Queues** handle async tasks

---

## 🔗 Next Steps

**Week 9:** Full-Stack Integration  
**Continue:** Build scalable systems!
- AWS
- Firebase
- Docker

## Process

```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy --prod

# Deploy to Netlify
netlify deploy --prod

# Docker
docker build -t myapp .
docker run -p 3000:3000 myapp
```

## Monitoring

- Sentry (error tracking)
- DataDog (performance)
- LogRocket (session replay)
- Google Analytics (user analytics)

## ✅ Checkpoint

- [ ] Can build for production
- [ ] Can deploy to platform
- [ ] Know monitoring tools
- [ ] Understand CI/CD

**Next:** Week 8 Project! 🚀

