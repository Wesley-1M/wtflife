# Week 12: Day 4 - CI/CD Pipelines with GitHub Actions

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 12 Days 1-3

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Create GitHub Actions workflows
- ✅ Automate testing on every commit
- ✅ Deploy applications automatically
- ✅ Monitor CI/CD pipelines
- ✅ Handle deployment failures

---

## 1️⃣ CI/CD Fundamentals

### What is CI/CD?

```
CI/CD Pipeline:

Code Commit
    ↓
Run Tests
    ↓
Build Application
    ↓
Deploy to Staging
    ↓
Run E2E Tests
    ↓
Deploy to Production
    ↓
Monitor
```

### Benefits

```
✅ Automated testing catches bugs early
✅ Consistent deployments
✅ Faster feedback loop
✅ Reduced manual errors
✅ Always production-ready code
```

---

## 2️⃣ GitHub Actions Setup

### Workflow File

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

### Secrets & Environment

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

env:
  NODE_ENV: production

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npm run build
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm install -g vercel
          vercel --prod --token $VERCEL_TOKEN
```

---

## 3️⃣ Testing in CI/CD

### Unit Tests

```yaml
name: Unit Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm install
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

### E2E Tests

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npx playwright install --with-deps
      
      - name: Start application
        run: npm run dev &
      
      - name: Wait for app
        run: npx wait-on http://localhost:3000
      
      - name: Run E2E tests
        run: npx playwright test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 4️⃣ Build & Deployment

### Build Workflow

```yaml
name: Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm install
      
      - run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
```

### Deploy to Vercel

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Deploy to Docker

```yaml
name: Build and Push Docker

on:
  push:
    branches: [ main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: docker/setup-buildx-action@v2
      
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/myapp:latest
            ${{ secrets.DOCKER_USERNAME }}/myapp:${{ github.sha }}
```

---

## 5️⃣ Advanced Workflows

### Multi-Stage Pipeline

```yaml
name: Full CI/CD

on:
  push:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install && npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install && npm test

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install && npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: echo "Deploying..."
```

### Matrix Strategy

```yaml
name: Test Multiple Node Versions

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm install
      - run: npm test
```

---

## 6️⃣ Notifications & Status

### Slack Notification

```yaml
name: Notify Slack

on:
  push:
    branches: [ main ]

jobs:
  notify:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Notify deployment
        uses: slackapi/slack-github-action@v1.24.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Deployment Status: ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Commit: ${{ github.sha }}\nAuthor: ${{ github.actor }}"
                  }
                }
              ]
            }
```

---

## 📝 Practice Exercises

### Exercise 1: Test Workflow
Create GitHub Actions workflow for testing

### Exercise 2: Build & Deploy
Automate build and deployment process

### Exercise 3: Multi-Stage Pipeline
Create complex pipeline with dependencies

### Exercise 4: Monitoring
Add notifications and status checks

---

## ✅ Summary

- **GitHub Actions** automates CI/CD
- **Workflows** define pipeline steps
- **Secrets** secure sensitive data
- **Artifacts** store build outputs
- **Matrix** tests multiple configurations
- **Notifications** keep team informed

---

## 🔗 Next Steps

**Tomorrow (Day 5):** Capstone - Complete Testing & Deployment  
**Continue:** Automate everything!
Structure:
1. What did you do yesterday?
2. What are you doing today?
3. Any blockers?

Bad: "I fixed bugs"
Good: "Optimized API query (60% faster), 
       working on auth endpoint, 
       blocked on database schema review"
```

### Code Review Culture

```javascript
// Strong review culture means:
- ALL code reviewed by at least 1 person
- Focus on quality, not speed
- Respectful, constructive feedback
- Clear approval process
- Merged when approved + tests pass

// Review comments
❌ Bad: "This is wrong"
✅ Good: "I'm concerned about the N+1 
         query here. Can we batch load 
         the related items instead?"

❌ Bad: "Change this variable name"
✅ Good: "This variable name could be 
         more descriptive. How about 
         'cachedUserProfiles'?"
```

## Git Workflow

### Git Flow (Structured)

```
main (production)
  ↑
release/1.0.0 (staging)
  ↑
develop (integration)
  ↑
feature/user-auth (feature branches)
feature/payment-integration
bugfix/login-error
```

### GitHub Flow (Simple)

```
main (always deployable)
  ↑
feature/new-feature (feature branch)
  ↑
Pull Request → Review → Merge → Deploy
```

### Commands

```bash
# Create feature branch
git checkout -b feature/user-auth

