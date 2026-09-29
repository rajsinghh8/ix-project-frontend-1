import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Sparkles } from 'lucide-react';
import { validateEmail } from '../validation';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextError = validateEmail(email);
    setError(nextError);
    if (nextError) {
      return;
    }
    // MOCK: no real password-reset backend exists yet; this only simulates the request being sent.
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark bg-gradient-radial px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-white tracking-tight">Reset your password</h1>
          <p className="text-sm text-white/60 mt-1 text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-success-light text-success flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-white/80 text-sm">
                If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
              </p>
              <Link to="/login" className="inline-block text-primary-300 hover:text-primary-200 text-sm font-medium">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-white/80 mb-1.5">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="you@company.com"
                />
                <p className="text-xs mt-1.5 text-white/40">
                  {error ? <span className="text-danger-light">{error}</span> : 'We will email you a reset link'}
                </p>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-primary shadow-glow"
              >
                Send reset link
              </button>
              <p className="text-center text-sm text-white/50">
                <Link to="/login" className="text-primary-300 hover:text-primary-200 font-medium">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
