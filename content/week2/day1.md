# Day 1: Arrays - Store Multiple Values

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐ Beginner  
**Prerequisites:** Week 1 - Variables & Functions  
**By the end:** You'll create and manipulate arrays to store collections of data

---

## 📚 Overview

So far, you've stored one value in each variable:

```javascript
let name = "Sarah";
let age = 28;
let hobby = "coding";
```

But what if you need to store **10 names** or **100 ages**? Creating 100 variables would be crazy!

That's where **arrays** come in. An array is a **collection of values** stored in a single variable.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Create** arrays  
✅ **Access** array elements by index  
✅ **Modify** array elements  
✅ **Find** the length of an array  
✅ **Understand** array indexing (0-based)  

---

## 🎁 What is an Array?

An array is a **list of values** grouped together in one variable.

### Array vs Multiple Variables

**Without arrays (messy):**
```javascript
let student1 = "Alice";
let student2 = "Bob";
let student3 = "Charlie";
let student4 = "Diana";
```

**With arrays (clean):**
```javascript
let students = ["Alice", "Bob", "Charlie", "Diana"];
```

Much better!

---

## 🔨 Creating Arrays

### Basic Syntax

```javascript
let arrayName = [value1, value2, value3];
```

### Example 1: Array of Strings

```javascript
let fruits = ["apple", "banana", "orange"];
console.log(fruits);
// Output: ["apple", "banana", "orange"]
```

### Example 2: Array of Numbers

```javascript
let scores = [85, 90, 78, 92];
console.log(scores);
// Output: [85, 90, 78, 92]
```

### Example 3: Mixed Array

```javascript
let mixed = ["Alice", 25, true, 3.14];
console.log(mixed);
// Output: ["Alice", 25, true, 3.14]
```

### Example 4: Empty Array

```javascript
let empty = [];
console.log(empty);
// Output: []
```

---

## 📍 Array Indexing

Arrays use **zero-based indexing**, meaning the first element is at index 0.

```javascript
let fruits = ["apple", "banana", "orange"];
//             0         1           2       ← indices
```

### Accessing Elements

Use square brackets `[]` to access an element:

```javascript
let fruits = ["apple", "banana", "orange"];

console.log(fruits[0]);  // apple
console.log(fruits[1]);  // banana
console.log(fruits[2]);  // orange
console.log(fruits[3]);  // undefined (doesn't exist)
```

### Modifying Elements

```javascript
let fruits = ["apple", "banana", "orange"];

fruits[1] = "grape";
console.log(fruits);
// Output: ["apple", "grape", "orange"]
```

---

## 📏 Array Length

Use `.length` to find how many elements are in an array:

```javascript
let fruits = ["apple", "banana", "orange"];

console.log(fruits.length);  // 3

let numbers = [1, 2, 3, 4, 5];
console.log(numbers.length);  // 5

let empty = [];
console.log(empty.length);  // 0
```

---

## 🧪 Try It Yourself

### Exercise 1: Create and Access

```javascript
let colors = ["red", "green", "blue", "yellow"];

console.log(colors[0]);      // red
console.log(colors[2]);      // blue
console.log(colors.length);  // 4
```

**Try it:** Create your own array and access elements!

---

## 💪 Practice Exercises

### Exercise 2: Shopping List

```javascript
let shoppingList = ["milk", "bread", "eggs", "cheese"];

// Access items
console.log("First item:", shoppingList[0]);
console.log("Last item:", shoppingList[shoppingList.length - 1]);

// Modify an item
shoppingList[1] = "whole wheat bread";
console.log("Updated list:", shoppingList);
```

### Exercise 3: Test Scores

```javascript
let scores = [85, 90, 78, 92, 88];

// Find total
let total = scores[0] + scores[1] + scores[2] + scores[3] + scores[4];
console.log("Total:", total);

// Find average
console.log("Average:", total / scores.length);
```

### Exercise 4: Mixed Data

```javascript
let person = ["Sarah", 28, "Engineer", true, 75000];

console.log("Name:", person[0]);
console.log("Age:", person[1]);
console.log("Job:", person[2]);
console.log("Employed:", person[3]);
console.log("Salary:", person[4]);
```

---

## 🏆 Checkpoint

Before moving to the next day, make sure you can:

- ✅ Create arrays with multiple values
- ✅ Access array elements using index notation
- ✅ Understand zero-based indexing
- ✅ Modify array elements
- ✅ Use `.length` to find array size
- ✅ Access the last element using `.length - 1`

**Can you do all of these?** If yes, you're ready for Day 2! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐ (Easy)  
**Next Lesson:** Day 2 - Objects & Key-Value Pairs
