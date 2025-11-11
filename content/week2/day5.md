# Day 5: Advanced Functions - Closures, Callbacks & Higher-Order Functions

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐⭐ Advanced  
**Prerequisites:** Week 1 + Days 1-4 of Week 2  
**By the end:** You'll master function patterns used in professional JavaScript

---

## 📚 Overview

Today explores advanced function patterns that separate beginner from professional JavaScript developers. These concepts are **crucial** for working with:
- Callbacks (click handlers, API responses)
- Promise chains
- React hooks
- Module systems

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Understand** closure and scope  
✅ **Use** callbacks effectively  
✅ **Create** higher-order functions  
✅ **Use** .map(), .filter(), .reduce() correctly  
✅ **Understand** recursion  
✅ **Apply** these patterns to real problems  

---

## 🔒 Closures - Functions Remembering Their Environment

### What is a Closure?

A closure is a function that **remembers** variables from where it was created.

```javascript
function outer() {
  let count = 0;  // outer function's variable
  
  function inner() {
    count++;
    console.log(count);
  }
  
  return inner;
}

let counter = outer();
counter();  // 1
counter();  // 2
counter();  // 3
```

Why is this important? The `inner` function "closes over" the `count` variable!

### Real-World Closure Example

```javascript
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

Each returned function "remembers" its own `factor`!

### Private Variables with Closures

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;  // Private!
  
  return {
    deposit: function(amount) {
      balance += amount;
      return balance;
    },
    withdraw: function(amount) {
      if (amount > balance) {
        console.log("Insufficient funds!");
        return false;
      }
      balance -= amount;
      return balance;
    },
    getBalance: function() {
      return balance;
    }
  };
}

let myAccount = createBankAccount(1000);
console.log(myAccount.deposit(500));   // 1500
console.log(myAccount.withdraw(200));  // 1300
console.log(myAccount.getBalance());   // 1300
console.log(myAccount.balance);        // undefined (private!)
```

---

## 📞 Callbacks - Functions as Arguments

### What is a Callback?

A callback is a function passed to another function, which calls it later.

```javascript
function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

function wave() {
  console.log("*waves*");
}

greet("Sarah", wave);
// Hello, Sarah!
// *waves*
```

### Callbacks with Event Listeners

```javascript
// Real DOM example
let button = document.getElementById("myButton");

button.addEventListener("click", function() {
  console.log("Button clicked!");
});

// With arrow function
button.addEventListener("click", () => {
  console.log("Button clicked!");
});
```

### Callbacks with setTimeout

```javascript
console.log("Start");

setTimeout(function() {
  console.log("After 2 seconds");
}, 2000);

console.log("End");

// Output:
// Start
// End
// After 2 seconds
```

### Processing Data with Callbacks

```javascript
function processUserData(name, age, callback) {
  // Simulate API call
  let user = {name: name, age: age};
  callback(user);
}

processUserData("Sarah", 28, function(user) {
  console.log(`${user.name} is ${user.age} years old`);
});
```

---

## 🏗️ Higher-Order Functions

A higher-order function:
- Takes a function as an argument, OR
- Returns a function

### Function That Returns Functions

```javascript
function createAdder(x) {
  return function(y) {
    return x + y;
  };
}

let add5 = createAdder(5);
console.log(add5(3));   // 8
console.log(add5(10));  // 15
```

### .map() - Transform Array Elements

```javascript
let numbers = [1, 2, 3, 4, 5];

let doubled = numbers.map(function(num) {
  return num * 2;
});

console.log(doubled);  // [2, 4, 6, 8, 10]
```

Modern way:
```javascript
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]
```

### .filter() - Keep Only Matching Elements

```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let evenOnly = numbers.filter(num => num % 2 === 0);
console.log(evenOnly);  // [2, 4, 6, 8, 10]

let over5 = numbers.filter(num => num > 5);
console.log(over5);  // [6, 7, 8, 9, 10]
```

### .reduce() - Combine Elements Into One Value

```javascript
let numbers = [1, 2, 3, 4, 5];

let sum = numbers.reduce(function(acc, num) {
  return acc + num;
}, 0);  // Start at 0

console.log(sum);  // 15
```

Breaking it down:
- acc = 0, num = 1 → acc = 1
- acc = 1, num = 2 → acc = 3
- acc = 3, num = 3 → acc = 6
- acc = 6, num = 4 → acc = 10
- acc = 10, num = 5 → acc = 15

Calculate product:
```javascript
let numbers = [1, 2, 3, 4, 5];
let product = numbers.reduce((acc, num) => acc * num, 1);
console.log(product);  // 120
```

