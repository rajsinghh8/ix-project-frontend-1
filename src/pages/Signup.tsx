import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { signup } from '../auth/auth';
import { validateEmail, validatePassword, validateRequired } from '../validation';

interface FormErrors {
  name: string;
  email: string;
  password: string;
}

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    validateRequired(name, 'Name') === '' &&
    validateEmail(email) === '' &&
    validatePassword(password) === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      name: validateRequired(name, 'Name'),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.email || nextErrors.password) {
      return;
    }
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark bg-gradient-radial px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-white tracking-tight">Create your account</h1>
          <p className="text-sm text-white/60 mt-1">Start planning unforgettable events</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1.5">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Jane Doe"
            />
            {errors.name && <p className="text-xs mt-1.5 text-danger-light">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-white/80 mb-1.5">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="you@company.com"
            />
            {errors.email && <p className="text-xs mt-1.5 text-danger-light">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-white/80 mb-1.5">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="••••••••"
            />
            <p className="text-xs mt-1.5 text-white/40">
              {errors.password ? <span className="text-danger-light">{errors.password}</span> : 'At least 6 characters'}
            </p>
          </div>

          {formError && (
            <div className="text-sm text-danger-light bg-danger/10 border border-danger/30 rounded-xl px-3 py-2.5">
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-primary shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-300 hover:text-primary-200 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
