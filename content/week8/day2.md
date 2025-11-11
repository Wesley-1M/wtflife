# Week 8: Day 2 - TypeScript with React

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐

---

## Topics

- Typing React components
- Props interfaces
- State types
- Hook typing
- Event handlers
- Common patterns

## Examples

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => (
  <button onClick={onClick} className={`btn-${variant}`}>
    {label}
  </button>
);

// Hook typing
const useCounter = (initial: number = 0): [number, () => void] => {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(count + 1);
  return [count, increment];
};

// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
```

## ✅ Checkpoint

- [ ] Can type React components
- [ ] Can type props
- [ ] Can type hooks
- [ ] Know React types

**Next:** Advanced Patterns! 🚀

