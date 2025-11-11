# Day 4: Control Flow (If/Else)

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐ Beginner  
**Prerequisites:** Day 1-3 - Basics through Operators  
**By the end:** Your code can make decisions based on conditions

---

## 📚 Overview

So far, your code has executed line-by-line, always doing the same thing. Now let's learn how to **make decisions** - if this happens, do that; otherwise, do something else.

This is called **control flow** or **conditional logic**.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Write** if statements  
✅ **Use** else and else if  
✅ **Understand** when to use which  
✅ **Nest** conditions  
✅ **Debug** conditional code  

---

## 🚦 The `if` Statement

### Basic If Statement

```javascript
if (condition) {
  // Code runs if condition is true
}
```

### Example

```javascript
let age = 20;

if (age >= 18) {
  console.log("You are an adult");
}
```

**Output:** `You are an adult`

### How It Works

1. Check the condition: `age >= 18`
2. If TRUE: Run the code inside the braces `{}`
3. If FALSE: Skip it

---

## 🔀 The `if...else` Statement

### If the condition is false, do something else

```javascript
if (condition) {
  // Code if TRUE
} else {
  // Code if FALSE
}
```

### Example

```javascript
let age = 15;

if (age >= 18) {
  console.log("You are an adult");
} else {
  console.log("You are under 18");
}
```

**Output:** `You are under 18`

---

## 🔀🔀 The `else if` Statement

### Check multiple conditions

```javascript
if (condition1) {
  // Code if condition1 is TRUE
} else if (condition2) {
  // Code if condition1 is FALSE but condition2 is TRUE
} else {
  // Code if all conditions are FALSE
}
```

### Example: Grade Calculator

```javascript
let score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
```

**Output:** `Grade: B`

---

## 🧪 Try It Yourself

### Exercise 1: Even or Odd

```javascript
let number = 7;

if (number % 2 === 0) {
  console.log(number + " is even");
} else {
  console.log(number + " is odd");
}
```

**Try it:** Change the number!

---

## 💪 Practice Exercises

### Exercise 2: Weather Checker

```javascript
let temperature = 72;

if (temperature > 80) {
  console.log("It's hot!");
} else if (temperature > 60) {
  console.log("It's pleasant");
} else {
  console.log("It's cold");
}
```

### Exercise 3: Login Checker

```javascript
let username = "admin";
let password = "password123";

if (username === "admin" && password === "password123") {
  console.log("Login successful!");
} else {
  console.log("Invalid username or password");
}
```

### Exercise 4: Movie Rating

```javascript
let age = 16;

if (age < 13) {
  console.log("You can watch: G and PG movies");
} else if (age < 17) {
  console.log("You can watch: G, PG, and PG-13 movies");
} else {
  console.log("You can watch: Any movie (R and higher)");
}
```

---

## 🎯 Common Patterns

### Pattern 1: Validating User Input

```javascript
let email = "user@example.com";

if (email.includes("@")) {
  console.log("Email looks valid");
} else {
  console.log("Invalid email");
}
```

### Pattern 2: Range Checking

```javascript
let score = 75;

if (score >= 0 && score <= 100) {
  console.log("Score is valid");
} else {
  console.log("Invalid score");
}
```

### Pattern 3: Nested Conditions

```javascript
let isLoggedIn = true;
let isPremium = false;

if (isLoggedIn) {
  if (isPremium) {
    console.log("Access to premium content");
  } else {
    console.log("Access to free content only");
  }
} else {
  console.log("Please log in");
}
```

---

## ⚠️ Common Mistakes

### Mistake 1: Using `=` Instead of `===`

**Wrong:**
```javascript
if (age = 18) {  // ❌ This assigns, doesn't compare!
  console.log("You are 18");
}
```

**Right:**
```javascript
if (age === 18) {  // ✅ This compares
  console.log("You are 18");
}
```

### Mistake 2: Forgetting Braces

**Wrong:**
```javascript
if (age >= 18)
  console.log("You are an adult");
  console.log("This might not work as expected");
```

**Right:**
```javascript
if (age >= 18) {
  console.log("You are an adult");
  console.log("This works correctly");
}
```

### Mistake 3: Unreachable Code

**Wrong:**
```javascript
if (true) {
  console.log("First");
} else if (true) {
  console.log("Second");  // ❌ Never runs
}
```

**Right:**
```javascript
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teen");  // ✅ Can run
}
```

---

## 🏆 Checkpoint

Before moving to Day 5, make sure you can:

- ✅ Write if statements
- ✅ Use else and else if
- ✅ Compare values correctly
- ✅ Use logical operators in conditions
- ✅ Nest conditions
- ✅ Avoid common mistakes

**Can you do all of these?** If yes, you're ready for Day 5! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐ (Easy)  
**Next Lesson:** Day 5 - Functions & Reusable Code
