# Week 11: Day 1 - Algorithms & Data Structures

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Understand fundamental data structures
- Know common algorithms
- Be able to analyze time/space complexity
- Solve algorithmic problems

## Topics

- Arrays and Linked Lists
- Stacks and Queues
- Trees and Graphs
- Sorting algorithms
- Searching algorithms
- Big O notation

## Big O Notation

```javascript
// O(1) - Constant
const getFirst = (arr) => arr[0];

// O(n) - Linear
const findValue = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
};

// O(n²) - Quadratic
const bubbleSort = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
};

// O(log n) - Logarithmic
const binarySearch = (arr, target) => {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
};
```

## Data Structures

### Array
```javascript
// Pros: Fast access (O(1))
// Cons: Slow insertion/deletion
const arr = [1, 2, 3];
arr.push(4);      // O(1)
arr.shift();      // O(n)
```

### Linked List
```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  push(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
  }

  pop() {
    if (!this.head) return null;
    if (!this.head.next) {
      const value = this.head.value;
      this.head = null;
      return value;
    }
    let current = this.head;
    while (current.next.next) {
      current = current.next;
    }
    const value = current.next.value;
    current.next = null;
    return value;
  }
}
```

### Stack
```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Example: Check matching parentheses
const isValid = (s) => {
  const stack = new Stack();
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.isEmpty() || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  return stack.isEmpty();
};
```

### Queue
```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
```

## Common Algorithms

### Binary Search
```javascript
const binarySearch = (arr, target) => {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
};

console.log(binarySearch([1, 3, 5, 7, 9], 5)); // 2
```

### Quick Sort
```javascript
const quickSort = (arr) => {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  
  return [...quickSort(left), pivot, ...quickSort(right)];
};

console.log(quickSort([3, 1, 4, 1, 5, 9])); // [1, 1, 3, 4, 5, 9]
```

## ✅ Checkpoint

- [ ] Understand Big O
- [ ] Know basic data structures
- [ ] Can implement algorithms
- [ ] Know sorting techniques

**Next:** System Design! 🏗️

