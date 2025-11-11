# Day 2: Variables & Data Types

**Duration:** 2 hours  
**Difficulty:** ⭐ Beginner  
**Prerequisites:** Day 1 - What is JavaScript?  
**By the end:** You'll understand how to store and use data in JavaScript

---

## 📚 Overview

A **variable** is a container that stores a value. Think of it like a labeled box where you can put information and get it back later.

### Real-World Example

Imagine you're in a library:
- **Box (Variable)** = A storage box
- **Label (Variable name)** = "My Favorite Books"
- **Contents (Variable value)** = The books inside

You can store things in boxes, label them, and get them back whenever you need them.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Create** variables using `const` and `let`  
✅ **Understand** what data types are  
✅ **Work with** strings, numbers, booleans  
✅ **Store** data in arrays  
✅ **Organize** data in objects  
✅ **Use** variables in console.log  

---

## 🔧 Creating Variables

### What's a Variable?

A variable is a named storage location for data.

```javascript
const name = "Sarah";
```

Breaking this down:
- `const` = Create a constant (don't change it)
- `name` = The variable name (what we call it)
- `=` = Assignment (put this value inside)
- `"Sarah"` = The value (what goes in the box)

### const vs let

**`const` (Constant):**
```javascript
const age = 25;
age = 30;  // ❌ ERROR! Can't change const
```

**`let` (Variable - can change):**
```javascript
let score = 0;
score = 100;  // ✅ Works! Can change let
```

### Rule of Thumb

- Use `const` by default
- Use `let` only when you need to change the value
- Never use `var` (outdated)

---

## 📊 Data Types

### What Are Data Types?

Different kinds of information need different handling:
- **Text** needs quotes
- **Numbers** don't
- **True/False** is special

### Type 1: String (Text)

A **string** is text surrounded by quotes.

```javascript
const name = "Sarah";
const message = "Hello, World!";
const singleQuotes = 'Also valid';
const backticks = `Also valid`;
```

### Type 2: Number

**Numbers** don't need quotes.

```javascript
const age = 25;
const price = 19.99;
const temperature = -5;
const huge = 1000000;
```

### Type 3: Boolean

A **boolean** is `true` or `false`.

```javascript
const isStudent = true;
const hasGraduated = false;
const isRaining = true;
```

### Type 4: Array

An **array** is a list of values.

```javascript
const colors = ["red", "blue", "green"];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "hello", true];
```

How to use:
```javascript
console.log(colors[0]);      // "red" (first item)
console.log(colors[1]);      // "blue" (second item)
console.log(colors.length);  // 3 (how many items)
```

### Type 5: Object

An **object** stores related data as key-value pairs.

```javascript
const person = {
  name: "Sarah",
  age: 28,
  city: "Portland"
};
```

How to use:
```javascript
console.log(person.name);     // "Sarah"
console.log(person.age);      // 28
console.log(person.city);     // "Portland"
```

---

## 📝 Variable Naming Rules

### Valid Names

```javascript
const firstName = "John";      // ✅ Good
const firstName_2 = "John";    // ✅ Good
const FIRSTNAME = "John";      // ✅ Works, but unusual
```

### Invalid Names

```javascript
const first-name = "John";     // ❌ Hyphens not allowed
const first name = "John";     // ❌ Spaces not allowed
const 1stName = "John";        // ❌ Can't start with number
const class = "Math";          // ❌ Can't use reserved words
```

### Naming Conventions

**Use camelCase** (first word lowercase, rest capitalized):

```javascript
const myVariableName = "Good style";
const myAge = 25;
const isStudent = true;
```

---

## 🔄 Using Variables

### Storing and Retrieving

```javascript
// Store data
const message = "Hello";

// Use the data
console.log(message);      // Hello
console.log(message);      // Hello (can use again!)
```

### Combining Variables

```javascript
const firstName = "John";
const lastName = "Doe";

console.log(firstName);              // John
console.log(lastName);               // Doe
console.log(firstName + " " + lastName);  // John Doe
```

### Using Variables in Math

```javascript
const price = 10;
const quantity = 5;
const total = price * quantity;

console.log(total);  // 50
```

---

## 🧪 Strings in Detail

### Template Literals (Backticks)

**Old way:**
```javascript
const name = "Sarah";
const message = "Hello, " + name;
console.log(message);  // Hello, Sarah
```

**Better way (template literals):**
```javascript
const name = "Sarah";
const message = `Hello, ${name}`;
console.log(message);  // Hello, Sarah
```

Template literals use backticks `` ` `` and `${}` to insert variables.

### String Methods

Strings have built-in functions:

```javascript
const text = "Hello World";

// Get length
console.log(text.length);           // 11

// Change case
console.log(text.toLowerCase());    // hello world
console.log(text.toUpperCase());    // HELLO WORLD

// Check if contains
console.log(text.includes("World")); // true
console.log(text.includes("Python")); // false

// Get part of string
console.log(text.substring(0, 5));  // Hello

// Replace
console.log(text.replace("World", "JavaScript")); // Hello JavaScript
```

---

## 💪 Practice Exercises

### Exercise 1: Create Variables

Create variables for the following and print them:
1. Your name (string)
2. Your age (number)
3. Your favorite hobby (string)
4. Whether you like coding (boolean)

**Your code:**
```javascript
const myName = "___";
const myAge = __;
const favoriteHobby = "___";
const likeCoding = _____;

console.log(myName);
console.log(myAge);
console.log(favoriteHobby);
console.log(likeCoding);
```

**Example:**
```javascript
const myName = "Alex";
const myAge = 30;
const favoriteHobby = "reading";
const likeCoding = true;

console.log(myName);         // Alex
console.log(myAge);          // 30
console.log(favoriteHobby);  // reading
console.log(likeCoding);     // true
```

### Exercise 2: Arrays

Create an array of your favorite foods, then print:
1. The whole array
2. The first food
3. The second food
4. How many foods are in the array

**Your code:**
```javascript
const foods = ["___", "___", "___"];

console.log(foods);
console.log(foods[0]);
console.log(foods[1]);
console.log(foods.length);
```

**Example:**
```javascript
const foods = ["pizza", "sushi", "tacos"];

console.log(foods);         // ["pizza", "sushi", "tacos"]
console.log(foods[0]);      // pizza
console.log(foods[1]);      // sushi
console.log(foods.length);  // 3
```

### Exercise 3: Objects

Create an object about a person, then print different properties:

**Your code:**
```javascript
const person = {
  name: "___",
  age: __,
  city: "___"
};

console.log(person);
console.log(person.name);
console.log(person.age);
```

**Example:**
```javascript
const person = {
  name: "Emma",
  age: 28,
  city: "New York"
};

console.log(person);           // {name: "Emma", age: 28, city: "New York"}
console.log(person.name);      // Emma
console.log(person.age);       // 28
```

### Exercise 4: Template Literals

Create a message using template literals:

**Your code:**
```javascript
const name = "___";
const age = __;
const message = `My name is ${name} and I am ${age} years old`;

console.log(message);
```

**Example:**
```javascript
const name = "Chris";
const age = 25;
const message = `My name is ${name} and I am ${age} years old`;

console.log(message);  // My name is Chris and I am 25 years old
```

### Exercise 5: String Methods

Use string methods to do the following:

**Your code:**
```javascript
const text = "JavaScript is awesome";

console.log(text.length);
console.log(text.toUpperCase());
console.log(text.toLowerCase());
console.log(text.includes("awesome"));
console.log(text.replace("awesome", "powerful"));
```

**Output:**
```
21
JAVASCRIPT IS AWESOME
javascript is awesome
true
JavaScript is powerful
```

### Exercise 6: Complete Project

Create a profile for a book and use it in a sentence:

**Your code:**
```javascript
const book = {
  title: "___",
  author: "___",
  pages: __,
  isFinished: _____
};

const message = `I'm reading "${book.title}" by ${book.author}. It has ${book.pages} pages.`;

console.log(message);
```

**Example:**
```javascript
const book = {
  title: "JavaScript: The Good Parts",
  author: "Douglas Crockford",
  pages: 170,
  isFinished: false
};

const message = `I'm reading "${book.title}" by ${book.author}. It has ${book.pages} pages.`;

console.log(message);
// I'm reading "JavaScript: The Good Parts" by Douglas Crockford. It has 170 pages.
```

---

## 🎓 Solutions to Exercises

### Exercise 1 Solution
```javascript
const myName = "Alex";
const myAge = 30;
const favoriteHobby = "reading";
const likeCoding = true;

console.log(myName);
console.log(myAge);
console.log(favoriteHobby);
console.log(likeCoding);
```

### Exercise 2 Solution
```javascript
const foods = ["pizza", "sushi", "tacos"];

console.log(foods);
console.log(foods[0]);
console.log(foods[1]);
console.log(foods.length);
```

### Exercise 3 Solution
```javascript
const person = {
  name: "Emma",
  age: 28,
  city: "New York"
};

console.log(person);
console.log(person.name);
console.log(person.age);
```

### Exercise 4 Solution
```javascript
const name = "Chris";
const age = 25;
const message = `My name is ${name} and I am ${age} years old`;

console.log(message);
```

### Exercise 5 Solution
```javascript
const text = "JavaScript is awesome";

console.log(text.length);
console.log(text.toUpperCase());
console.log(text.toLowerCase());
console.log(text.includes("awesome"));
console.log(text.replace("awesome", "powerful"));
```

### Exercise 6 Solution
```javascript
const book = {
  title: "JavaScript: The Good Parts",
  author: "Douglas Crockford",
  pages: 170,
  isFinished: false
};

const message = `I'm reading "${book.title}" by ${book.author}. It has ${book.pages} pages.`;

console.log(message);
```

---

## ⚠️ Common Mistakes

### Mistake 1: Forgetting Quotes on Strings

**Wrong:**
```javascript
const name = Sarah;  // ❌ Error
```

**Right:**
```javascript
const name = "Sarah";  // ✅ Works
```

### Mistake 2: Using Reserved Words

**Wrong:**
```javascript
const class = "Math";  // ❌ Error (class is reserved)
const function = () => {};  // ❌ Error (function is reserved)
```

**Right:**
```javascript
const myClass = "Math";  // ✅ Works
const myFunction = () => {};  // ✅ Works
```

### Mistake 3: Wrong Array Index

Arrays start at 0, not 1:

**Wrong:**
```javascript
const foods = ["pizza", "sushi"];
console.log(foods[1]);  // sushi (not "pizza"!)
```

**Right (if you want first item):**
```javascript
const foods = ["pizza", "sushi"];
console.log(foods[0]);  // pizza
```

### Mistake 4: Changing const

**Wrong:**
```javascript
const age = 25;
age = 30;  // ❌ Error! Can't change const
```

**Right (if you need to change):**
```javascript
let age = 25;
age = 30;  // ✅ Works! let can change
```

---

## 🔍 Understanding Data Types Better

### Why Data Types Matter

```javascript
// Strings
console.log("5" + "3");      // "53" (concatenation)

// Numbers  
console.log(5 + 3);          // 8 (addition)
```

Same symbols, different meaning because of data type!

### Checking Data Types

```javascript
const text = "hello";
const number = 42;
const bool = true;

console.log(typeof text);    // string
console.log(typeof number);  // number
console.log(typeof bool);    // boolean
```

---

## 📊 Data Types Reference

| Type | Example | How to Create |
|------|---------|---------------|
| **String** | `"hello"` | Use quotes |
| **Number** | `42` | Just write the number |
| **Boolean** | `true` | Use `true` or `false` |
| **Array** | `[1, 2, 3]` | Use square brackets `[]` |
| **Object** | `{name: "Sarah"}` | Use curly braces `{}` |
| **null** | `null` | Intentional "no value" |
| **undefined** | `undefined` | Unintentional "no value" |

---

## 🎯 What's Next?

### Today (This Lesson)
✅ Create variables with `const` and `let`  
✅ Understand data types  
✅ Work with strings, numbers, booleans  
✅ Use arrays and objects  

### Tomorrow (Day 3)
➡️ Functions - Write reusable code  
➡️ Arrow functions - Modern syntax  
➡️ Parameters and return values  

### This Week
➡️ Operators - Comparison and logic  
➡️ Conditionals - Make decisions  
➡️ Loops - Repeat actions  
➡️ Build a Calculator App!  

---

## 🏆 Checkpoint

Before moving to Day 3, make sure you can:

- ✅ Create a variable with `const`
- ✅ Create a variable with `let`
- ✅ Understand why you use each
- ✅ Create strings with quotes
- ✅ Create numbers
- ✅ Create booleans
- ✅ Create arrays
- ✅ Access array items with index
- ✅ Create objects
- ✅ Access object properties
- ✅ Use template literals

**Can you do all of these?** If yes, you're ready for Day 3! 🚀

---

## 💡 Tips for Success

### Naming Variables Well

**Good:**
```javascript
const userAge = 25;
const isLoggedIn = true;
const favoriteColors = ["blue", "green"];
```

**Bad:**
```javascript
const a = 25;
const x = true;
const list = ["blue", "green"];
```

Names should describe what the variable stores!

### Organization

Keep related data together:

```javascript
// ❌ Scattered
const personName = "Sarah";
const personAge = 28;
const personCity = "Portland";

// ✅ Better - use an object
const person = {
  name: "Sarah",
  age: 28,
  city: "Portland"
};
```

---

## 📚 Additional Resources

### Practice Websites
- **CodePen:** https://codepen.io/ (Write and run code)
- **JSFiddle:** https://jsfiddle.net/
- **Khan Academy:** JavaScript intro course

### Documentation
- **MDN - Variables:** https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables
- **MDN - Data Types:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures

---

## 🎬 Summary

### What You Learned Today

| Concept | What It Does |
|---------|------------|
| **Variables** | Store and reuse data |
| **const** | Create unchangeable variables |
| **let** | Create changeable variables |
| **Strings** | Text data |
| **Numbers** | Numeric data |
| **Booleans** | true/false data |
| **Arrays** | Lists of data |
| **Objects** | Related data grouped together |
| **Template Literals** | Insert variables in strings |

### Key Takeaways

1. **Variables store data** that you can use later
2. **Use `const` by default**, `let` when needed
3. **Data types matter** - strings, numbers, booleans
4. **Arrays store lists** and use 0-based indexing
5. **Objects organize related data** with keys
6. **Template literals** make string formatting easy

---

## ✅ Ready?

You now understand variables and data types!

**Next:** Learn about Functions on Day 3! 🚀

---

**Completion Time:** ~2 hours with exercises  
**Difficulty:** ⭐ (Very Easy)  
**Next Lesson:** Day 3 - Operators & Basic Math
