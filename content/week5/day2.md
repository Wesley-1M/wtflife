# Week 5: Day 2 - Components & JSX

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐ (Beginner to Intermediate)  
**Prerequisites:** Week 5 Day 1 (React Fundamentals)

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Create functional components
- ✅ Understand component composition
- ✅ Use props to pass data to components
- ✅ Work with JSX syntax effectively
- ✅ Build reusable component libraries
- ✅ Manage component structure and organization

---

## 1️⃣ Understanding Functional Components

### What is a Component?
A component is a JavaScript function that returns JSX (React elements). It's a reusable piece of UI.

```jsx
// Simple functional component
function Welcome() {
  return <h1>Hello, React!</h1>;
}

// Using arrow function
const Greeting = () => {
  return <div>Hi there!</div>;
};

// Component with more structure
function Button() {
  return (
    <button style={{ padding: '10px 20px' }}>
      Click me
    </button>
  );
}
```

### Component Naming Convention
```javascript
// ✅ CORRECT - PascalCase (starts with capital letter)
function UserProfile() {}
const LoginForm = () => {};

// ❌ WRONG - lowercase (React treats as HTML tags)
function userProfile() {}
const loginForm = () => {};
```

### Why This Matters
React distinguishes between:
- **Components** (PascalCase): Custom React components
- **HTML tags** (lowercase): Built-in HTML elements like `<div>`, `<p>`

```jsx
// ✅ This is treated as a React component
<MyComponent />

// ❌ This tries to render an HTML element named "mycomponent" (doesn't exist)
<myComponent />
```

---

## 2️⃣ JSX Syntax Deep Dive

### Multi-line JSX
```jsx
// Single line - no parentheses needed
function Alert() {
  return <div>Alert message</div>;
}

// Multi-line - need parentheses
function ComplexUI() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
      <button>Button</button>
    </div>
  );
}
```

### JSX with Expressions
```jsx
function Greeting() {
  const name = 'Sarah';
  const hour = new Date().getHours();
  
  return (
    <div>
      {/* Variables */}
      <h1>Hello, {name}!</h1>
      
      {/* Expressions */}
      <p>It's {hour * 60} minutes into the day</p>
      
      {/* Math */}
      <p>Total: {5 + 3}</p>
      
      {/* Objects (be careful!) */}
      <p>{{ key: 'value' }}</p> {/* ❌ Error! */}
      
      {/* Arrays work */}
      <p>{['a', 'b', 'c']}</p> {/* ✅ Renders: abc */}
    </div>
  );
}
```

### Common JSX Gotchas
```jsx
// 1. className instead of class
function Form() {
  return <input className="text-field" />;
}

// 2. Attributes with hyphens use camelCase
function Config() {
  return (
    <div 
      data-testid="config"           {/* ❌ React won't understand */}
      dataTestId="config"             {/* ✅ Better approach */}
      onClick={handleClick}           {/* ✅ camelCase for events */}
    >
      Settings
    </div>
  );
}

// 3. Style object for inline styles
function StyledBox() {
  const styles = {
    backgroundColor: 'blue',        {/* camelCase */}
    fontSize: '16px',               {/* quoted for units */}
    padding: 20                      {/* just numbers for pixels */}
  };
  
  return <div style={styles}>Box</div>;
}

// 4. Conditional rendering
function Alert({ isVisible }) {
  return (
    <div>
      {isVisible && <p>Alert!</p>}
      {isVisible ? <p>Show</p> : <p>Hide</p>}
    </div>
  );
}
```

---

## 3️⃣ Props - Passing Data to Components

### Basic Props
```jsx
// Parent component
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
      <Welcome name="Charlie" />
    </div>
  );
}

// Child component
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

### Destructuring Props
```jsx
// Instead of props.name, props.age
function Welcome({ name, age }) {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
    </div>
  );
}

// Using it
<Welcome name="Emma" age={25} />
```

### Multiple Props Types
```jsx
function ProductCard({ title, price, inStock, onClick, image }) {
  return (
    <div>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>${price}</p>
      <p>{inStock ? 'In Stock' : 'Out of Stock'}</p>
      <button onClick={onClick}>Add to Cart</button>
    </div>
  );
}

// Usage
function Store() {
  return (
    <ProductCard 
      title="Laptop"
      price={999}
      inStock={true}
      image="laptop.jpg"
      onClick={() => alert('Added to cart')}
    />
  );
}
```

### Props are Read-Only
```jsx
// ❌ WRONG - Don't modify props
function UserCard(props) {
  props.name = 'John'; // ❌ Error!
  return <h1>{props.name}</h1>;
}

// ✅ CORRECT - Use local variables
function UserCard({ name }) {
  const greeting = `Hello, ${name}`;
  return <h1>{greeting}</h1>;
}
```

---

## 4️⃣ Component Composition

### Nesting Components
```jsx
// Small, focused components
function Avatar({ image, name }) {
  return (
    <div className="avatar">
      <img src={image} alt={name} />
      <p>{name}</p>
    </div>
  );
}

