import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark bg-gradient-radial px-4">
      <div className="text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-semibold mb-2">404</h1>
        <p className="text-white/70 mb-6">This page doesn't exist or may have moved.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-primary shadow-glow"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
