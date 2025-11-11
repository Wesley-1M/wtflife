# Week 7: Day 5 - State Management Libraries

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐

---

## Topics

- Redux basics
- Redux Toolkit
- Zustand
- Recoil
- MobX
- When to use each

## Comparison

```
Redux - Most popular, ecosystem
Redux Toolkit - Modern Redux
Zustand - Lightweight, simple
Recoil - Fine-grained reactivity
MobX - Decorators and reactivity
```

## Redux Toolkit Example

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; }
  }
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer }
});

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

function Counter() {
  const count = useSelector(s => s.counter.value);
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch(counterSlice.actions.increment())}>
      {count}
    </button>
  );
}
```

## ✅ Checkpoint

- [ ] Understand Redux basics
- [ ] Know when to use libraries
- [ ] Can compare options

**Next:** Week 7 Project! 🚀

