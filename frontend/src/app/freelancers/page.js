'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFreelancers } from '../../lib/api';

export default function FreelancersDirectoryPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchFreelancers();
        setFreelancers(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load freelancers');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Featured Freelancers</h1>
          <p className="text-sm text-muted">
            Discover Kenyan talent ready to be paid via M-Pesa.
          </p>
        </div>
        <Link href="/" className="btn btn-ghost text-xs">
          Back home
        </Link>
      </header>

      <div className="space-y-4">
        {loading && <p className="text-sm text-muted">Loading freelancers…</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !freelancers.length && !error && (
          <p className="text-sm text-muted">No freelancers found yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {freelancers.map((f) => (
            <div key={f.id} className="card flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm border border-white/10">
                    {(f.name || f.email || 'F')[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{f.name || f.email}</p>
                    <p className="text-xs text-muted">{f.email}</p>
                  </div>
                </div>
              </div>
              {f.skills && f.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {f.skills.map((skill) => (
                    <span key={skill} className="badge badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">
                  M-Pesa: {f.mpesaPhone || 'Not provided'}
                </span>
                <Link
                  href="/dashboard/client/pay"
                  className="btn btn-outline text-xs px-3 py-1"
                >
                  Pay this freelancer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

