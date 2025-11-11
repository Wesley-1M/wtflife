# Week 6: Day 5 - Testing React Components

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)

---

## Testing Fundamentals

- Unit testing with Jest
- Component testing with React Testing Library
- Testing hooks
- Mocking functions and APIs
- Snapshot testing
- Coverage reports

## Tools

```javascript
Jest - Test runner
React Testing Library - Component testing
Vitest - Alternative to Jest
Testing Playground - Debug tests
```

## Testing Examples

```javascript
// Testing components
test('renders welcome message', () => {
  render(<Welcome name="Alice" />);
  expect(screen.getByText(/hello alice/i)).toBeInTheDocument();
});

// Testing hooks
test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});

// Mocking APIs
jest.mock('fetch');
fetch.mockResolvedValue({ json: () => ({ name: 'John' }) });

// User interactions
test('button click updates state', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## Best Practices

- Test user behavior, not implementation
- Use accessibility queries
- Mock external dependencies
- Aim for integration tests
- Test edge cases

## ✅ Checkpoint

- [ ] Can write unit tests
- [ ] Can test React components
- [ ] Can mock APIs
- [ ] Understand testing best practices

**Next:** Week 6 Project! 🚀

