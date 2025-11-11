# Week 12: Day 4 - Team Collaboration

**Duration:** 2 hours  
**Difficulty:** ⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Understand team dynamics
- Know communication best practices
- Be able to work in agile teams
- Understand version control workflows

## Topics

- Team communication
- Git workflows
- Code review culture
- Documentation
- Agile methodology
- Conflict resolution

## Effective Team Communication

### Daily Standup

```
Format: 15 minutes max
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

