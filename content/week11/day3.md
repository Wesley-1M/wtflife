# Week 11: Day 3 - API Routes & Backend Integration

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 11 Days 1-2

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Create API routes in Next.js
- ✅ Handle different HTTP methods
- ✅ Connect to databases
- ✅ Implement authentication
- ✅ Deploy serverless functions

---

## 1️⃣ API Routes Basics

### File Structure

```
app/
  api/
    hello/
      route.js        # /api/hello
    posts/
      route.js        # /api/posts (list & create)
      [id]/
        route.js      # /api/posts/[id] (get, update, delete)
    auth/
      login/
        route.js      # /api/auth/login
      logout/
        route.js      # /api/auth/logout
```

### Hello World API

```javascript
// app/api/hello/route.js
export async function GET(request) {
  return Response.json({ message: 'Hello World' });
}

// Request: GET /api/hello
// Response: { "message": "Hello World" }
```

### Request & Response

```javascript
// app/api/data/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  return Response.json({
    query,
    results: [] // Would fetch real data
  });
}

export async function POST(request) {
  const data = await request.json();

  return Response.json(
    { success: true, data },
    { status: 201 }
  );
}

// Request: GET /api/data?q=next
// Request: POST /api/data with JSON body
```

---

## 2️⃣ HTTP Methods

### GET - Retrieve Data

```javascript
// app/api/posts/route.js
export async function GET(request) {
  const posts = [
    { id: 1, title: 'Next.js Guide' },
    { id: 2, title: 'React Hooks' }
  ];

  return Response.json(posts);
}
```

### POST - Create Data

```javascript
// app/api/posts/route.js
export async function POST(request) {
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Save to database
  const post = {
    id: Math.random(),
    title,
    content,
    createdAt: new Date()
  };

  return Response.json(post, { status: 201 });
}
```

### PUT - Update Data

```javascript
// app/api/posts/[id]/route.js
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  // Find and update post
  const post = {
    id,
    ...body,
    updatedAt: new Date()
  };

  return Response.json(post);
}
```

### DELETE - Remove Data

```javascript
// app/api/posts/[id]/route.js
export async function DELETE(request, { params }) {
  const { id } = params;

  // Delete from database
  await db.posts.delete(id);

  return Response.json({ deleted: true });
}
```

---

## 3️⃣ Database Integration

### MongoDB Connection

```javascript
// lib/db.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectDB() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.DB_NAME);
}
```

### API with Database

```javascript
// app/api/posts/route.js
import { connectDB } from '@/lib/db';

export async function GET(request) {
  try {
    const db = await connectDB();
    const posts = await db.collection('posts').find({}).toArray();
    
    return Response.json(posts);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await connectDB();
    
    const result = await db.collection('posts').insertOne({
      ...body,
      createdAt: new Date()
    });

    return Response.json(
      { id: result.insertedId, ...body },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
```

---

## 4️⃣ Authentication & Middleware

### JWT Authentication

```javascript
// lib/jwt.js
import jwt from 'jsonwebtoken';

export function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
```

### Auth API

```javascript
// app/api/auth/login/route.js
import { createToken } from '@/lib/jwt';

export async function POST(request) {
  const { email, password } = await request.json();

  // Validate credentials
  const user = await db.users.findOne({ email });
  if (!user || user.password !== password) {
    return Response.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const token = createToken(user.id);

  return Response.json({ token, user });
}
```

### Protected Routes

```javascript
// app/api/profile/route.js
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return Response.json(
      { error: 'Missing token' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return Response.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  const user = await db.users.findOne({ id: decoded.userId });
  return Response.json(user);
}
```

---

## 5️⃣ Error Handling & Validation

### Input Validation

```javascript
// app/api/todos/route.js
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    // Validate
    if (!title || title.length < 3) {
      return Response.json(
        { error: 'Title must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (description && description.length > 500) {
      return Response.json(
        { error: 'Description too long' },
        { status: 400 }
      );
    }

    // Create
    const todo = { ...body, id: crypto.randomUUID() };
    return Response.json(todo, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
```

### Error Handling

```javascript
// app/api/data/route.js
export async function GET(request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('API Error:', error);

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 6️⃣ Frontend Integration

### Calling API from Components

```jsx
// app/posts/page.js
'use client';

import { useState, useEffect } from 'react';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

### Creating Data

