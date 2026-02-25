'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register({
        email,
        password,
        role,
        name,
        mpesaPhone: role === 'freelancer' ? mpesaPhone : undefined
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to register. Please try again.';
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg card">
        <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
        <p className="text-sm text-muted mb-6">
          Choose whether you are a client or a freelancer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <span className="form-label">I am a</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`btn w-full ${role === 'client' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRole('client')}
              >
                Client
              </button>
              <button
                type="button"
                className={`btn w-full ${role === 'freelancer' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRole('freelancer')}
              >
                Freelancer
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {role === 'freelancer' && (
            <div className="form-group">
              <label htmlFor="mpesaPhone" className="form-label">
                M-Pesa phone number
              </label>
              <input
                id="mpesaPhone"
                type="tel"
                className="form-input"
                placeholder="+2547..."
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                required
              />
            </div>
          )}

          {error && <span className="form-error">{error}</span>}

          <button
            type="submit"
            className="btn btn-glow w-full mt-2"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-xs text-muted mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
    const [role, setRole] = useState('client');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registering:', { ...formData, role });
        // TODO: Connect to actual backend API
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

            <div className="w-full max-w-md card animate-fade-in z-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">FP</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
                    <p className="text-slate-400">Join RafikiPay as a client or freelancer</p>
                </div>

                {/* Role Selection */}
                <div className="flex p-1 bg-black/30 rounded-lg mb-6">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'client' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                        onClick={() => setRole('client')}
                    >
                        Client
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'freelancer' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                        onClick={() => setRole('freelancer')}
                    >
                        Freelancer
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group stagger-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group stagger-2 animate-fade-in" style={{ animationDelay: '150ms' }}>
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

                    <div className="form-group stagger-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <label className="form-label" htmlFor="password">Password</label>
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

                    {role === 'freelancer' && (
                        <div className="form-group stagger-4 animate-fade-in" style={{ animationDelay: '250ms' }}>
                            <label className="form-label" htmlFor="phone">M-Pesa Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                className="form-input"
                                placeholder="254700000000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required={role === 'freelancer'}
                            />
                            <span className="text-xs text-slate-500 mt-1 block">Format: 254XXXXXXXXX</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`btn w-full mt-4 ${role === 'client' ? 'btn-primary' : 'btn-success'} animate-fade-in`}
                        style={{ animationDelay: '300ms' }}
                    >
                        Create {role === 'client' ? 'Client' : 'Freelancer'} Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
