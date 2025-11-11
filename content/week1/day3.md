# Day 3: Operators & Expressions

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐ Beginner  
**Prerequisites:** Day 1-2 - JavaScript Basics & Variables  
**By the end:** You'll perform calculations and comparisons in JavaScript

---

## 📚 Overview

Now that you know how to create variables, let's learn how to **do things with them**. Operators are symbols that let us perform operations on variables.

### Three Types of Operators

1. **Arithmetic** - Math operations
2. **Comparison** - Compare values
3. **Logical** - True/False combinations

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

✅ **Use** arithmetic operators for math  
✅ **Understand** operator precedence  
✅ **Compare** values using comparison operators  
✅ **Combine** comparisons with logical operators  
✅ **Write** complex expressions  

---

## ➕ Arithmetic Operators

### Basic Math Operations

| Operator | What it does | Example | Result |
|----------|------------|---------|--------|
| `+` | Addition | `5 + 3` | `8` |
| `-` | Subtraction | `10 - 4` | `6` |
| `*` | Multiplication | `4 * 6` | `24` |
| `/` | Division | `20 / 4` | `5` |
| `%` | Modulus (remainder) | `10 % 3` | `1` |
| `**` | Exponentiation | `2 ** 3` | `8` |

### Examples

```javascript
let x = 10;
let y = 3;

console.log(x + y);   // 13
console.log(x - y);   // 7
console.log(x * y);   // 30
console.log(x / y);   // 3.333...
console.log(x % y);   // 1 (remainder)
console.log(x ** y);  // 1000
```

### The Modulus Operator (%)

The `%` operator gives you the remainder:

```javascript
console.log(10 % 3);   // 1
console.log(10 % 2);   // 0 (divides evenly)
console.log(10 % 5);   // 0 (divides evenly)
```

This is useful for checking if a number is even or odd!

---

## 📊 Comparison Operators

Comparison operators compare two values and return `true` or `false`.

| Operator | What it does | Example | Result |
|----------|------------|---------|--------|
| `==` | Equal to | `5 == 5` | `true` |
| `!=` | Not equal to | `5 != 3` | `true` |
| `>` | Greater than | `10 > 5` | `true` |
| `<` | Less than | `3 < 5` | `true` |
| `>=` | Greater or equal | `5 >= 5` | `true` |
| `<=` | Less or equal | `3 <= 5` | `true` |
| `===` | Strict equal | `5 === "5"` | `false` |
| `!==` | Strict not equal | `5 !== "5"` | `true` |

### Examples

```javascript
let age = 25;

console.log(age > 18);      // true
console.log(age < 30);      // true
console.log(age == 25);     // true
console.log(age != 20);     // true
console.log(age >= 25);     // true
console.log(age <= 25);     // true
```

### `==` vs `===`

**`==` (loose equality)** - Compares value only:

```javascript
console.log(5 == "5");   // true (same value)
console.log(5 == 5);     // true
```

**`===` (strict equality)** - Compares value AND type:

```javascript
console.log(5 === "5");  // false (different types)
console.log(5 === 5);    // true (same value and type)
```

**Use `===` always!** It's safer and more predictable.

---

## 🔀 Logical Operators

Logical operators combine comparisons.

| Operator | What it does | Example |
|----------|------------|---------|
| `&&` | AND - Both must be true | `age > 18 && age < 65` |
| `\|\|` | OR - At least one true | `isWeekend \|\| isHoliday` |
| `!` | NOT - Flip the value | `!isRaining` |

### AND (`&&`)

Both conditions must be true:

```javascript
let age = 25;
let hasLicense = true;

console.log(age >= 18 && hasLicense);  // true (both true)
console.log(age >= 18 && false);       // false (one false)
console.log(false && false);           // false (both false)
```

### OR (`||`)

At least one condition must be true:

```javascript
let isWeekend = true;
let isHoliday = false;

console.log(isWeekend || isHoliday);  // true (one true)
console.log(false || false);           // false (both false)
console.log(true || true);             // true (both true)
```

### NOT (`!`)

Flips the boolean value:

```javascript
let isRaining = true;

console.log(!isRaining);     // false
console.log(!!isRaining);    // true (flips twice)
console.log(!true);          // false
console.log(!false);         // true
```

---

## 🧪 Try It Yourself

### Exercise 1: Basic Math

```javascript
let num1 = 50;
let num2 = 3;

console.log(num1 + num2);
console.log(num1 - num2);
console.log(num1 * num2);
console.log(num1 / num2);
console.log(num1 % num2);
```

**Try it:** Run this code!

---

## 💪 Practice Exercises

### Exercise 2: Check if Even or Odd

```javascript
let number = 7;
let isEven = number % 2 === 0;

console.log(number + " is even:", isEven);

number = 8;
isEven = number % 2 === 0;

console.log(number + " is even:", isEven);
```

**Expected output:**
```
7 is even: false
8 is even: true
```

### Exercise 3: Age Verification

```javascript
let age = 22;

let isAdult = age >= 18;
let isYoungAdult = age >= 18 && age < 30;
let isSenior = age >= 65;

console.log("Is adult:", isAdult);
console.log("Is young adult:", isYoungAdult);
console.log("Is senior:", isSenior);
```

### Exercise 4: Access Check

```javascript
let hasTicket = true;
let hasInvite = false;

let canEnter = hasTicket || hasInvite;

console.log("Has ticket:", hasTicket);
console.log("Has invite:", hasInvite);
console.log("Can enter:", canEnter);
```

---

## 🏆 Checkpoint

Before moving to Day 4, make sure you can:

- ✅ Use all arithmetic operators
- ✅ Understand operator precedence
- ✅ Use comparison operators correctly
- ✅ Use `===` instead of `==`
- ✅ Combine conditions with `&&` and `||`
- ✅ Use the `!` operator

**Can you do all of these?** If yes, you're ready for Day 4! 🚀

---

**Completion Time:** ~2.5 hours with exercises  
**Difficulty:** ⭐⭐ (Easy)  
**Next Lesson:** Day 4 - Control Flow (If/Else)
