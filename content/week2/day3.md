# Day 3: Array Methods - Working with Collections

**Duration:** 3 hours  
**Difficulty:** ⭐⭐⭐ Intermediate  
**Prerequisites:** Week 1 + Days 1-2 of Week 2  
**By the end:** You'll use powerful methods to manipulate arrays

---

## 📚 Overview

Arrays come with **built-in methods** - functions that do common tasks like adding, removing, and transforming elements.

Without methods (tedious):
```javascript
let fruits = ["apple", "banana"];
// Manually add orange...
```

With methods (easy):
```javascript
let fruits = ["apple", "banana"];
fruits.push("orange");  // Add to end
```

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Use** `.push()` and `.pop()` to add/remove elements  
✅ **Use** `.shift()` and `.unshift()`  
✅ **Use** `.slice()` and `.splice()`  
✅ **Use** `.indexOf()` to find elements  
✅ **Use** `.includes()` to check if element exists  
✅ **Use** `.join()` to combine into a string  

---

## ➕ Adding Elements

### `.push()` - Add to End

```javascript
let fruits = ["apple", "banana"];
fruits.push("orange");

console.log(fruits);
// ["apple", "banana", "orange"]
```

Add multiple items:
```javascript
fruits.push("mango", "grape");
console.log(fruits);
// ["apple", "banana", "orange", "mango", "grape"]
```

### `.unshift()` - Add to Beginning

```javascript
let fruits = ["apple", "banana"];
fruits.unshift("grape");

console.log(fruits);
// ["grape", "apple", "banana"]
```

---

## ➖ Removing Elements

### `.pop()` - Remove from End

```javascript
let fruits = ["apple", "banana", "orange"];
let removed = fruits.pop();

console.log(fruits);    // ["apple", "banana"]
console.log(removed);   // "orange"
```

### `.shift()` - Remove from Beginning

```javascript
let fruits = ["apple", "banana", "orange"];
let removed = fruits.shift();

console.log(fruits);    // ["banana", "orange"]
console.log(removed);   // "apple"
```

---

## 🔍 Finding Elements

### `.indexOf()` - Find Position

```javascript
let fruits = ["apple", "banana", "orange"];

console.log(fruits.indexOf("banana"));  // 1
console.log(fruits.indexOf("grape"));   // -1 (not found)
```

### `.includes()` - Check if Exists

```javascript
let fruits = ["apple", "banana", "orange"];

console.log(fruits.includes("banana"));  // true
console.log(fruits.includes("grape"));   // false
```

---

## ✂️ Slicing Arrays

### `.slice()` - Extract Portion (Doesn't Change Original)

```javascript
let fruits = ["apple", "banana", "orange", "mango"];

let slice = fruits.slice(1, 3);
console.log(slice);    // ["banana", "orange"]
console.log(fruits);   // Original unchanged
```

**Note:** `.slice(start, end)` - end is NOT included

### `.splice()` - Remove/Replace Elements (Changes Original)

```javascript
let fruits = ["apple", "banana", "orange", "mango"];

// Remove 2 items starting at index 1
fruits.splice(1, 2);
console.log(fruits);
// ["apple", "mango"]
```

Replace elements:
```javascript
let fruits = ["apple", "banana", "orange"];

// Replace 1 element at index 1 with "grape"
fruits.splice(1, 1, "grape");
console.log(fruits);
// ["apple", "grape", "orange"]
```

---

## 🔗 Combining Arrays

### `.join()` - Convert to String

```javascript
let fruits = ["apple", "banana", "orange"];

let text = fruits.join(", ");
console.log(text);
// "apple, banana, orange"
```

---

## 🧪 Try It Yourself

### Exercise 1: Basic Methods

```javascript
let numbers = [1, 2, 3, 4, 5];

// Add to end
numbers.push(6);
console.log(numbers);

// Remove from end
let removed = numbers.pop();
console.log(removed);  // 6
console.log(numbers);  // [1,2,3,4,5]
```

---

## 💪 Practice Exercises

### Exercise 2: Todo List

```javascript
let todos = ["Learn JavaScript", "Build a project", "Get a job"];

// Add new todo
todos.push("Master React");

// Check if task exists
console.log(todos.includes("Learn JavaScript"));  // true

// Find position
console.log(todos.indexOf("Get a job"));  // 2

// Convert to string
console.log(todos.join(" | "));
```

### Exercise 3: Remove and Replace

```javascript
let colors = ["red", "blue", "green", "yellow"];

// Remove "blue"
colors.splice(1, 1);
console.log(colors);  // ["red", "green", "yellow"]

// Replace "yellow" with "orange"
colors.splice(2, 1, "orange");
console.log(colors);  // ["red", "green", "orange"]
```

### Exercise 4: Array Slice

```javascript
let numbers = [10, 20, 30, 40, 50];

// Get first 3 elements
let start = numbers.slice(0, 3);
console.log(start);  // [10, 20, 30]

// Get last 2 elements
let end = numbers.slice(-2);
console.log(end);  // [40, 50]

// Original unchanged
console.log(numbers);  // [10, 20, 30, 40, 50]
```

---

## 📊 Common Array Methods Reference

| Method | What It Does | Changes Original? |
|--------|-------------|-------------------|
| `.push(item)` | Add to end | ✅ Yes |
| `.pop()` | Remove from end | ✅ Yes |
| `.shift()` | Remove from start | ✅ Yes |
| `.unshift(item)` | Add to start | ✅ Yes |
| `.indexOf(item)` | Find position | ❌ No |
| `.includes(item)` | Check if exists | ❌ No |
| `.slice(start, end)` | Extract portion | ❌ No |
| `.splice(start, count)` | Remove items | ✅ Yes |
| `.join(separator)` | Convert to string | ❌ No |

---

## 🏆 Checkpoint

Before moving to Day 4, make sure you can:

- ✅ Use `.push()` to add elements
- ✅ Use `.pop()` to remove from end
- ✅ Use `.shift()` and `.unshift()`
- ✅ Use `.indexOf()` to find elements
- ✅ Use `.includes()` to check existence
- ✅ Use `.slice()` without modifying original
- ✅ Use `.splice()` to remove/replace
- ✅ Use `.join()` to create strings

**Can you do all of these?** If yes, you're ready for Day 4! 🚀

---

**Completion Time:** ~3 hours with exercises  
**Difficulty:** ⭐⭐⭐ (Intermediate)  
**Next Lesson:** Day 4 - ES6+ Features