function Comment({ author, text, timestamp }) {
  return (
    <div className="comment">
      <Avatar image={author.image} name={author.name} />
      <div>
        <p>{text}</p>
        <small>{timestamp}</small>
      </div>
    </div>
  );
}

function CommentThread({ comments }) {
  return (
    <div className="thread">
      {comments.map(comment => (
        <Comment
          key={comment.id}
          author={comment.author}
          text={comment.text}
          timestamp={comment.timestamp}
        />
      ))}
    </div>
  );
}
```

### Component Lists
```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" defaultChecked={todo.completed} />
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}

// Using it
function App() {
  const todos = [
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy app', completed: false }
  ];
  
  return <TodoList todos={todos} />;
}
```

### Children Component Pattern
```jsx
// Card component that accepts children
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Using Card with different children
function App() {
  return (
    <div>
      <Card title="Welcome">
        <p>This is card content</p>
      </Card>
      
      <Card title="Features">
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      </Card>
    </div>
  );
}
```

---

## 5️⃣ Component Structure Best Practices

### File Organization
```
src/
├── components/
│   ├── Header.jsx          // Main header
│   ├── Navigation.jsx      // Navigation bar
│   ├── Card.jsx            // Reusable card
│   ├── Button.jsx          // Reusable button
│   └── layout/
│       ├── Sidebar.jsx
│       └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   └── Contact.jsx
└── App.jsx
```

### Naming Conventions
```jsx
// ✅ Component names clearly describe what they do
function UserProfile() {}
function SubmitButton() {}
function BlogPostCard() {}

// ❌ Vague names
function Component1() {}
function Stuff() {}
function Thing() {}
```

### Single Responsibility
```jsx
// ❌ Too much responsibility
function Dashboard() {
  return (
    <div>
      <header>...</header>
      <nav>...</nav>
      <main>
        {/* Lots of dashboard logic here */}
      </main>
      <footer>...</footer>
    </div>
  );
}

// ✅ Separated concerns
function Header() { return <header>...</header>; }
function Navigation() { return <nav>...</nav>; }
function DashboardContent() { return <main>...</main>; }
function Footer() { return <footer>...</footer>; }

function Dashboard() {
  return (
    <div>
      <Header />
      <Navigation />
      <DashboardContent />
      <Footer />
    </div>
  );
}
```

---

## 6️⃣ Real-World Example: Building a Component Library

```jsx
// Button.jsx - Reusable button
function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false 
}) {
  const className = `btn btn-${variant} btn-${size}`;
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// Card.jsx - Reusable card
function Card({ title, description, actions, children }) {
  return (
    <div className="card">
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {children}
      {actions && (
        <div className="card-actions">
          {actions.map((action, i) => (
            <Button 
              key={i}
              label={action.label}
              onClick={action.onClick}
              variant={action.variant || 'secondary'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// UserCard.jsx - Specialized card
function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card
      title={user.name}
      description={user.email}
      actions={[
        { label: 'Edit', onClick: onEdit, variant: 'primary' },
        { label: 'Delete', onClick: onDelete, variant: 'danger' }
      ]}
    >
      <p>Joined: {user.joinDate}</p>
    </Card>
  );
}

// Using all together
function UserList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', joinDate: '2024-01-15' },
    { id: 2, name: 'Bob', email: 'bob@example.com', joinDate: '2024-02-20' }
  ];
  
  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={() => alert(`Edit ${user.name}`)}
          onDelete={() => alert(`Delete ${user.name}`)}
        />
      ))}
    </div>
  );
}
```

---

## 🎯 Try It Yourself

### Exercise 1: Create a Button Component
Create a button component that:
- Takes `text` and `onClick` props
- Has two variants: "primary" and "secondary"
- Uses different styles for each variant

```jsx
function Button({ text, onClick, variant }) {
  // TODO: Implement
}

// Usage:
// <Button text="Click me" variant="primary" onClick={() => {}} />
```

### Exercise 2: Build a Product Card
Create a component that displays:
- Product image
- Product name
- Price
- "Add to Cart" button
- Stock status

```jsx
function ProductCard({ product }) {
  // TODO: Implement
}
```

### Exercise 3: Create a Comment Component
Create a component that:
- Displays user avatar
- Shows comment text
- Displays timestamp
- Has like/unlike buttons

```jsx
function Comment({ author, text, timestamp, likes }) {
  // TODO: Implement
}
```

---

## ✅ Checkpoint

Before moving to Day 3, you should:
- [ ] Understand functional components
- [ ] Know JSX syntax rules
- [ ] Can pass and use props
- [ ] Understand component composition
- [ ] Can create reusable components
- [ ] Know best practices

**Ready for Day 3?** Let's move to State Management with Hooks! 🚀

---

## 📚 Key Takeaways

| Concept | Description |
|---------|-------------|
| **Component** | A JS function returning JSX |
| **JSX** | Syntax extension for creating elements |
| **Props** | Read-only data passed to components |
| **Composition** | Building UIs from smaller components |
| **Children** | Props that represent nested content |
| **Destructuring** | Extract props directly in parameters |