# Make changes
git add .
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/user-auth

# Create pull request
# Get reviewed and approved

# Merge to main
git checkout main
git merge feature/user-auth
git push origin main

# Delete branch
git branch -d feature/user-auth
```

## Commit Message Standards

```
Format: <type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting, missing semicolons
- refactor: Code restructuring
- perf: Performance improvement
- test: Adding/updating tests

Examples:
✅ feat(auth): add JWT token refresh
✅ fix(api): handle null response in user endpoint
✅ refactor(database): optimize query performance
❌ fixed stuff
❌ update code
```

## Documentation

### Code Comments

```javascript
// ❌ Bad: Obvious comment
const age = 25; // age is 25

// ✅ Good: Explains why
const SIGNUP_DISCOUNT = 0.15; // 15% discount for new users

// ✅ Good: Complex logic explained
// Batch load users to avoid N+1 query problem.
// Group by user_id, then fetch all at once
const userIds = posts.map(p => p.user_id);
const users = await User.find({ id: { $in: userIds } });

// ❌ Bad: No docstring
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: Documented
/**
 * Calculates the total price of items
 * @param {Array} items - Array of items with price property
 * @returns {Number} Total price
 */
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### README Template

```markdown
# Project Name

Brief description of what this project does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
```bash
npm install
npm run dev
```

## Usage
Basic usage example

## API Documentation
Link to API docs or inline

## Testing
```bash
npm test
```

## Contributing
How to contribute

## License
License information
```

## Agile Ceremonies

### Sprint Planning
- **Duration:** 1-2 hours
- **Goal:** Decide what to work on this sprint
- **Output:** Sprint backlog with story points

### Daily Standup
- **Duration:** 15 minutes
- **Goal:** Sync on progress and blockers
- **Who:** Whole team

### Sprint Review
- **Duration:** 1 hour
- **Goal:** Demo completed work
- **Output:** Feedback for next sprint

### Sprint Retrospective
- **Duration:** 1 hour
- **Goal:** Reflect on process improvements
- **Output:** Action items for next sprint

## Kanban Board

```
Backlog → Todo → In Progress → Review → Done

Example:
BACKLOG
- [ ] User profile page
- [ ] Payment integration
- [ ] Email notifications

TODO
- [x] Setup project structure
- [ ] Auth system

IN PROGRESS
- [x] Database schema (John)
- [ ] API endpoints (Sarah)

REVIEW
- [x] Login form (waiting on John)

DONE
- [x] Project initialization
- [x] Environment setup
```

## Conflict Resolution

### Scenario 1: Disagreement on Architecture

```
❌ Don't: Argue in the PR, reject code
✅ Do: Schedule discussion, document decision

Process:
1. Acknowledge different perspectives
2. Discuss pros/cons of each approach
3. Make decision based on data
4. Document in ADR (Architecture Decision Record)
5. Move forward together
```

### Scenario 2: Slow Code Review

```
❌ Don't: Complain about reviewer
✅ Do: Discuss review process

Process:
1. Check if reviewer is overloaded
2. Offer to help review others' PRs
3. Set expectations (24-48 hour response)
4. Rotate reviewers if needed
5. Use automated checks to reduce review load
```

### Scenario 3: Missed Deadline

```
Process:
1. Identify the issue early (not day before)
2. Communicate transparently
3. Adjust scope or timeline
4. Get team consensus
5. Prevent similar issues in future
```

## Remote Team Best Practices

```
✅ Asynchronous communication
- Document decisions in shared docs
- Leave comments in PRs, not Slack
- Use time zone-friendly meetings
- Record important discussions

✅ Written communication
- Clearer than verbal
- Searchable later
- Time zone friendly
- Less interruptions

✅ Regular check-ins
- 1:1s with manager
- Team syncs (at least 1x/week)
- Informal social time
- Stay connected despite distance

❌ Over-communication
- Don't interrupt with Slack
- Batch updates
- Let people focus

❌ Assumptions
- Ask for clarification
- Confirm understanding
- Document agreements
```

## Team Metrics

```
✅ Track
- Deployment frequency
- Lead time for changes
- Mean time to recovery
- Change failure rate
- Code review time

❌ Don't track
- Lines of code written
- Hours worked
- Commits per person
- Issues closed (without context)
```

## ✅ Checkpoint

- [ ] Understand team communication
- [ ] Know Git workflows
- [ ] Can write good commits
- [ ] Understand agile process
- [ ] Can resolve conflicts

**Next:** Career Development! 🚀

