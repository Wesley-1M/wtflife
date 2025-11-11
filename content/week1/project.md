# Week 1 Project: Build a Simple Calculator

**Duration:** 3-4 hours  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Prerequisites:** Day 1-5 - All Week 1 lessons  
**Goal:** Create a working calculator app

---

## 📚 Overview

Congratulations on completing Week 1! Now it's time to put everything together and build something real.

In this project, you'll create a **calculator** that can:
- ✅ Add, subtract, multiply, divide numbers
- ✅ Handle user input
- ✅ Display results
- ✅ Handle errors gracefully

---

## 🎯 Project Objectives

By the end of this project, you will:

✅ **Organize** code into reusable functions  
✅ **Validate** user input  
✅ **Handle** edge cases (divide by zero, invalid input)  
✅ **Build** an interactive application  
✅ **Debug** complex code  

---

## 📋 Requirements

Your calculator should:

1. ✅ **Have four operations**: add, subtract, multiply, divide
2. ✅ **Take two numbers** as input
3. ✅ **Perform calculations** and return results
4. ✅ **Handle errors** (like dividing by zero)
5. ✅ **Validate input** (check if numbers are valid)
6. ✅ **Be easy to use** from the console

---

## 🏗️ Architecture

Your calculator will have these functions:

```
add()          → adds two numbers
subtract()     → subtracts two numbers
multiply()     → multiplies two numbers
divide()       → divides two numbers (with error handling)
calculate()    → main function that runs the calculator
isValidNumber() → validates if input is a number
```

---

## 📝 Step-by-Step Guide

### Step 1: Create Arithmetic Functions

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

function divide(a, b) {
  if (b === 0) {
    return "Error: Cannot divide by zero";
  }
  return a / b;
}
```

**Test it:**
```javascript
console.log(add(10, 5));        // 15
console.log(subtract(10, 5));   // 5
console.log(multiply(10, 5));   // 50
console.log(divide(10, 5));     // 2
console.log(divide(10, 0));     // Error message
```

### Step 2: Create a Validator

```javascript
function isValidNumber(value) {
  let num = Number(value);
  return !isNaN(num) && isFinite(num);
}
```

**Test it:**
```javascript
console.log(isValidNumber("5"));      // true
console.log(isValidNumber("hello"));  // false
console.log(isValidNumber(""));       // false
```

### Step 3: Create Main Calculator

```javascript
function calculate(operation, num1, num2) {
  // Validate inputs
  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    return "Error: Invalid input. Please enter numbers.";
  }

  // Convert to numbers
  num1 = Number(num1);
  num2 = Number(num2);

  // Perform operation
  switch(operation) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
    default:
      return "Error: Invalid operation. Use +, -, *, /";
  }
}
```

### Step 4: Test Your Calculator

```javascript
// Test valid operations
console.log(calculate('+', 15, 5));   // 20
console.log(calculate('-', 15, 5));   // 10
console.log(calculate('*', 15, 5));   // 75
console.log(calculate('/', 15, 5));   // 3

// Test error handling
console.log(calculate('/', 15, 0));        // Error message
console.log(calculate('+', 'hello', 5));   // Error message
console.log(calculate('^', 15, 5));        // Error message
```

---

## 💡 Enhancement Ideas

Once you have the basic calculator working, try these:

### Enhancement 1: History Function

```javascript
let history = [];

function addToHistory(operation, num1, num2, result) {
  history.push({
    operation: operation,
    num1: num1,
    num2: num2,
    result: result
  });
}

function showHistory() {
  history.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.num1} ${entry.operation} ${entry.num2} = ${entry.result}`);
  });
}
```

### Enhancement 2: More Operations

```javascript
function modulus(a, b) {
  return a % b;
}

function power(a, b) {
  return a ** b;
}

// Add to your switch statement:
case '%':
  return modulus(num1, num2);
case '^':
  return power(num1, num2);
```

### Enhancement 3: Interactive Mode

```javascript
function interactiveCalculator() {
  while (true) {
    let op = prompt("Enter operation (+, -, *, /) or 'quit' to exit:");
    if (op === 'quit') break;

    let num1 = prompt("Enter first number:");
    let num2 = prompt("Enter second number:");

    let result = calculate(op, num1, num2);
    console.log(`Result: ${result}`);
  }
}

interactiveCalculator();
```

---

## 🧪 Testing Checklist

Before submitting, test:

- ✅ Addition works: `calculate('+', 5, 3)` → `8`
- ✅ Subtraction works: `calculate('-', 5, 3)` → `2`
- ✅ Multiplication works: `calculate('*', 5, 3)` → `15`
- ✅ Division works: `calculate('/', 6, 2)` → `3`
- ✅ Division by zero is handled: `calculate('/', 5, 0)` → error message
- ✅ Invalid operation is handled: `calculate('&', 5, 3)` → error message
- ✅ Invalid input is handled: `calculate('+', 'abc', 3)` → error message

---

## 📚 Full Solution

Here's a complete working calculator:

```javascript
// Arithmetic operations
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error: Cannot divide by zero";
  }
  return a / b;
}

// Input validation
function isValidNumber(value) {
  let num = Number(value);
  return !isNaN(num) && isFinite(num);
}

// Main calculator
function calculate(operation, num1, num2) {
  // Validate inputs
  if (!isValidNumber(num1) || !isValidNumber(num2)) {
    return "Error: Invalid input. Please enter numbers.";
  }

  // Convert to numbers
  num1 = Number(num1);
  num2 = Number(num2);

  // Perform operation
  switch(operation) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
    default:
      return "Error: Invalid operation. Use +, -, *, /";
  }
}

// Example usage
console.log(calculate('+', 15, 5));   // 20
console.log(calculate('/', 15, 0));   // Error message
```

---

## 🎓 Learning Summary

Through this project, you've learned:

| Concept | How You Used It |
|---------|-----------------|
| **Variables** | Store numbers and operations |
| **Functions** | Organize code into reusable parts |
| **Parameters** | Pass numbers and operations to functions |
| **Return** | Send results back |
| **Operators** | Perform calculations |
| **Conditionals** | Handle errors (divide by zero) |
| **Switch** | Handle different operations |

---

## 🏆 Submission

When you're done:

1. ✅ Test all functionality
2. ✅ Test error handling
3. ✅ Add comments explaining your code
4. ✅ Show someone your working calculator!

---

## 🎯 What's Next?

Week 2 will cover:
- ➡️ Arrays - Store multiple values
- ➡️ Objects - Store related data
- ➡️ Loops - Repeat code automatically
- ➡️ Advanced functions

---

**Congratulations on Week 1!** 🎉

You now understand the fundamentals of JavaScript. You're ready to build more complex applications!

**Next:** Week 2 - Arrays, Objects, and Loops
