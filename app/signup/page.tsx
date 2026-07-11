"use client";
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const theme = {
  bgMain: "#0f172a",
  primary: "#487be8",
  textMuted: "#94a3b8",
  cardBg: "#111827",
  inputBg: "#0f172a",
  border: "rgba(72,123,232,0.25)",
  errorBg: "rgba(136,41,41,0.35)",
  errorText: "#f2a9a9",
  successBg: "rgba(43,110,80,0.3)",
  successText: "#8fd9b6",
};

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords Mismatch');
      return;
    }

    try {
      const res = await api.post('/customer/signup', {
        username: name,
        password: password
      });

      if (res.status === 201 || res.status === 200) {
        setSuccess('Account Created Successfully! Redirecting...');

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Having trouble signing up.';
      setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.bgMain }}
      className="h-screen w-screen text-white flex flex-col font-sans antialiased overflow-hidden relative"
    >

      {/* Header — same as homepage */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0f172a]/70 backdrop-blur-md border-b" style={{ borderColor: theme.border }}>
        <div className="max-w-full mx-auto px-6 md:px-16 h-20 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-3 select-none group">
            <span
              className="w-10 h-10 flex items-center justify-center rounded-full border text-sm font-bold tracking-widest"
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              HR
            </span>
            <span className="text-xl md:text-2xl font-black tracking-tighter">
              Hotel <span style={{ color: theme.primary }}>Royal</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 md:px-6 pt-20 pb-16">
        <div
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
          className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden border max-h-[82vh]"
        >

          {/* Image side */}
          <div className="hidden md:block md:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480"
              className="w-full h-full object-cover"
              style={{ opacity: 0.55 }}
              alt="Signup Visual"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${theme.cardBg})` }} />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-2xl font-black tracking-tighter leading-snug">
                Join the circle of<br />
                <span style={{ color: theme.primary }}>distinguished guests.</span>
              </p>
            </div>
          </div>

          {/* Form side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[82vh] scrollbar-thin">

            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-1">
              Create <span style={{ color: theme.primary }}>Account</span>
            </h1>
            <p style={{ color: theme.textMuted }} className="text-sm font-light mb-5">
              Create your Hotel Royal account
            </p>

            {success && (
              <div
                style={{ backgroundColor: theme.successBg, color: theme.successText, borderColor: theme.primary }}
                className="mb-4 p-3 border-l-4 rounded-r-lg text-sm"
              >
                ✅ {success}
              </div>
            )}

            {error && (
              <div
                style={{ backgroundColor: theme.errorBg, color: theme.errorText, borderColor: theme.primary }}
                className="mb-4 p-3 border-l-4 rounded-r-lg text-sm"
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3.5" autoComplete="off">

              <div>
                <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.textMuted }}>Full Name</label>
                <input
                  type="text"
                  autoComplete="new-password"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: theme.inputBg, color: '#fff', borderColor: theme.border }}
                  className="w-full border rounded-2xl py-2.5 px-4 outline-none transition-all placeholder:text-[#4b5568] text-sm focus:border-[#487be8]"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.textMuted }}>Email</label>
                <input
                  type="email"
                  autoComplete="new-password"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ backgroundColor: theme.inputBg, color: '#fff', borderColor: theme.border }}
                  className="w-full border rounded-2xl py-2.5 px-4 outline-none transition-all placeholder:text-[#4b5568] text-sm focus:border-[#487be8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.textMuted }}>Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: theme.inputBg, color: '#fff', borderColor: theme.border }}
                    className="w-full border rounded-2xl py-2.5 px-4 outline-none transition-all placeholder:text-[#4b5568] text-sm focus:border-[#487be8]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.textMuted }}>Confirm Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ backgroundColor: theme.inputBg, color: '#fff', borderColor: theme.border }}
                    className="w-full border rounded-2xl py-2.5 px-4 outline-none transition-all placeholder:text-[#4b5568] text-sm focus:border-[#487be8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: theme.primary }}
                className="w-full text-white font-bold py-3.5 rounded-2xl transition-all duration-200 hover:brightness-125 hover:scale-105 active:scale-90 shadow-xl text-base mt-2"
              >
                Create Account
              </button>

            </form>

            <p className="mt-5 text-center text-sm" style={{ color: theme.textMuted }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: theme.primary }} className="font-medium hover:underline">Login here</Link>
            </p>

          </div>
        </div>
      </main>

      {/* Footer — same as homepage */}
      <footer
        className="py-4 text-center text-xs tracking-[0.3em] uppercase w-full border-t"
        style={{ backgroundColor: theme.bgMain, borderColor: theme.border, color: '#4b5568' }}
      >
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>

    </div>
  );
}