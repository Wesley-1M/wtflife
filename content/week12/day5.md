# Week 12: Day 5 - Capstone: Complete Testing & Deployment

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)

---

## 📚 Learning Objectives

By the end of this capstone, you'll be able to:
- ✅ Build comprehensive test suites
- ✅ Set up complete CI/CD pipelines
- ✅ Deploy applications to production
- ✅ Monitor application health
- ✅ Handle production issues

---

## 🎯 Project Overview

Create a **Production-Ready Social Media Dashboard** with:
- Unit, integration, and E2E tests
- Full CI/CD pipeline
- Automated deployments
- Production monitoring
- 80%+ code coverage

---

## 1️⃣ Project Setup

### Initialize Project

```bash
# Create Next.js app with full setup
npx create-next-app@latest social-dashboard --typescript --tailwind --app

cd social-dashboard

# Install testing dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D @next/env

# Install production dependencies
npm install axios zustand date-fns
```

### Test Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

---

## 2️⃣ Unit & Integration Tests

### Component Tests

```jsx
// app/components/UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    avatar: 'john.jpg',
    followers: 1000
  };

  test('renders user information', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1000 followers')).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', () => {
    const onClick = jest.fn();
    render(<UserCard user={mockUser} onClick={onClick} />);
    
    screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledWith(mockUser.id);
  });
});
```

### Hook Tests

```typescript
// hooks/useFeed.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useFeed } from './useFeed';

jest.mock('axios');

test('fetches feed posts', async () => {
  const { result } = renderHook(() => useFeed());
  
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.posts.length).toBeGreaterThan(0);
});
```

---

## 3️⃣ E2E Tests

### Complete Workflows

```typescript
// e2e/feed.spec.ts
import { test, expect } from '@playwright/test';

test('user views and likes posts', async ({ page, context }) => {
  // Setup: Login
  await context.addCookies([{
    name: 'auth_token',
    value: 'test_token',
    url: 'http://localhost:3000'
  }]);
  
  // Navigate to feed
  await page.goto('/feed');
  
  // Verify posts load
  await expect(page.locator('[data-testid="post"]')).toHaveCount(10);
  
  // Like a post
  const firstPost = page.locator('[data-testid="post"]').first();
  const likeButton = firstPost.locator('button:has-text("Like")');
  await likeButton.click();
  
  // Verify like count increased
  const likeCount = await firstPost.locator('[data-testid="like-count"]').textContent();
  expect(likeCount).toBe('1');
});

test('user searches for users', async ({ page }) => {
  await page.goto('/explore');
  
  const searchInput = page.locator('input[placeholder="Search users"]');
  await searchInput.fill('john');
  
  // Wait for search results
  await page.waitForResponse(r => r.url().includes('/api/search'));
  
  // Verify results appear
  await expect(page.locator('[data-testid="user-result"]')).not.toHaveCount(0);
});
```

---

## 4️⃣ CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  lint:
    runs-on: ubuntu-latest
    name: Lint & Type Check
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm install
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    name: Unit & Integration Tests
    needs: lint
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm install
      - run: npm test -- --coverage
      
      - uses: codecov/codecov-action@v3
        with:
          fail_ci_if_error: true

  build:
    runs-on: ubuntu-latest
    name: Build Application
    needs: test
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm install
      - run: npm run build
      
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next/
          retention-days: 1

  e2e:
    runs-on: ubuntu-latest
    name: E2E Tests
    needs: build
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run dev > /dev/null 2>&1 &
      - run: npx wait-on http://localhost:3000
      - run: npx playwright test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 3

  deploy:
    runs-on: ubuntu-latest
    name: Deploy to Production
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true

  notify:
    runs-on: ubuntu-latest
    name: Notify Team
    if: always()
    needs: [lint, test, build, e2e, deploy]
    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1.24.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "CI/CD Pipeline: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Pipeline Status:* ${{ job.status }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
                  }
                }
              ]
            }
```

---

## 5️⃣ Deployment & Monitoring

### Environment Configuration

```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=mongodb+srv://...
NODE_ENV=production
```

### Production Checklist

```
Deployment Checklist:

