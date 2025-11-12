# Week 11: Day 5 - Capstone: Full-Stack Next.js Project

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Week 11 Days 1-4

---

## 📚 Learning Objectives

By the end of this capstone, you'll be able to:
- ✅ Build complete full-stack applications
- ✅ Implement SSR, SSG, and ISR
- ✅ Create production-ready APIs
- ✅ Deploy to production
- ✅ Monitor and optimize performance

---

## 🎯 Project Overview

Build a **SaaS Task Management Application** with:
- User authentication (JWT)
- Real-time task updates
- Database persistence
- Admin dashboard
- Mobile responsive design
- Production deployment

---

## 1️⃣ Project Setup

### Initialize Project

```bash
# Create Next.js app with TypeScript
npx create-next-app@latest taskly --typescript --tailwind --app

cd taskly

# Install dependencies
npm install mongoose bcryptjs jsonwebtoken dotenv
npm install -D prisma @prisma/client
```

### Environment Setup

```env
# .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskly
JWT_SECRET=your-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret
NODE_ENV=development
```

### Database Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("MONGODB_URI")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  description String?
  completed Boolean  @default(false)
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  dueDate   DateTime?
  priority  String   @default("medium") // low, medium, high
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 2️⃣ Authentication System

### User Model & Registration

```javascript
// app/api/auth/register/route.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validate
    if (!email || !password || !name) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    return Response.json({
      user: { id: user.id, email: user.email, name: user.name }
    }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

### Login Endpoint

```javascript
// app/api/auth/login/route.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return Response.json({ token, user: { id: user.id, email, name: user.name } });
  } catch (error) {
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
```

---

## 3️⃣ Task Management API

### CRUD Operations

```javascript
// app/api/tasks/route.js
import { verifyAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'desc' }
  });

  return Response.json(tasks);
}

export async function POST(request) {
  const user = await verifyAuth(request);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, dueDate, priority } = await request.json();

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      userId: user.userId
    }
  });

  return Response.json(task, { status: 201 });
}

// app/api/tasks/[id]/route.js
export async function PUT(request, { params }) {
  const user = await verifyAuth(request);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();

  const task = await prisma.task.updateMany({
    where: { id: params.id, userId: user.userId },
    data
  });

  if (task.count === 0) {
    return Response.json({ error: 'Task not found' }, { status: 404 });
  }

  return Response.json(task);
}

