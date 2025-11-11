# Week 8: Day 4 - Testing & Quality Assurance

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐

---

## Topics

- Unit testing
- Integration testing
- E2E testing
- Mocking strategies
- CI/CD pipelines
- Code coverage

## Tools

- Jest
- React Testing Library
- Cypress/Playwright
- GitHub Actions
- Husky (pre-commit hooks)

## Examples

```javascript
// Unit test
test('Button renders with label', () => {
  render(<Button label="Click me" onClick={() => {}} />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// Integration test
test('Form submission works', async () => {
  render(<LoginForm />);
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('Submit'));
  await screen.findByText('Success');
});

// E2E test with Cypress
it('User can login', () => {
  cy.visit('/login');
  cy.get('input[type=email]').type('test@example.com');
  cy.get('button').click();
  cy.url().should('include', '/dashboard');
});
```

## ✅ Checkpoint

- [ ] Can write tests
- [ ] Know testing strategies
- [ ] Can set up CI/CD
- [ ] Know tools

**Next:** Week 8 Project! 🚀