Security:
- [ ] Environment variables secured
- [ ] API keys in Vercel secrets
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Dependencies up to date

Performance:
- [ ] Image optimization enabled
- [ ] Caching headers configured
- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals good

Reliability:
- [ ] Error logging configured
- [ ] Uptime monitoring active
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] On-call rotation set

Testing:
- [ ] Coverage > 80%
- [ ] E2E tests passing
- [ ] Staging environment tested
- [ ] Smoke tests on deploy
- [ ] Performance tests passing
```

---

## 📝 Deliverables

### Documentation Files

Create the following files:

1. **TEST_REPORT.md** - Test coverage and results
2. **DEPLOYMENT_GUIDE.md** - Production deployment steps
3. **MONITORING_SETUP.md** - Monitoring and alerting
4. **INCIDENT_RESPONSE.md** - How to handle issues

---

## ✅ Submission Checklist

- [ ] 80%+ code coverage
- [ ] All tests passing (unit, integration, E2E)
- [ ] GitHub Actions CI/CD pipeline working
- [ ] Successful deployment to production
- [ ] Monitoring and alerting configured
- [ ] Documentation complete
- [ ] README with setup instructions
- [ ] Working application with no critical errors

---

## 🔗 Next Steps

**Next Week (Week 13):** Career Preparation & Final Capstone  
**Congratulations:** You've mastered testing and deployment!

### 2. Management Track

**Team Lead (5-8 people)**
- Line manager
- Project leadership
- Salary: $120K-$160K

**Engineering Manager (10-20 people)**
- Multiple teams
- Hiring/firing
- Salary: $140K-$200K

**Director/VP**
- Strategic decisions
- Org structure
- Salary: $200K-$500K+

### 3. Specialized Paths

- **DevOps/Infrastructure:** Similar to IC but 20-30% premium
- **Security:** High demand, 15-25% premium
- **Data Science:** Research focus, competitive salaries
- **Product Management:** Business focus, similar to management

## Setting Career Goals

### SMART Goals

```
Specific: Clear and detailed
Measurable: Quantifiable progress
Achievable: Realistic given resources
Relevant: Aligns with career
Time-bound: Deadline set

❌ "Get better at React"
✅ "Complete Redux course and build 
   3 production apps with advanced 
   state management by Q3"

❌ "Become senior engineer"
✅ "Lead architecture decisions for 2 major 
   features, mentor 1 junior dev, and get 
   promoted to senior within 18 months"
```

### 3-Year Plan

```
Year 1: Foundation
- Master current stack
- Contribute to all service areas
- Build 2-3 portfolio projects
- Grow network (10+ connections/month)
- Salary: $90K → $100K

Year 2: Specialization
- Lead 1 significant project
- Mentor 1-2 junior devs
- Deep dive into 1-2 technologies
- Build personal brand (blog/talks)
- Salary: $100K → $120K

Year 3: Leadership
- Lead multiple projects
- Shape technical decisions
- Build strong portfolio
- Ready for promotion/new opportunity
- Salary: $120K → $150K+
```

## Salary Negotiation

### Research Phase

```javascript
// Salary research sources
- Levels.fyi: Real salaries by company
- Blind: Anonymous employee data
- Glassdoor: Public reviews
- LinkedIn: Market rates
- Salary.com: Calculator

Factors affecting salary:
- Experience level
- Location (SF: +50%, India: -60%)
- Company size (Google: +30%)
- Industry (Finance: +40%)
- Skills (ML/DevOps: +30%)
```

### Negotiation Strategy

```
Before negotiating:
1. Know market rate (do research)
2. Know your value (accomplishments)
3. Get competing offers (if possible)
4. Decide minimum acceptable
5. Decide asking price (20-30% above minimum)

During negotiation:
1. Don't anchor low (they'll anchor lower)
2. Let them make first offer
3. Always counter offer
4. Negotiate total comp (salary + bonus + stock)
5. Get timeline for review/raise

