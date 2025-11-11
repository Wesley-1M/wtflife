# Day 4: ES6+ Features - Modern JavaScript

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Prerequisites:** Week 1 + Days 1-3 of Week 2  
**By the end:** You'll use modern JavaScript syntax that makes code cleaner and easier

---

## 📚 Overview

ES6+ (introduced in 2015) brought huge improvements to JavaScript. These features make code:
- ✅ Shorter and cleaner
- ✅ Easier to read
- ✅ Less error-prone

This lesson covers the most useful modern features.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Use** let and const properly  
✅ **Use** template literals for strings  
✅ **Destructure** arrays and objects  
✅ **Use** spread operator (...)  
✅ **Use** arrow functions  
✅ **Use** default parameters  

---

## 📦 Let and Const

### `let` - Variable That Can Change

```javascript
let age = 25;
age = 26;  // Can reassign
console.log(age);  // 26
```

### `const` - Variable That Cannot Change

```javascript
const name = "Sarah";
// name = "John";  // ❌ Error!
```

**Best Practice:** Use `const` by default, `let` when you need to reassign.

```javascript
const PI = 3.14159;  // Never changes
const person = {name: "Sarah"};
person.age = 28;  // ✅ Can modify properties
```

---

## 📝 Template Literals

### Old Way (Ugly)

```javascript
let name = "Sarah";
let age = 28;

let message = "My name is " + name + " and I am " + age + " years old";
console.log(message);
```

### Modern Way (Clean)

```javascript
let name = "Sarah";
let age = 28;

let message = `My name is ${name} and I am ${age} years old`;
console.log(message);
```

Template literals use **backticks** `` ` `` and `${variable}` for substitution.

### Multi-line Strings

```javascript
let poem = `
  Roses are red
  Violets are blue
  JavaScript is fun
  And ES6 is too!
`;

console.log(poem);
```

---

## 🎯 Destructuring

### Array Destructuring

Old way:
```javascript
let colors = ["red", "green", "blue"];
let first = colors[0];
let second = colors[1];
```

Modern way:
```javascript
let colors = ["red", "green", "blue"];
let [first, second, third] = colors;

console.log(first);   // red
console.log(second);  // green
```

Skip elements:
```javascript
let [first, , third] = colors;
console.log(first);   // red
console.log(third);   // blue
```

### Object Destructuring

Old way:
```javascript
let person = {name: "Sarah", age: 28, city: "NYC"};
let name = person.name;
let age = person.age;
```

Modern way:
```javascript
let person = {name: "Sarah", age: 28, city: "NYC"};
let {name, age, city} = person;

console.log(name);   // Sarah
console.log(age);    // 28
```

---

## 📤 Spread Operator (...)

### Spread Array Elements

```javascript
let numbers = [1, 2, 3];
let moreNumbers = [...numbers, 4, 5, 6];

console.log(moreNumbers);
// [1, 2, 3, 4, 5, 6]
```

### Combine Arrays

```javascript
let arr1 = [1, 2];
let arr2 = [3, 4];
let combined = [...arr1, ...arr2];

console.log(combined);  // [1, 2, 3, 4]
```

### Spread Object Properties

```javascript
let person1 = {name: "Sarah", age: 28};
let person2 = {...person1, city: "NYC"};

console.log(person2);
// {name: "Sarah", age: 28, city: "NYC"}
```

---

## 🏹 Arrow Functions

### Traditional Function

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(5, 3));  // 8
```

### Arrow Function

```javascript
const add = (a, b) => {
  return a + b;
};

console.log(add(5, 3));  // 8
```

### Concise Arrow Function

```javascript
const add = (a, b) => a + b;

console.log(add(5, 3));  // 8
```

### Single Parameter

```javascript
const square = x => x * x;

console.log(square(5));  // 25
```

---

## 🎛️ Default Parameters

Old way:
```javascript
function greet(name) {
  if (!name) {
    name = "Guest";
  }
  console.log(`Hello, ${name}!`);
}

greet();      // Hello, Guest!
greet("Sarah");  // Hello, Sarah!
```

Modern way:
```javascript
const greet = (name = "Guest") => {
  console.log(`Hello, ${name}!`);
};

greet();      // Hello, Guest!
greet("Sarah");  // Hello, Sarah!
```

---

## 🧪 Try It Yourself

### Exercise 1: Template Literals

```javascript
let product = "Laptop";
let price = 999.99;
let quantity = 2;

let message = `You're buying ${quantity} ${product}(s) for $${price * quantity}`;
console.log(message);
```

---

## 💪 Practice Exercises

### Exercise 2: Destructuring

```javascript
// Array destructuring
let scores = [95, 87, 92, 88];
let [first, second] = scores;
console.log(`Top two scores: ${first}, ${second}`);

// Object destructuring
let car = {make: "Toyota", model: "Camry", year: 2022};
let {make, model, year} = car;
console.log(`${year} ${make} ${model}`);
```

### Exercise 3: Arrow Functions

```javascript
// Arrow function
const multiply = (a, b) => a * b;
console.log(multiply(4, 5));  // 20

// With default parameter
const power = (base = 2, exp = 2) => {
  let result = 1;
  for (let i = 0; i < exp; i++) {
    result *= base;
  }
  return result;
};

console.log(power());       // 4
console.log(power(2, 3));   // 8
```

### Exercise 4: Spread Operator

```javascript
let fruits = ["apple", "banana"];
let allFruits = [...fruits, "orange", "mango"];
console.log(allFruits);

let user1 = {name: "Alice", age: 25};
let user2 = {...user1, city: "NYC", age: 26};
console.log(user2);
// {name: "Alice", age: 26, city: "NYC"}
```

---

## 🎯 Modern JavaScript Syntax Summary

| Feature | Old Way | Modern Way |
|---------|---------|-----------|
| **Variables** | `var x = 5;` | `const x = 5;` |
| **Reassign** | `let x = 5;` | `let x = 5;` |
| **String concat** | `"Hello " + name` | `` `Hello ${name}` `` |
| **Functions** | `function add(a,b){...}` | `const add = (a,b) => {...}` |
| **Get array values** | `arr[0], arr[1]` | `let [a,b] = arr` |
| **Combine arrays** | `arr1.concat(arr2)` | `[...arr1, ...arr2]` |

---

## 🏆 Checkpoint

Before moving to Day 5, make sure you can:

- ✅ Use `const` and `let` correctly
- ✅ Use template literals with `${}`
- ✅ Destructure arrays
- ✅ Destructure objects
- ✅ Use spread operator `...`
- ✅ Write arrow functions
- ✅ Use default parameters

**Can you do all of these?** If yes, you're ready for Day 5! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐⭐ (Intermediate)  
**Next Lesson:** Day 5 - Advanced Functions
