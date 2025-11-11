# Week 7: Day 3 - Forms & Validation

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐

---

## Topics

- Form handling
- Form validation
- Custom validation
- Error messages
- Success handling
- Multi-step forms
- File uploads

## Key Libraries

- React Hook Form
- Formik
- Zod/Yup (validation)

## Example

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => console.log(data);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Email required' })} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## ✅ Checkpoint

- [ ] Can handle forms
- [ ] Can validate input
- [ ] Know form libraries

**Next:** API Integration! 🚀

