import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { login } from '../auth/auth';
import { validateEmail, validateRequired } from '../validation';

export function Login() {
  const navigate = useNavigate();
  // MOCK: prefilled with the demo admin login — remove before wiring a real backend.
  const [email, setEmail] = useState('admin@eventforge.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = validateEmail(email) === '' && validateRequired(password, 'Password') === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextEmailError = validateEmail(email);
    const nextPasswordError = validateRequired(password, 'Password');
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const success = await login(email, password);
      if (!success) {
        setFormError('Invalid email or password');
        setIsSubmitting(false);
        return;
      }
      navigate('/dashboard');
    } catch {
      setFormError('Something went wrong. Please try again.');
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
          <h1 className="text-2xl font-display font-semibold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/60 mt-1">Sign in to your EventForge workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="you@company.com"
            />
            <p className="text-xs mt-1.5 text-white/40">
              {emailError ? <span className="text-danger-light">{emailError}</span> : 'Use the email associated with your account'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary-300 hover:text-primary-200">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs mt-1.5 text-white/40">
              {passwordError ? <span className="text-danger-light">{passwordError}</span> : 'At least 6 characters'}
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
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-white/50">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-300 hover:text-primary-200 font-medium">
              Sign up
            </Link>
          </p>
        </form>

        <div className="mt-6 text-center text-xs text-white/40 space-y-1">
          <p>Demo accounts:</p>
          <p>admin@eventforge.com · planner@eventforge.com · member@eventforge.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}
