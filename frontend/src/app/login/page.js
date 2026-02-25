'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to log in. Check your credentials.';
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-muted mb-6">
          Log in to manage your payments and freelancers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <span className="form-error">{error}</span>}

          <button
            type="submit"
            className="btn btn-glow w-full mt-2"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-muted mt-4 text-center">
          New here?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logging in:', formData);
        // TODO: Connect to actual backend API, then redirect based on role
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md card animate-fade-in z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform">
                        <span className="text-white font-bold text-lg">FP</span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Log in to manage your payments</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group stagger-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group stagger-2 animate-fade-in" style={{ animationDelay: '150ms' }}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="form-label mb-0" htmlFor="password">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-6 animate-fade-in"
                        style={{ animationDelay: '200ms' }}
                    >
                        Log In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
