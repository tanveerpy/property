import React, { useState } from 'react';
import { Building2, Eye, EyeOff, LogIn, UserPlus, ShieldCheck, Briefcase, Building, User } from 'lucide-react';

const ROLES = [
  { id: 'admin',  label: 'Admin',        icon: ShieldCheck, color: 'emerald', hint: 'Full system access' },
  { id: 'agent',  label: 'Agent',        icon: Briefcase,   color: 'blue',    hint: 'Manage listings & deals' },
  { id: 'office', label: 'Office',       icon: Building,    color: 'violet',  hint: 'Branch management' },
  { id: 'guest',  label: 'Guest / Demo', icon: User,        color: 'slate',   hint: 'Browse properties' },
];

const DEMO_CREDENTIALS = {
  admin:  { username: 'admin',  password: 'admin123' },
  agent:  { username: 'agent',  password: 'agent123' },
  office: { username: 'office', password: 'office123' },
  guest:  { username: 'guest',  password: '' },
};

export default function LoginPage({ onLogin, onBack, initialTab = 'login' }) {
  const [tab, setTab]             = useState(initialTab); // 'login' | 'signup'
  const [role, setRole]           = useState('admin');
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // Signup-only fields
  const [fullName, setFullName]   = useState('');
  const [email, setEmail]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const fillDemo = () => {
    const creds = DEMO_CREDENTIALS[role];
    setUsername(creds.username);
    setPassword(creds.password);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Guest: skip auth entirely
    if (role === 'guest') {
      onLogin({ username: 'Guest', role: 'guest' });
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password, role }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      // Offline / GitHub Pages: allow demo fallback
      const creds = DEMO_CREDENTIALS[role];
      if (username === creds.username && password === creds.password) {
        onLogin({ username, role });
      } else {
        setError('Cannot reach server. Use the demo credentials to continue.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPw) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password, email, fullName, role }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Signup failed. Try a different username.');
      }
    } catch {
      setError('Cannot reach server. Signup requires a live backend.');
    } finally {
      setLoading(false);
    }
  };

  const activeRole = ROLES.find(r => r.id === role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">

      {/* Decorative background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm font-medium mb-6 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Homepage
          </button>
        )}

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-900/60 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            MyDream<span className="text-emerald-400">Home</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real Estate Management System · Pakistan</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl p-8">

          {/* Login / Signup tabs */}
          <div className="flex bg-slate-800/70 rounded-xl p-1 mb-6 gap-1">
            {[
              { id: 'login',  label: 'Sign In',  icon: LogIn },
              { id: 'signup', label: 'Sign Up',  icon: UserPlus },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setTab(id); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Login as
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setRole(id); setError(''); }}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs font-medium transition-all duration-150 ${
                    role === id
                      ? 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${role === id ? 'text-emerald-400' : ''}`} />
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 text-center">{activeRole?.hint}</p>
          </div>

          {/* Form */}
          <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-4">

            {/* Full name — signup only */}
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Muhammad Ali"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                placeholder={role === 'guest' ? 'guest' : 'Enter your username'}
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={role === 'guest'}
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-40"
              />
            </div>

            {/* Email — signup only */}
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            )}

            {/* Password */}
            {role !== 'guest' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 pr-11 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm password — signup only */}
            {tab === 'signup' && role !== 'guest' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 text-xs rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              ) : tab === 'login' ? (
                <><LogIn className="w-4 h-4" /> Sign In</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create Account</>
              )}
            </button>

            {/* Demo fill — login tab only */}
            {tab === 'login' && role !== 'guest' && (
              <button
                type="button"
                onClick={fillDemo}
                className="w-full py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-emerald-300 hover:border-emerald-700 text-xs font-medium transition-all"
              >
                Fill demo credentials for <span className="text-emerald-400 capitalize">{role}</span>
              </button>
            )}
          </form>
        </div>

        {/* Demo hint */}
        <p className="text-center text-slate-600 text-xs mt-4">
          Demo · admin / admin123 &nbsp;|&nbsp; agent / agent123 &nbsp;|&nbsp; office / office123
        </p>
      </div>
    </div>
  );
}
