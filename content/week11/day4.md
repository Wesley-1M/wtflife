# Week 11: Day 4 - Code Review & Best Practices

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Understand code review best practices
- Know what to look for in code
- Be able to give constructive feedback
- Know how to receive feedback

## Topics

- Code review process
- Checklist for reviewers
- Giving feedback
- Receiving feedback
- Common issues

## Code Review Checklist

### Functionality
- [ ] Does the code do what it's supposed to?
- [ ] Are edge cases handled?
- [ ] Are there any obvious bugs?
- [ ] Is error handling present?

### Performance
- [ ] Are there obvious performance issues?
- [ ] Is the algorithm efficient?
- [ ] Are there unnecessary loops/queries?
- [ ] Is caching used appropriately?

### Readability
- [ ] Is the code easy to understand?
- [ ] Are variable names clear?
- [ ] Are comments helpful?
- [ ] Is code formatted consistently?

### Testing
- [ ] Are tests comprehensive?
- [ ] Do tests cover edge cases?
- [ ] Are tests maintainable?
- [ ] Is code coverage adequate?

### Security
- [ ] Is input validated?
- [ ] Are secrets secure?
- [ ] Is there SQL injection risk?
- [ ] Are permissions checked?

### Maintainability
- [ ] Is code DRY (Don't Repeat Yourself)?
- [ ] Could it be simplified?
- [ ] Are dependencies manageable?
- [ ] Is documentation updated?

## Example Code Review

### Bad Code
```javascript
// ❌ Issues: Hard to read, no error handling, inefficient
function p(a) {
  let r = [];
  for(let i=0; i<a.length; i++) {
    if(a[i].a > 5) {
      r.push(a[i]);
    }
  }
  return r;
}
```

### Good Code
```javascript
// ✅ Clear, well-tested, documented
/**
 * Filters users by minimum age
 * @param {Array} users - Array of user objects
 * @param {number} minAge - Minimum age threshold
 * @returns {Array} Filtered users
 */
function filterUsersByAge(users, minAge) {
  if (!Array.isArray(users)) {
    throw new Error('Users must be an array');
  }
  
  return users.filter(user => user.age > minAge);
}

// Tests
test('filters users above minimum age', () => {
  const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 17 },
    { name: 'Charlie', age: 30 }
  ];
  
  const result = filterUsersByAge(users, 18);
  expect(result).toEqual([
    { name: 'Alice', age: 25 },
    { name: 'Charlie', age: 30 }
  ]);
});
```

## Constructive Feedback Examples

### ❌ Bad feedback
```
"This is terrible code. Who wrote this?"
"This won't work."
"This is inefficient."
```

### ✅ Good feedback
```
"I see what you're trying to do here. Have you 
considered using a more efficient algorithm? 
This approach is O(n²) but we could do it in 
O(n log n) with a sorted structure."

"Great work on error handling! One suggestion: 
we could extract this validation logic into a 
separate function for reusability."

"Thanks for the thorough tests! I noticed we're 
not testing the case where the array is empty. 
Should we add that?"
```

## Code Review Guidelines

### For Reviewers

```
1. Review code, not the person
2. Ask questions, don't make accusations
3. Suggest improvements, don't demand them
4. Praise good code
5. Focus on important issues first
6. Explain the 'why' behind feedback
7. Be respectful of different approaches
8. Respond promptly
```

### For Authors

```
1. Don't take feedback personally
2. Ask for clarification if confused
3. Explain your reasoning if questioned
4. Update code based on feedback
5. Thank reviewers for their time
6. Don't force merge without approval
7. Ask for help if stuck
8. Learn from feedback
```

## Common Review Comments

### Performance Issues
```javascript
// ❌ Bad: N+1 query problem
async function getPostsWithComments() {
  const posts = await db.query('SELECT * FROM posts');
  for (let post of posts) {
    post.comments = await db.query(
      'SELECT * FROM comments WHERE post_id = ?',
      [post.id]
    );
  }
  return posts;
}

// ✅ Good: Single query with joins
async function getPostsWithComments() {
  return db.query(`
    SELECT p.*, c.* FROM posts p
    LEFT JOIN comments c ON p.id = c.post_id
  `);
}
```

### Error Handling
```javascript
// ❌ Bad: Silent failure
function parseJSON(str) {
  return JSON.parse(str);
}

// ✅ Good: Proper error handling
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    logger.error('Invalid JSON', { input: str, error: err });
    throw new Error('Failed to parse JSON');
  }
}
```

### Testing
```javascript
// ❌ Bad: Only happy path tested
test('create user', () => {
  const user = createUser({ name: 'John', email: 'john@example.com' });
  expect(user.name).toBe('John');
});

// ✅ Good: Multiple cases tested
test('create user with valid data', () => {
  const user = createUser({ name: 'John', email: 'john@example.com' });
  expect(user.name).toBe('John');
});

test('create user with invalid email', () => {
  expect(() => {
    createUser({ name: 'John', email: 'invalid' });
  }).toThrow('Invalid email');
});

test('create user with missing name', () => {
  expect(() => {
    createUser({ email: 'john@example.com' });
  }).toThrow('Name required');
});
```

## Review Template

```markdown
## Summary
Brief description of what was changed

## What's Working Well
- Point 1
- Point 2

## Suggestions for Improvement
1. **Performance**: Consider...
2. **Readability**: Suggest...
3. **Testing**: Add test for...

## Questions
- Question 1?
- Question 2?

## Approval
Approved with suggested changes
```

## Best Practices

- Review within 24 hours
- Keep reviews focused (< 400 lines)
- Test locally when possible
- Use automated tools (linters, type checkers)
- Have clear standards (style guide, testing requirements)
- Rotate reviewers for knowledge sharing
- Archive important discussions

## ✅ Checkpoint

- [ ] Know code review checklist
- [ ] Can give constructive feedback
- [ ] Can receive feedback well
- [ ] Know automated tools
- [ ] Can follow best practices

**Next:** Portfolio Building! 💼

