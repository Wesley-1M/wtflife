# Week 12: Testing & Quality Assurance

**Duration:** 5 days + 1 project (40 hours total)  
**Difficulty:** ⭐⭐⭐⭐ (Expert)  
**Prerequisites:** Weeks 1-11

---

## 📚 Week Overview

Master testing strategies: unit tests, integration tests, E2E tests, and quality assurance.

---

## Topics

- Unit testing with Jest
- Component testing with React Testing Library
- E2E testing with Cypress
- Mocking and stubbing
- Test coverage
- CI/CD pipelines
- Debugging tests
- Performance testing

## Testing Pyramid

```
        E2E Tests (Cypress)
      ↙           ↖
Integration Tests (Jest + RTL)
   ↙                          ↖
Unit Tests (Jest)
```

## Key Patterns

```javascript
// Unit test
test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// Component test
test('renders button', () => {
  render(<Button label="Click me" />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

// E2E test
describe('User Flow', () => {
  it('can login and logout', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## CI/CD

```yaml
# GitHub Actions
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run build
```

---

## Real-World Project

Build test suite for previous project:
- Unit tests (> 80% coverage)
- Component tests
- E2E tests
- CI/CD pipeline

---

## ✅ Checkpoint

- [ ] Write unit tests
- [ ] Test React components
- [ ] Write E2E tests
- [ ] Setup CI/CD
- [ ] Measure coverage