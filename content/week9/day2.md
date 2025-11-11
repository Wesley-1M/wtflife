# Week 9: Day 2 - Databases & Data Models

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Databases

- SQL (PostgreSQL, MySQL)
- NoSQL (MongoDB)
- ORMs (Sequelize, Typeorm)
- ODMs (Mongoose)

## Example

```javascript
// MongoDB with Mongoose
const schema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model('User', schema);

// Create
await User.create({ name: 'John', email: 'john@example.com' });

// Read
const user = await User.findById(id);

// Update
await User.findByIdAndUpdate(id, { name: 'Jane' });

// Delete
await User.findByIdAndDelete(id);
```

## ✅ Checkpoint

- [ ] Know database types
- [ ] Can use ORM/ODM
- [ ] Understand CRUD
- [ ] Know queries

**Next:** Authentication! 🚀

