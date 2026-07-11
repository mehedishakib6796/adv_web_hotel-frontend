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
};

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !password) {
      setError('Please Enter Name & Password');
      return;
    }

    try {
      const res = await api.post('/customer/login', { username: name, password });

      if (res.data?.access_token) {
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('user_name', name);
        router.push('/home');
      }
    } catch (err: any) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.bgMain }}
      className="min-h-screen text-white flex flex-col font-sans antialiased"
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

      {/* Login section */}
      <main className="relative flex-grow flex items-center justify-center overflow-hidden px-6 py-32">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480')",
            opacity: 0.3,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div
          className="relative z-10 w-full max-w-md rounded-2xl border p-10 md:p-12 shadow-xl"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-3">
            Welcome, <br className="md:hidden" />
            <span style={{ color: theme.primary }}>Back</span>
          </h1>

          <p style={{ color: theme.textMuted }} className="text-center font-light mb-8">
            Sign in to continue to <span className="text-white font-semibold italic">Hotel Royal</span>.
          </p>

          <div className="min-h-[3rem] mb-2">
            {error && (
              <div
                style={{ backgroundColor: theme.errorBg, color: theme.errorText, borderColor: theme.primary }}
                className="p-3 border-l-4 rounded-r-lg text-sm flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="text-xs font-medium uppercase tracking-widest mb-2 block" style={{ color: theme.textMuted }}>
                Username
              </label>
              <input
                type="text"
                autoComplete="new-password"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ backgroundColor: theme.inputBg, color: '#fff', borderColor: theme.border }}
                className="w-full border rounded-2xl py-3.5 px-5 outline-none transition-all placeholder:text-[#4b5568] focus:border-[#487be8]"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-widest mb-2 block" style={{ color: theme.textMuted }}>
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: theme.inputBg, color: '#fff', borderColor: theme.border }}
                className="w-full border rounded-2xl py-3.5 px-5 outline-none transition-all placeholder:text-[#4b5568] focus:border-[#487be8]"
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: theme.primary }}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:brightness-125 hover:scale-105 active:scale-90 shadow-xl text-lg mt-2"
            >
              Log In
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: theme.textMuted }}>
            New user?{' '}
            <Link href="/signup" style={{ color: theme.primary }} className="font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </main>

      {/* Footer — same as homepage */}
      <footer
        className="py-6 text-center text-xs tracking-[0.3em] uppercase mt-auto border-t"
        style={{ backgroundColor: theme.bgMain, borderColor: theme.border, color: '#4b5568' }}
      >
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>

    </div>
  );
}