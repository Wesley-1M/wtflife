# Week 9: Day 4 - REST APIs & GraphQL

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## REST APIs

```javascript
// RESTful conventions
app.get('/api/users', (req, res) => {}); // List
app.post('/api/users', (req, res) => {}); // Create
app.get('/api/users/:id', (req, res) => {}); // Get
app.put('/api/users/:id', (req, res) => {}); // Update
app.delete('/api/users/:id', (req, res) => {}); // Delete
```

## GraphQL

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

