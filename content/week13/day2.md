# Week 13: Day 2 - Technical Interview Preparation

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Portfolio & Career Planning

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Solve coding problems efficiently
- ✅ Explain your solution clearly
- ✅ Communicate during interviews
- ✅ Handle edge cases
- ✅ Optimize for time and space
- ✅ Practice behavioral questions

---

## 1️⃣ Coding Interview Fundamentals

### Interview Process

```
Typical Technical Interview:

1. Introduction (5 min)
   - Light conversation
   - Explain role
   - Answer initial questions

2. Coding Problem (35-45 min)
   - Understand requirements
   - Discuss approach
   - Write code
   - Test solution
   - Optimize if time

3. Follow-up Questions (5-10 min)
   - Edge cases
   - Complexity analysis
   - Alternative approaches

4. Your Questions (5 min)
   - Ask about role/team
   - Company culture
   - Next steps
```

### Problem-Solving Framework

```typescript
// PREPARE Framework for coding interviews

interface CodingApproach {
  step1_understand: string
  step2_plan: string
  step3_code: string
  step4_test: string
  step5_optimize: string
}

const framework: CodingApproach = {
  step1_understand: `
    1. Read problem carefully (2-3 times)
    2. Ask clarifying questions:
       - Input constraints?
       - Valid range of values?
       - Can I use built-in functions?
       - What should I return?
    3. Provide examples
    4. Identify edge cases
  `,
  step2_plan: `
    1. Discuss approach (don't code yet)
    2. Explain algorithm to interviewer
    3. Discuss trade-offs (time/space)
    4. Get approval before coding
  `,
  step3_code: `
    1. Write clean, readable code
    2. Use meaningful variable names
    3. Add comments for complex logic
    4. Code at steady pace
    5. Explain as you write
  `,
  step4_test: `
    1. Test with provided examples
    2. Test edge cases
    3. Test boundary conditions
    4. Walk through code with test input
  `,
  step5_optimize: `
    1. Discuss complexity
    2. Identify improvements
    3. Optimize if possible
    4. Discuss trade-offs
  `
}
```

---

## 2️⃣ Common Interview Questions

### Array & String Problems

```javascript
// Problem: Two Sum
// Given array and target, find two numbers that add to target

function twoSum(nums, target) {
  // Approach: Use hash map for O(n) solution
  const seen = new Map()
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    
    if (seen.has(complement)) {
      return [seen.get(complement), i]
    }
    
    seen.set(nums[i], i)
  }
  
  return null // No solution
}

// Test
console.log(twoSum([2, 7, 11, 15], 9)) // [0, 1]
console.log(twoSum([3, 2, 4], 6)) // [1, 2]
```

### Tree & Graph Problems

```typescript
// Problem: Binary Tree Level Order Traversal

interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return []
  
  const result: number[][] = []
  const queue: TreeNode[] = [root]
  
  while (queue.length > 0) {
    const levelSize = queue.length
    const level: number[] = []
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!
      level.push(node.val)
      
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    
    result.push(level)
  }
  
  return result
}
```

### Dynamic Programming

```javascript
// Problem: Longest Increasing Subsequence (LIS)

function lengthOfLIS(nums) {
  if (nums.length === 0) return 0
  
  // dp[i] = length of LIS ending at index i
  const dp = new Array(nums.length).fill(1)
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }
  
  return Math.max(...dp)
}

// Time: O(n²), Space: O(n)
// Test
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])) // 4 [2,3,7,101]
```

---

## 3️⃣ Complexity Analysis

### Big O Notation Guide

```
Time Complexity:
O(1) - Constant (array access by index)
O(log n) - Logarithmic (binary search)
O(n) - Linear (simple loop)
O(n log n) - Linearithmic (efficient sorts)
O(n²) - Quadratic (nested loops)
O(2ⁿ) - Exponential (recursion without memoization)
O(n!) - Factorial (permutations)

Space Complexity:
O(1) - Constant (no extra space)
O(log n) - Recursion depth (binary search)
O(n) - Linear (array, hash map)
O(n²) - Quadratic (2D array)

Rule of Thumb:
Can you do better? Ask yourself:
- Can I use a hash map? (O(n) lookup)
- Can I use two pointers? (O(1) space)
- Can I memoize? (reduce exponential)
- Can I sort first? (enables algorithms)
```

### Complexity Practice

```typescript
// Example: Analyzing complexity

// Approach 1: Brute Force O(n²)
function findPair_bruteForce(nums: number[], target: number): boolean {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return true
      }
    }
  }
  return false
}

// Approach 2: Optimized O(n)
function findPair_optimized(nums: number[], target: number): boolean {
  const seen = new Set()
  
  for (const num of nums) {
    if (seen.has(target - num)) {
      return true
    }
    seen.add(num)
  }
  
  return false
}

// In interview: Discuss both, explain trade-offs
// Then implement optimized version
```

---

## 4️⃣ Behavioral Questions

### STAR Method

```
STAR = Situation, Task, Action, Result

Problem: "Tell me about a time you failed"

SITUATION:
"I was building an e-commerce app and pushed code 
without thorough testing."

TASK:
"Production was down for 2 hours due to a payment 
bug I introduced."

ACTION:
"I implemented better testing practices, set up 
pre-commit hooks, and created incident response 
procedures."

RESULT:
"Reduced production incidents by 80% and improved 
team code review process. Learned importance of 
testing before deployment."

Key metrics make this stronger!
```

### Common Behavioral Questions

```
1. Tell me about yourself
2. Why do you want this job?
3. Describe a challenging project
4. Tell me about a conflict with a teammate
5. How do you handle tight deadlines?
6. Tell me about a time you failed
7. Describe a time you showed leadership
8. How do you stay updated with technology?
9. What's your biggest weakness?
10. Why should we hire you?

Preparation: Write STAR story for each
```

---

## 5️⃣ Interview Day Strategy

### Before the Interview

```
1 Week Before:
- [ ] Research company thoroughly
- [ ] Study their tech stack
- [ ] Practice similar problems
- [ ] Prepare questions to ask
- [ ] Test equipment (camera, mic, internet)
- [ ] Test IDE/coding environment
- [ ] Get good sleep all week

Day Before:
- [ ] Review core algorithms
- [ ] Look at company's products
- [ ] Prepare questions
- [ ] Set up workspace
- [ ] Get plenty of rest

Morning Of:
- [ ] Eat good breakfast
- [ ] Test video/audio again
- [ ] Start 10 minutes early
- [ ] Have water nearby
- [ ] Deep breath and relax
```

### During the Interview

```
1. Introduce Yourself (2 min)
   - Be confident and friendly
   - Highlight relevant experience
   - Show enthusiasm for the role

2. Clarify Requirements (3-5 min)
   - Ask all questions
   - Confirm edge cases
   - Write examples

3. Discuss Approach (5 min)
   - Explain before coding
   - Ask for feedback
   - Discuss complexity

4. Code (20-30 min)
   - Write clearly
   - Explain as you go
   - Test as you code
   - Don't rush

5. Test & Optimize (5-10 min)
   - Test with examples
   - Handle edge cases
   - Discuss optimizations

6. Ask Questions (3-5 min)
   - Show genuine interest
   - Ask meaningful questions
   - Discuss team dynamics
```

### After the Interview

```
1. Send Thank You Email (within 24 hours)
   - Reference specific discussion points
   - Reiterate interest
   - Keep it brief (3-4 sentences)

2. Follow Up (if no response in 1 week)
   - Check job posting date
   - Follow up professionally
   - Be patient

3. Feedback
   - Ask for feedback if rejected
   - Learn from experience
   - Improve weak areas

4. Keep Interviewer in Touch
   - Connect on LinkedIn
   - Share relevant articles
   - Maintain relationship
```

---

## 📝 Practice Exercises

### Exercise 1: Solve 10 LeetCode Problems
- Difficulty: Easy (5 problems)
- Difficulty: Medium (5 problems)
- Time each: 20 minutes max
- Record solutions

### Exercise 2: Mock Interview
- Find peer/mentor for mock interview
- Complete 1 hour interview
- Get feedback
- Record yourself

### Exercise 3: Behavioral Story Bank
- Write 10 STAR stories
- Cover different competencies
- Practice speaking them aloud
- Time: 2-3 minutes each

### Exercise 4: Company Research
- Research 3 companies thoroughly
- Understand their products
- Study their tech stack
- Prepare specific questions

### Exercise 5: Practice Interview
- Do 3 timed coding interviews
- Use platforms like Pramp
- Focus on communication
- Get peer feedback

---

## ✅ Summary

- **Problem-solving framework** ensures structured approach
- **Practice** is key to coding interview success
- **Communication** is as important as code
- **Behavioral questions** show your soft skills
- **Preparation** reduces nervousness
- **Practice problems** build muscle memory
- **Mock interviews** simulate real experience
- **Company research** shows genuine interest

---

## 🔗 Next Steps

**Tomorrow (Day 3):** System Design & Architecture  
**Keep practicing:** Dedicate 30 minutes daily to coding problems!
├── package.json
└── Dockerfile
```

### Express Setup

```javascript
// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/posts', require('./routes/post.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
```

### Authentication

```javascript
// src/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/user.model');
const logger = require('../utils/logger');

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('username').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        email,
        username,
        password: hashedPassword
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
```

### Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorize };
```

### API Endpoints

```javascript
// src/routes/post.routes.js
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Post = require('../models/post.model');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create post
router.post('/',
  authenticateToken,
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, imageUrl } = req.body;

      const post = await Post.create({
        userId: req.user.userId,
        title,
        content,
        imageUrl
      });

      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

// Get all posts
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('userId', 'username avatar');

    const total = await Post.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
});

// Update post
router.put('/:id',
  authenticateToken,
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.userId.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      post.title = title;
      post.content = content;
      await post.save();

      res.json(post);
    } catch (err) {
      next(err);
    }
  }
);

// Delete post
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### Testing

```javascript
// tests/post.test.js
const request = require('supertest');
const app = require('../src/index');
const Post = require('../src/models/post.model');

describe('POST Endpoints', () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  test('Create post with valid data', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Post');
  });

  test('Get all posts', async () => {
    await Post.create({
      userId: userId,
      title: 'Test Post',
      content: 'Content'
    });

    const res = await request(app)
      .get('/api/posts');

    expect(res.statusCode).toBe(200);
    expect(res.body.posts).toHaveLength(1);
  });

  test('Update own post', async () => {
    const post = await Post.create({
      userId: userId,
      title: 'Original',
      content: 'Content'
    });

    const res = await request(app)
      .put(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated',
        content: 'New content'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
  });
});
```

## ✅ Checkpoint

- [ ] Express server running
- [ ] Authentication implemented
- [ ] Database connected
- [ ] All CRUD endpoints working
- [ ] Error handling in place
- [ ] API documented
- [ ] Tests passing

**Next:** Frontend Implementation! ⚛️