Count objects:
```javascript
let students = [
  {name: "Alice", grade: "A"},
  {name: "Bob", grade: "B"},
  {name: "Charlie", grade: "A"},
  {name: "Diana", grade: "A"}
];

let gradeCount = students.reduce(function(acc, student) {
  acc[student.grade] = (acc[student.grade] || 0) + 1;
  return acc;
}, {});

console.log(gradeCount);
// {A: 3, B: 1}
```

---

## 🔁 Recursion - Functions Calling Themselves

A recursive function calls itself to solve smaller versions of the same problem.

### Base Case (Stop Condition)

```javascript
function countdown(n) {
  if (n === 0) {
    console.log("Blastoff!");
    return;  // Stop here!
  }
  
  console.log(n);
  countdown(n - 1);  // Call itself
}

countdown(5);
// 5
// 4
// 3
// 2
// 1
// Blastoff!
```

### Calculate Factorial

```javascript
function factorial(n) {
  if (n <= 1) return 1;  // Base case
  return n * factorial(n - 1);  // Recursive case
}

console.log(factorial(5));   // 120
// 5 * 4 * 3 * 2 * 1 = 120
```

### Fibonacci Sequence

```javascript
function fibonacci(n) {
  if (n <= 1) return n;  // Base case
  return fibonacci(n - 1) + fibonacci(n - 2);  // Recursive case
}

console.log(fibonacci(6));  // 8
// Pattern: 0, 1, 1, 2, 3, 5, 8, 13...
```

### Search Through Nested Objects

```javascript
function findValue(obj, targetKey) {
  for (let key in obj) {
    if (key === targetKey) {
      return obj[key];
    }
    
    if (typeof obj[key] === "object" && obj[key] !== null) {
      let result = findValue(obj[key], targetKey);
      if (result !== undefined) {
        return result;
      }
    }
  }
}

let data = {
  user: {
    name: "Sarah",
    address: {
      city: "NYC",
      zip: "10001"
    }
  }
};

console.log(findValue(data, "city"));  // NYC
```

---

## 🧪 Try It Yourself

### Exercise 1: Simple Closure

```javascript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

let counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
```

---

## 💪 Practice Exercises

### Exercise 2: Callback Practice

```javascript
function fetchUserData(userId, callback) {
  // Simulate API delay
  setTimeout(function() {
    let user = {id: userId, name: "Sarah", age: 28};
    callback(user);
  }, 1000);
}

fetchUserData(1, function(user) {
  console.log(`User: ${user.name}, Age: ${user.age}`);
});
```

### Exercise 3: Higher-Order Functions

```javascript
// Create function that adds tax
function withTax(taxRate) {
  return function(price) {
    return price + (price * taxRate);
  };
}

let salesTax = withTax(0.08);
let luxuryTax = withTax(0.25);

console.log(salesTax(100));    // 108
console.log(luxuryTax(100));   // 125
```

### Exercise 4: Map, Filter, Reduce

```javascript
let products = [
  {name: "Laptop", price: 1000, quantity: 2},
  {name: "Mouse", price: 25, quantity: 5},
  {name: "Keyboard", price: 75, quantity: 3}
];

// Total value of all inventory
let totalValue = products.reduce((acc, product) => {
  return acc + (product.price * product.quantity);
}, 0);

console.log(`Total inventory value: $${totalValue}`);
// $2200

// Filter expensive items
let expensive = products.filter(p => p.price > 50);
console.log(expensive);

// Get just the names
let names = products.map(p => p.name);
console.log(names);
// ["Laptop", "Mouse", "Keyboard"]
```

### Exercise 5: Recursion

```javascript
function sumArray(arr) {
  if (arr.length === 0) return 0;  // Base case
  
  // First element + sum of rest
  return arr[0] + sumArray(arr.slice(1));
}

console.log(sumArray([1, 2, 3, 4, 5]));  // 15
```

---

## 🎯 Advanced Patterns Cheat Sheet

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Closure** | Private variables, state | Bank account with balance |
| **Callback** | Event listeners, async | Button click, setTimeout |
| **Higher-Order** | Transform data | .map(), .filter(), .reduce() |
| **Recursion** | Nested structures | Tree traversal, factorial |

---

## 🏆 Checkpoint

Before moving to the Week 2 Project, make sure you can:

- ✅ Explain what a closure is
- ✅ Use callbacks with events and timers
- ✅ Use .map() to transform arrays
- ✅ Use .filter() to select items
- ✅ Use .reduce() to combine values
- ✅ Write recursive functions
- ✅ Create higher-order functions

**Can you do all of these?** If yes, you're ready for the Week 2 Project! 🚀

---

**Completion Time:** ~3 hours with exercises  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Next:** Week 2 Project - Build a Todo List Manager
