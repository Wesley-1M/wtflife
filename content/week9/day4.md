# Week 9: Day 4 - Error Handling & Validation

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 9 Days 1-3

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Handle errors gracefully
- ✅ Validate user input
- ✅ Create custom error classes
- ✅ Implement error boundaries
- ✅ Log and monitor errors

---

## 1️⃣ Backend Error Handling

```javascript
// Custom error class
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Express error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message
  });
});
```

---

## 2️⃣ Input Validation

```bash
npm install joi
```

```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(18).max(150)
});

app.post('/register', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Process validated data
});
```

---

## 3️⃣ Frontend Error Boundaries

```jsx
// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 4️⃣ API Error Handling

```javascript
// Fetch with error handling
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

---

## 5️⃣ Logging & Monitoring

```javascript
// Simple logger
function logError(error, context) {
  const log = {
    timestamp: new Date(),
    message: error.message,
    stack: error.stack,
    context
  };
  
  console.error(log);
  // Send to external service
}

// Usage
try {
  await riskyOperation();
} catch (error) {
  logError(error, { action: 'fetch-data' });
}
```

---

## 📝 Practice Exercises

### Exercise 1: Input Validation
Build form with comprehensive validation

### Exercise 2: Error Boundaries
Create error boundary component

### Exercise 3: API Errors
Handle different API error types

### Exercise 4: Error Logging
Implement error logging system

---

## ✅ Summary

- **Validation** prevents bad data
- **Error boundaries** catch crashes
- **Custom errors** provide context
- **Logging** aids debugging
- **Graceful degradation** improves UX
- **Monitoring** catches production issues

---

## 🔗 Next Steps

**Tomorrow (Day 5):** Capstone Project  
**Continue:** Build robust applications!

```javascript
const { graphqlHTTP } = require('express-graphql');

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Query {
      user(id: Int): User
      users: [User]
    }
    
    type Mutation {
      createUser(name: String): User
    }
    
    type User {
      id: Int
      name: String
      email: String
    }
  `),
  rootValue: {
    user: ({ id }) => ({ id, name: 'John' }),
    users: () => [{ id: 1, name: 'John' }]
  }
}));
```

## ✅ Checkpoint

- [ ] Know REST conventions
- [ ] Understand GraphQL
- [ ] Can build APIs
- [ ] Know differences

**Next:** Testing & Deployment! 🚀

