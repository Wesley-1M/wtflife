# Week 8: Day 1 - TypeScript Fundamentals

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐

---

## Topics

- TypeScript basics
- Types and interfaces
- Generics
- Enums
- Type aliases
- Union and intersection types

## Key Examples

```typescript
// Types
const name: string = 'Alice';
const age: number = 30;
const active: boolean = true;

// Interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

// Functions
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Generics
function getById<T>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Union types
type Status = 'active' | 'inactive' | 'pending';

// Intersection
interface Admin extends User {
  permissions: string[];
}
```

## ✅ Checkpoint

- [ ] Understand TypeScript basics
- [ ] Can write types
- [ ] Know interfaces
- [ ] Understand generics

**Next:** TypeScript with React! 🚀

