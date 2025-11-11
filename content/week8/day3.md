# Week 8: Day 3 - Advanced React Patterns

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Topics

- Render props pattern
- Higher-order components (HOC)
- Compound components
- Controlled vs uncontrolled
- Error boundaries
- Suspense

## Patterns

```jsx
// Render props
<DataFetcher
  render={(data, loading) => (
    loading ? <Loading /> : <Data {...data} />
  )}
/>

// HOC
const withTheme = (Component) => (props) => (
  <ThemeProvider>
    <Component {...props} />
  </ThemeProvider>
);

// Compound components
<Accordion>
  <Accordion.Item>
    <Accordion.Header>Title</Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    return this.props.children;
  }
}
```

## ✅ Checkpoint

- [ ] Understand render props
- [ ] Know HOC pattern
- [ ] Understand compound components
- [ ] Know error handling

**Next:** Testing & Deployment! 🚀

