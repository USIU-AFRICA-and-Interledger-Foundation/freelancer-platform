'use client';

import { useEffect, useState } from 'react';
import { fetchCurrentUser, updateProfile } from '../../../../lib/api';

export default function FreelancerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCurrentUser();
        const p = res.data.profile || {};
        setProfile(p);
        setFullName(p.full_name || '');
        setMpesaPhone(p.mpesa_phone || '');
        setBio(p.bio || '');
        setSkills((p.skills || []).join(', '));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        fullName,
        mpesaPhone,
        bio,
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      };
      const res = await updateProfile(payload);
      setProfile(res.data);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-sm text-muted">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Freelancer Profile</h1>
        <p className="text-sm text-muted">
          Update your M-Pesa details and how clients see you.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mpesaPhone">
              M-Pesa phone number
            </label>
            <input
              id="mpesaPhone"
              className="form-input"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
              placeholder="+2547..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              className="form-input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell clients about your experience and projects."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills">
              Skills (comma-separated)
            </label>
            <input
              id="skills"
              className="form-input"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, UI Design"
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="text-xs text-emerald-400">{success}</p>}

          <button
            type="submit"
            className="btn btn-glow w-full mt-2"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Save, AlertTriangle, ShieldCheck, User } from 'lucide-react';

export default function FreelancerProfile() {
    const [formData, setFormData] = useState({
        name: 'Alex Kariuki',
        email: 'alex.k@example.com',
        role: 'Full Stack Developer',
        phone: '+254712345678',
        bio: 'Experienced full stack developer specializing in React and Node.js. 5+ years of experience building scalable platforms.',
    });

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold shadow-lg">
                    {formData.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {formData.name}
                        <ShieldCheck size={20} className="text-emerald-500" />
                    </h2>
                    <p className="text-slate-400">{formData.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="form-group mb-0">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input bg-black/40 text-slate-400 cursor-not-allowed"
                                value={formData.email}
                                disabled
                            />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" htmlFor="role">Professional Role</label>
                            <input
                                type="text"
                                id="role"
                                className="form-input"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group mt-5 mb-0">
                        <label className="form-label" htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            rows={4}
                            className="form-input resize-none"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                </div>

                <div className="card relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
                    <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-4 flex items-center justify-between">
                        <span>Payment Settings (M-Pesa)</span>
                        <span className="badge badge-success text-[10px]">VERIFIED</span>
                    </h3>

                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/80 text-sm mb-6 flex items-start gap-3">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                        <p>Your M-Pesa number is used to receive funds automatically via the Interledger Protocol. Modifying it requires SMS verification.</p>
                    </div>

                    <div className="form-group mb-0 max-w-md">
                        <label className="form-label" htmlFor="phone">M-Pesa Phone Number</label>
                        <div className="flex gap-3">
                            <input
                                type="tel"
                                id="phone"
                                className="form-input font-mono tracking-wider flex-1"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <button type="button" className="btn btn-outline shrink-0">
                                Verify
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-6">
                    {saved && <span className="text-emerald-400 text-sm animate-fade-in flex items-center gap-1"><ShieldCheck size={16} /> Saved successfully</span>}
                    <button type="submit" className="btn btn-success" disabled={saving}>
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save size={18} />
                                Save Changes
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
