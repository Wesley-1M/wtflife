# Week 6: Day 5 - Form Handling & Validation

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 5-6 Days 1-4

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Build controlled forms in React
- ✅ Implement client-side validation
- ✅ Use form libraries (React Hook Form)
- ✅ Handle form submission
- ✅ Create reusable form components
- ✅ Handle complex multi-step forms

---

## 1️⃣ Controlled Components

### Basic Form Input

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Controlled vs Uncontrolled

```jsx
// ❌ UNCONTROLLED - React doesn't manage state
function Form() {
  const inputRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value); // Direct DOM access
  };

  return <input ref={inputRef} />;
}

// ✅ CONTROLLED - React manages state
function Form() {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(value);
  };

  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

---

## 2️⃣ Form Validation

### Client-side Validation

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form is valid!', formData);
      // Submit to server
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

---

## 3️⃣ React Hook Form (Advanced)

### Installation & Setup

```bash
npm install react-hook-form
```

### Basic Usage

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Invalid email format'
            }
          })}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

### Advanced Validation

```jsx
import { useForm, Controller } from 'react-hook-form';

function AdvancedForm() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('username', {
          required: 'Required',
          validate: {
            notAdmin: (value) => value !== 'admin' || 'Cannot use admin',
            async available(value) {
              const response = await fetch(`/api/check-username/${value}`);
              return response.ok || 'Username taken';
            }
          }
        })}
      />
      {errors.username && <span>{errors.username.message}</span>}

      <Controller
        name="age"
        control={control}
        rules={{
          validate: (value) => value >= 18 || 'Must be 18 or older'
        }}
        render={({ field }) => <input type="number" {...field} />}
      />
      {errors.age && <span>{errors.age.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 4️⃣ Multi-Step Forms

### Using State for Steps

```jsx
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final data:', formData);
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      return formData.firstName && formData.lastName;
    }
    if (stepNum === 2) {
      return formData.email;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 && (
        <div>
          <h2>Personal Information</h2>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Contact Information</h2>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Address</h2>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
        </div>
      )}

      <div>
        {step > 1 && <button onClick={handlePrev}>Previous</button>}
        {step < 3 && <button onClick={handleNext}>Next</button>}
        {step === 3 && <button type="submit">Submit</button>}
      </div>

      <div>Step {step} of 3</div>
    </form>
  );
}
```

---

## 5️⃣ File Uploads

```jsx
function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('File uploaded successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" style={{ maxWidth: '200px' }} />}
      <button type="submit" disabled={!file}>Upload</button>
    </form>
  );
}
```

---

## 🎯 Form Best Practices

- ✅ Provide clear validation feedback
- ✅ Disable submit button while submitting
- ✅ Use proper input types
- ✅ Validate on both client and server
- ✅ Handle errors gracefully
- ✅ Provide helpful error messages

---

## 📝 Practice Exercises

### Exercise 1: Simple Form
Create a form with fields: name, email, message  
Add validation and show errors

### Exercise 2: React Hook Form
Convert a form to use React Hook Form  
Add custom validation

### Exercise 3: Multi-Step Form
Build a 3-step registration form with progress indicator

### Exercise 4: File Upload
Create a form that uploads files to a server

---

## ✅ Summary

- **Controlled components** let React manage form state
- **Client-side validation** provides immediate feedback
- **React Hook Form** reduces boilerplate
- **Multi-step forms** break complex forms into steps
- **File uploads** use FormData API
- **Always validate on server too**!

---

## 🔗 Next Steps

**Next Week (Week 7):** Build & Deploy - Ship your code!  
**Next 8 Weeks:** Advanced topics and final projects
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

