# Day 5: Functions & Reusable Code

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐ Beginner-Intermediate  
**Prerequisites:** Day 1-4 - All basics  
**By the end:** You'll create reusable functions to organize your code

---

## 📚 Overview

Imagine you need to greet 100 people. Would you write `console.log("Hello, Sarah"); console.log("Hello", "John"); ...` 100 times?

**No!** That's where **functions** come in. Functions let you write code once and use it many times.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Create** functions  
✅ **Call** functions with arguments  
✅ **Return** values from functions  
✅ **Understand** function scope  
✅ **Debug** functions  

---

## 🎯 What is a Function?

A function is a **reusable block of code** that performs a specific task.

### Without Functions

```javascript
console.log("Hello, Sarah");
console.log("Hello, John");
console.log("Hello, Alex");
console.log("Hello, Maria");
```

### With Functions

```javascript
function greet(name) {
  console.log("Hello, " + name);
}

greet("Sarah");
greet("John");
greet("Alex");
greet("Maria");
```

Much better! You write the logic once and reuse it.

---

## 🔨 Creating Functions

### Basic Function Syntax

```javascript
function functionName(parameter1, parameter2) {
  // Code to execute
  return value;  // Optional
}
```

### Example 1: Simple Function

```javascript
function sayHello() {
  console.log("Hello!");
}

sayHello();  // Calls the function
```

**Output:** `Hello!`

### Example 2: Function with Parameters

```javascript
function greet(name) {
  console.log("Hello, " + name);
}

greet("Sarah");   // Output: Hello, Sarah
greet("John");    // Output: Hello, John
```

### Example 3: Function with Return Value

```javascript
function add(a, b) {
  return a + b;
}

let result = add(5, 3);
console.log(result);  // 8
```

---

## 📥 Parameters vs Arguments

- **Parameters** = Variables in the function definition
- **Arguments** = Values you pass when calling the function

```javascript
function add(a, b) {
  //       ↑ parameters
  return a + b;
}

add(5, 3);
//  ↑ arguments
```

---

## 🔄 The `return` Statement

The `return` statement:
- Sends a value back to where the function was called
- Stops the function immediately

```javascript
function multiply(a, b) {
  let result = a * b;
  return result;       // Sends back the result
  console.log("This doesn't run");  // ❌ Never runs
}

let product = multiply(4, 5);
console.log(product);  // 20
```

---

## 🧪 Try It Yourself

### Exercise 1: Simple Function

```javascript
function greet(name) {
  console.log("Welcome, " + name + "!");
}

greet("Alice");
greet("Bob");
```

**Try it:** Call the function with different names!

---

## 💪 Practice Exercises

### Exercise 2: Calculator Functions

```javascript
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

console.log(add(10, 5));       // 15
console.log(subtract(10, 5));  // 5
console.log(multiply(10, 5));  // 50
```

### Exercise 3: Age Checker

```javascript
function isAdult(age) {
  if (age >= 18) {
    return true;
  } else {
    return false;
  }
}

// Shorter version:
function isAdult(age) {
  return age >= 18;
}

console.log(isAdult(25));  // true
console.log(isAdult(15));  // false
```

### Exercise 4: Temperature Converter

```javascript
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

console.log(celsiusToFahrenheit(0));    // 32
console.log(celsiusToFahrenheit(100));  // 212
console.log(fahrenheitToCelsius(32));   // 0
```

### Exercise 5: String Functions

```javascript
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getLength(str) {
  return str.length;
}

console.log(capitalize("javascript"));  // JavaScript
console.log(getLength("hello"));        // 5
```

---

## 🎯 Common Patterns

### Pattern 1: Validation Function

```javascript
function isValidEmail(email) {
  return email.includes("@");
}

console.log(isValidEmail("user@example.com"));  // true
console.log(isValidEmail("invalid"));           // false
```

### Pattern 2: Conversion Function

```javascript
function mileToKm(miles) {
  return miles * 1.60934;
}

console.log(mileToKm(5));  // 8.0467
```

### Pattern 3: Multiple Returns

```javascript
function getDayType(day) {
  if (day === "Saturday" || day === "Sunday") {
    return "Weekend";
  } else {
    return "Weekday";
  }
}

console.log(getDayType("Monday"));   // Weekday
console.log(getDayType("Saturday")); // Weekend
```

---

## ⚠️ Common Mistakes

### Mistake 1: Forgetting Parentheses

**Wrong:**
```javascript
function sayHi() {
  console.log("Hi!");
}

sayHi;   // ❌ Just references the function
```

**Right:**
```javascript
sayHi();  // ✅ Calls the function
```

### Mistake 2: Forgetting `return`

**Wrong:**
```javascript
function add(a, b) {
  a + b;  // ❌ Doesn't send back the value
}

console.log(add(5, 3));  // undefined
```

**Right:**
```javascript
function add(a, b) {
  return a + b;  // ✅ Sends back the value
}

console.log(add(5, 3));  // 8
```

### Mistake 3: Wrong Number of Arguments

**Wrong:**
```javascript
function greet(name) {
  console.log("Hello, " + name);
}

greet();  // name is undefined
```

**Right:**
```javascript
greet("Sarah");  // name is "Sarah"
```

---

## 🏆 Checkpoint

Before the Week 1 Project, make sure you can:

- ✅ Create functions with parameters
- ✅ Return values from functions
- ✅ Call functions correctly
- ✅ Use functions to organize code
- ✅ Understand function scope
- ✅ Avoid common function mistakes

**Can you do all of these?** If yes, you're ready for the Week 1 Project! 🚀

---

**Completion Time:** ~3 hours with exercises  
**Difficulty:** ⭐⭐⭐ (Beginner-Intermediate)  
**Next Lesson:** Week 1 Project - Build a Calculator
