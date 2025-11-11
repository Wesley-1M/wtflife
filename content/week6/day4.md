# Week 6: Day 4 - Performance Optimization

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)

---

## Topics

- React.memo for component memoization
- useMemo for expensive computations
- useCallback for function memoization
- Profiling React apps
- Identifying performance bottlenecks
- Lazy loading components

## Key Concepts

```javascript
React.memo(Component) - Prevent re-renders
useMemo(() => value, [deps]) - Memoize values
useCallback(() => fn, [deps]) - Memoize functions
lazy(() => import('Component')) - Code splitting
Suspense - Loading states
```

## When to Optimize

- Large lists rendering
- Expensive calculations
- Frequent re-renders
- Component trees with many props

## Real-World Example

Large dashboard with charts that re-renders efficiently using:
- React.memo for chart components
- useMemo for data processing
- useCallback for event handlers
- Lazy loading for routes

## ✅ Checkpoint

- [ ] Understand when to optimize
- [ ] Can use React.memo
- [ ] Can use useMemo & useCallback
- [ ] Know profiling tools

**Next:** Testing React Components! 🚀

