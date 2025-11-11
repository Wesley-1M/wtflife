# Day 2: Objects - Organizing Related Data

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐ Beginner  
**Prerequisites:** Week 1 + Day 1 of Week 2  
**By the end:** You'll create and work with objects to organize related data

---

## 📚 Overview

Arrays are great for lists, but what if you need to **organize related data** like a person's information?

**With arrays (confusing):**
```javascript
let person = ["Sarah", 28, "New York", "Engineer"];
// Which index is the age? The city?
```

**With objects (clear):**
```javascript
let person = {
  name: "Sarah",
  age: 28,
  city: "New York",
  job: "Engineer"
};
// Clear what each value represents!
```

Objects use **keys** (names) to describe values, making code much more readable.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Create** objects with key-value pairs  
✅ **Access** object properties  
✅ **Modify** object properties  
✅ **Add** new properties to objects  
✅ **Delete** properties from objects  

---

## 🎁 What is an Object?

An object is a **collection of key-value pairs** that represent related data.

```javascript
let object = {
  key1: value1,
  key2: value2,
  key3: value3
};
```

---

## 🔨 Creating Objects

### Basic Syntax

```javascript
let person = {
  name: "Sarah",
  age: 28,
  city: "New York"
};
```

### Example 1: Person Object

```javascript
let student = {
  firstName: "Alice",
  lastName: "Johnson",
  age: 20,
  gpa: 3.8,
  enrolled: true
};

console.log(student);
```

### Example 2: Product Object

```javascript
let product = {
  id: 101,
  name: "Laptop",
  price: 999.99,
  inStock: true,
  brand: "TechCorp"
};

console.log(product);
```

### Example 3: Empty Object

```javascript
let empty = {};
console.log(empty);
```

---

## 🔑 Accessing Object Properties

Use **dot notation** to access a property:

```javascript
let person = {
  name: "Sarah",
  age: 28,
  city: "New York"
};

console.log(person.name);   // Sarah
console.log(person.age);    // 28
console.log(person.city);   // New York
```

### Alternative: Bracket Notation

```javascript
let person = {
  name: "Sarah",
  age: 28
};

console.log(person["name"]);  // Sarah
console.log(person["age"]);   // 28
```

**Tip:** Use dot notation (cleaner) unless the key has spaces or special characters.

---

## ✏️ Modifying Properties

### Change Existing Property

```javascript
let person = {
  name: "Sarah",
  age: 28
};

person.age = 29;
console.log(person.age);  // 29
```

### Add New Property

```javascript
let person = {
  name: "Sarah",
  age: 28
};

person.email = "sarah@example.com";
console.log(person);
// {name: "Sarah", age: 28, email: "sarah@example.com"}
```

### Delete Property

```javascript
let person = {
  name: "Sarah",
  age: 28,
  email: "sarah@example.com"
};

delete person.email;
console.log(person);
// {name: "Sarah", age: 28}
```

---

## 🧪 Try It Yourself

### Exercise 1: Create and Access

```javascript
let car = {
  make: "Toyota",
  model: "Camry",
  year: 2022,
  color: "blue"
};

console.log(car.make);   // Toyota
console.log(car.model);  // Camry
console.log(car.year);   // 2022
```

**Try it:** Create your own object!

---

## 💪 Practice Exercises

### Exercise 2: Update Object

```javascript
let book = {
  title: "JavaScript Basics",
  author: "John Doe",
  pages: 300,
  published: 2020
};

// Access properties
console.log("Title:", book.title);
console.log("Author:", book.author);

// Modify property
book.pages = 350;

// Add new property
book.isbn = "978-1234567890";

console.log(book);
```

### Exercise 3: User Profile

```javascript
let user = {
  username: "alice_wonder",
  email: "alice@example.com",
  followerCount: 1500,
  verified: true
};

// Display user info
console.log("User:", user.username);
console.log("Email:", user.email);
console.log("Followers:", user.followerCount);

// Update follower count
user.followerCount = 1600;

// Add a new property
user.joinDate = "2022-03-15";

console.log(user);
```

### Exercise 4: Nested Objects

```javascript
let company = {
  name: "TechCorp",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA"
  },
  employees: 150,
  founded: 2010
};

console.log(company.name);              // TechCorp
console.log(company.address.city);      // San Francisco
console.log(company.address.state);     // CA
```

---

## 🎯 Objects vs Arrays

| Use Case | Arrays | Objects |
|----------|--------|---------|
| **List of items** | ✅ Best | ❌ Not ideal |
| **Organized data** | ❌ Confusing | ✅ Best |
| **Accessing by position** | ✅ Easy | ❌ Hard |
| **Accessing by name** | ❌ Hard | ✅ Easy |

**Example:**
```javascript
// Arrays - for lists
let colors = ["red", "green", "blue"];

// Objects - for organized data
let person = {name: "Sarah", age: 28};
```

---

## 🏆 Checkpoint

Before moving to Day 3, make sure you can:

- ✅ Create objects with key-value pairs
- ✅ Access properties using dot notation
- ✅ Modify existing properties
- ✅ Add new properties to objects
- ✅ Delete properties from objects
- ✅ Use bracket notation when needed
- ✅ Understand when to use objects vs arrays

**Can you do all of these?** If yes, you're ready for Day 3! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐ (Easy)  
**Next Lesson:** Day 3 - Array Methods