Negotiation template:
"Based on my research, my skills, and 
market rates, I was expecting [$X]. 
I'm excited about this role and flexible 
on total compensation package. 
What can you offer?"

What NOT to say:
- "I need this job"
- "I'll take whatever"
- "My last salary was..."
- "I have other offers" (unless true)
```

### Compensation Breakdown

```
Total Comp = Base + Bonus + Stock + Benefits

Example offer (Senior Engineer):
- Base: $150,000
- Bonus: 20% = $30,000
- Stock: $80,000/year (4-year vesting)
- Benefits: $20,000 (health, 401k, etc)
- Total Year 1: $180,000

Negotiate each component:
- Base: Easier to increase
- Bonus: Depends on performance
- Stock: More risk (company dependent)
- Benefits: Usually fixed
```

## Continuous Learning

### Stay Current

```
Weekly (5-10 hours):
- Read tech articles (Hacker News, Dev.to)
- Follow 5-10 engineers on Twitter
- Read 1 architecture article
- Experiment with 1 new tool

Monthly (5-10 hours):
- Take online course (Udemy, Frontend Masters)
- Build small project with new tech
- Read 1 technical book
- Attend local meetup

Quarterly (10-20 hours):
- Contribute to open source
- Attend conference
- Learn new language/framework
- Complete online certification

Yearly:
- Define learning goals
- Dedicate 5% of time to learning
- Share what you learned
```

### Learning Resources

```
Free:
- YouTube tutorials
- Free Code Camp
- Udacity free courses
- MDN documentation
- Dev.to articles

Paid:
- Udemy ($12-15 courses)
- Pluralsight ($300/year)
- Frontend Masters ($40/month)
- Team Treehouse ($25/month)
- Egghead.io ($80/month)

Conferences:
- ReactConf
- Node Summit
- JSConf
- Conferences in your city
```

## Mentorship

### Finding a Mentor

```
Good mentor:
- 5-10 years ahead of you
- Willing to invest time
- Works in domain you want
- Different background than you
- You respect them

How to ask:
"I admire your work on [project]. 
Would you be open to a brief 
monthly call to discuss my career? 
I'd value your perspective."

Meeting cadence:
- Monthly 1-hour video calls
- Specific topics to discuss
- Actions between calls
- Informal but structured
```

### Being a Mentor

```
Great mentors:
- Listen more than talk
- Ask guiding questions
- Share relevant experiences
- Challenge assumptions
- Create safe space

Mentee support:
- 1 hour/month commitment
- Help with career decisions
- Technical guidance
- Network introductions
- Accountability

Example conversation:
Mentee: "I'm stuck on career direction"
Mentor: "Tell me about what excites you"
        "What are your concerns?"
        "What have you tried?"
        "What would success look like?"
```

## Work-Life Balance

### Green Flags at Company

```
✅ Flexible hours
✅ Remote work option
✅ Unlimited PTO
✅ Mental health support
✅ Clear boundaries
✅ Reasonable on-call
✅ No weekend work expected
✅ Diversity and inclusion
✅ Learning budget
✅ 4-day work week option
```

### Red Flags

```
❌ Always on-call
❌ Weekend/evening work expected
❌ Crunch culture normalized
❌ No work-life boundaries
❌ Toxic management
❌ No career growth
❌ Constantly understaffed
❌ Mandatory overtime
```

### Time Management

```
Work (40-50 hours):
- Focus time: 25 hours
- Meetings: 10 hours
- Admin: 5 hours
- Interruptions: 5-10 hours

Learning (5-10 hours):
- Online courses
- Reading
- Side projects
- Conferences

Personal (40+ hours):
- Family/friends
- Health/exercise
- Hobbies
- Rest

Protect time:
- Block calendar
- Disable notifications
- Batch meetings
- Focus hours
- Regular breaks
```

## ✅ Checkpoint

- [ ] Understand career paths
- [ ] Have 3-year plan
- [ ] Know salary research
- [ ] Can negotiate
- [ ] Have learning plan
- [ ] Found mentor
- [ ] Defined work-life balance

**Next:** Week 12 Capstone Project! 💼