export async function DELETE(request, { params }) {
  const user = await verifyAuth(request);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.task.deleteMany({
    where: { id: params.id, userId: user.userId }
  });

  return Response.json({ deleted: true });
}
```

---

## 4️⃣ Frontend Pages

### Dashboard

```jsx
// app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  async function addTask(title) {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
  }

  async function toggleTask(id, completed) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !completed })
    });
    const updated = await res.json();
    setTasks(tasks.map(t => t.id === id ? updated : t));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>My Tasks</h1>
      
      <input 
        type="text"
        placeholder="Add a new task"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTask(e.target.value);
            e.target.value = '';
          }
        }}
      />

      <div className="tasks">
        {tasks.map(task => (
          <div key={task.id} className="task">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, task.completed)}
            />
            <span className={task.completed ? 'completed' : ''}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5️⃣ Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

---

## 📝 Deliverables

Create `PROJECT_README.md`:

```markdown
# Taskly - Task Management SaaS

## Features
- ✅ User authentication
- ✅ Create, read, update, delete tasks
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Mobile optimized

## Tech Stack
- Next.js 14
- TypeScript
- Prisma ORM
- MongoDB
- Tailwind CSS

## Getting Started
1. Clone repo
2. Install dependencies
3. Setup MongoDB
4. Add .env.local
5. npm run dev

## Deployment
Deployed on Vercel: [your-url].vercel.app
```

---

## ✅ Submission Checklist

- [ ] User registration & login
- [ ] Task CRUD operations
- [ ] Protected routes
- [ ] Responsive dashboard
- [ ] Database persistence
- [ ] Error handling
- [ ] Production build
- [ ] README documentation

---

## 🔗 Next Steps

**Next Week (Week 12):** Testing & CI/CD  
**Congratulations:** You've mastered Next.js!
   - Contact form

## Project Selection Guide

### Good Projects to Showcase

✅ **Full-Stack Applications**
- Frontend + Backend + Database
- Real-world functionality
- Deployed and working

✅ **Problem-Solving Projects**
- Unique solutions
- Technical challenges overcome
- Performance optimizations

✅ **Collaborative Work**
- Worked with teams
- Shows communication
- Version control usage

✅ **Learning Projects**
- Demonstrates new skills
- Well-documented
- Clear progression

### Projects to Avoid

❌ Todo apps (unless unique)
❌ Unfinished projects
❌ Course assignments (without permission)
❌ Copy-paste tutorials
❌ No documentation

## Portfolio Project Template

```markdown
# Project Name

**Live Demo:** [Link]  
**Repository:** [GitHub Link]  
**Technologies:** React, Node.js, PostgreSQL

## Problem
What problem does this solve?

## Solution
How did you solve it?

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Technical Details
- Architecture decisions
- Challenges and solutions
- Performance metrics

## What I Learned
- New skills gained
- Best practices applied
- What would you do differently

## How to Use
Installation and usage instructions
```

## GitHub Profile Optimization

### Profile README
```markdown
# Hi there 👋

I'm a full-stack developer passionate about building 
scalable applications.

## 🔧 Technologies
- JavaScript, React, Node.js
- PostgreSQL, MongoDB
- Docker, AWS

## 🎯 Featured Projects
- [Project 1](link) - Brief description
- [Project 2](link) - Brief description

## 📊 Stats
![GitHub stats](...)

## 📫 How to reach me
- Email: your@email.com
- LinkedIn: [Profile](link)
- Website: [Portfolio](link)
```

### Best Practices
- Pin 3-5 best repositories
- Write clear README files
- Use GitHub Pages for projects
- Keep repos well-documented
- Regular commits (not all at once)
- Write meaningful commit messages

## Resume Tips

### Technical Resume

```
John Doe
john@example.com | github.com/johndoe | linkedin.com/in/johndoe

EXPERIENCE

Senior Software Engineer @ TechCorp (2021-Present)
- Led migration to microservices (40% faster deployments)
- Mentored 3 junior developers
- Improved test coverage from 45% to 92%

SKILLS
Languages: JavaScript, Python, SQL
Frontend: React, Vue, HTML/CSS
Backend: Node.js, Express, Django
Databases: PostgreSQL, MongoDB, Redis
Tools: Docker, Kubernetes, Git

PROJECTS

Full-Stack E-commerce Platform
React | Node.js | PostgreSQL | Docker
- Built payment integration (Stripe)
- Optimized queries reducing load time by 60%
- Deployed with Docker and AWS

EDUCATION
BS Computer Science, State University (2018)
```

## LinkedIn Optimization

### Profile Sections
- Clear headshot
- Compelling headline (include keywords)
- Detailed about section
- Rich experience descriptions
- Skills endorsements
- Recommendations
- Featured projects
- Active engagement

## Building Your Online Presence

### Start With
1. **Portfolio Website** (2 weeks)
   - Clean design
   - Mobile responsive
   - Working projects

2. **GitHub Optimization** (1 week)
   - Best projects pinned
   - Great README files
   - Active contributions

3. **Resume/CV** (1 week)
   - Quantified achievements
   - Keywords for ATS
   - Tailored for roles

4. **LinkedIn Profile** (1 week)
   - Complete profile
   - Professional photo
   - Regular updates

5. **Social Presence** (Ongoing)
   - Twitter/X for industry updates
   - Dev.to or Medium blogs
   - Open source contributions

## Content Ideas

### Blog Posts
- Project post-mortems
- Technical tutorials
- Tool comparisons
- Learning journey
- Industry insights

### Code Examples
- Useful utilities
- Common patterns
- Performance tips
- Debugging guides
- Architecture decisions

### Social Content
- Project announcements
- Learning milestones
- Industry news comments
- Help others solve problems
- Share resources

## Portfolio Project Checklist

For each project:
- [ ] Live demo working
- [ ] GitHub repo polished
- [ ] README comprehensive
- [ ] Code well-commented
- [ ] Tests passing
- [ ] No secrets in repo
- [ ] Description accurate
- [ ] Screenshots included
- [ ] Performance acceptable
- [ ] Mobile responsive

## 30-Day Portfolio Plan

**Week 1:** Planning & Design
- [ ] Choose 3-5 projects
- [ ] Design portfolio layout
- [ ] Gather content

**Week 2:** Build Website
- [ ] Develop portfolio site
- [ ] Add projects
- [ ] Deploy (Netlify/Vercel)

**Week 3:** Polish GitHub
- [ ] Update READMEs
- [ ] Pin best projects
- [ ] Create profile README

**Week 4:** Optimize Everything
- [ ] Update resume
- [ ] Complete LinkedIn
- [ ] Write first blog post

## ✅ Checkpoint

- [ ] Plan portfolio projects
- [ ] Have 3-5 solid projects
- [ ] Portfolio website planned
- [ ] GitHub optimized
- [ ] Resume updated
- [ ] First blog post ideas

**Next:** Week 11 Capstone Project! 🚀