```jsx
// app/new-post/page.js
'use client';

import { useState } from 'react';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (!res.ok) throw new Error('Failed to create');

      const post = await res.json();
      alert('Post created!');
      setTitle('');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

## 📝 Practice Exercises

### Exercise 1: CRUD API
Build complete posts API

### Exercise 2: Authentication
Implement JWT auth

### Exercise 3: Database
Connect to MongoDB

### Exercise 4: Error Handling
Add validation and error responses

---

## ✅ Summary

- **API Routes** build backend in Next.js
- **HTTP methods** handle different operations
- **Database** integration with MongoDB
- **Authentication** with JWT tokens
- **Validation** prevents bad data
- **Error handling** improves reliability

---

## 🔗 Next Steps

**Tomorrow (Day 4):** Advanced Patterns & Middleware  
**Continue:** Build production APIs!

## Common Questions

### Question 1: Tell me about yourself

```
Situation: Working as junior dev for 2 years
Task: Need to transition to senior role
Action: Took lead on 3 projects, mentored 2 juniors
Result: Promoted to senior within 6 months
```

### Question 2: Tell me about a time you failed

```
Situation: Deployed code without proper testing
Task: System went down, impacting 10K users
Action: Identified bug, fixed and re-deployed, added testing
Result: Implemented CI/CD, no more incidents
```

### Question 3: Tell me about a conflict

```
Situation: Disagreement with product manager on timeline
Task: They wanted impossible deadline
Action: Presented data, proposed realistic alternative
Result: Team accepted plan, delivered on time
```

### Question 4: Teamwork example

```
Situation: Large project with cross-functional team
Task: Coordinating between frontend, backend, design
Action: Organized daily standups, created shared docs
Result: Shipped 2 weeks early, great team morale
```

### Question 5: Leadership example

```
Situation: Junior developer struggling with complex task
Task: Help them succeed without losing time
Action: Pair programmed, documented process, gave feedback
Result: Junior got proficient, feels confident
```

## Interview Prep Checklist

- [ ] **Research the company**
  - Mission and values
  - Recent news/funding
  - Products they build
  - Engineering culture

- [ ] **Prepare examples**
  - 5-10 solid STAR stories
  - Technical achievements
  - Team successes
  - Problem-solving examples
  - Learning experiences

- [ ] **Practice responses**
  - Record yourself
  - Time yourself (2-3 min per answer)
  - Get feedback from friends
  - Mock interviews

- [ ] **Prepare questions**
  - Team structure
  - Engineering challenges
  - Growth opportunities
  - Work-life balance
  - Timeline and process

## Questions to Ask Interviewers

```
1. "What are the biggest engineering challenges 
    your team is facing right now?"

2. "How do you balance moving fast with code quality?"

3. "What does career progression look like for this role?"

4. "How is the team structured and who would I work with?"

5. "What's something you love about working here?"

6. "What's the onboarding process like?"

7. "How do you measure success for this role?"
```

## Communication Tips

### Do:
- ✅ Be specific with examples
- ✅ Focus on your actions and impact
- ✅ Show growth mindset
- ✅ Ask clarifying questions
- ✅ Make eye contact
- ✅ Smile and be friendly
- ✅ Speak clearly and concisely

### Don't:
- ❌ Ramble or go off track
- ❌ Blame others for failures
- ❌ Exaggerate or lie
- ❌ Speak negatively about past employers
- ❌ Interrupt
- ❌ Check your phone
- ❌ Be defensive

## Example Responses

### "What's your greatest weakness?"

```
"I used to struggle with delegation because I wanted 
to handle everything myself. I recognized that this 
slowed down my team. So I worked on being more direct 
with my team, giving clear instructions, and trusting 
them to execute. Now I'm much better at prioritizing 
what only I can do."
```

### "Why do you want to leave your current job?"

```
"I've had a great experience at my current company, 
but I'm looking for a role where I can grow as a 
technical leader. Your team's work on [specific 
project] aligns with my goals, and I'm excited about 
the opportunity to contribute to that."
```

### "Why should we hire you?"

```
"I bring 5 years of full-stack experience, I'm 
passionate about clean code and testing, and I 
thrive in collaborative environments. In my last 
role, I led the migration to microservices which 
reduced deploy times by 60%. I'm excited to 
contribute that same dedication here."
```

## Behavioral Interview Do's and Don'ts

| Do | Don't |
|---|---|
| Use specific metrics | Speak vaguely |
| Show self-awareness | Make excuses |
| Demonstrate growth | Criticize others |
| Ask thoughtful questions | Interrogate them |
| Show enthusiasm | Appear desperate |
| Research company | Go in unprepared |
| Follow up after | Forget about them |

## ✅ Checkpoint

- [ ] Master STAR method
- [ ] Have 10 solid stories
- [ ] Prepared questions
- [ ] Can discuss failures
- [ ] Practice with mock interviews

**Next:** Code Review & Best Practices! 👨‍💼

