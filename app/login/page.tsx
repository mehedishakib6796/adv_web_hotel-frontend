"use client";
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
});

const theme = {
  bgMain: "#0b0f1a",
  bgDeep: "#05070c",
  bgCard: "#10151f",
  bgInput: "#05070c",
  gold: "#c9a25b",
  goldSoft: "#e8d6ab",
  textMuted: "#cbd2e0",
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
      className={`${display.variable} ${body.variable} min-h-screen text-white flex flex-col antialiased`}
      style={{ backgroundColor: theme.bgMain, fontFamily: 'var(--font-body)' }}
    >

      {/* Header — same as homepage */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#05070c]/70 backdrop-blur-md border-b" style={{ borderColor: 'rgba(201,162,91,0.2)' }}>
        <div className="max-w-full mx-auto px-6 md:px-16 h-20 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-3 select-none group">
            <span
              className="w-10 h-10 flex items-center justify-center rounded-full border text-sm tracking-widest"
              style={{ borderColor: theme.gold, color: theme.gold, fontFamily: 'var(--font-display)' }}
            >
              HR
            </span>
            <span
              className="text-xl md:text-2xl uppercase tracking-[0.2em] font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Hotel <span style={{ color: theme.gold }}>Royal</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Login section */}
      <main className="relative flex-grow flex items-center justify-center overflow-hidden px-6 py-32">

        {/* Background image, same style as hero */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480')",
            opacity: 0.18
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at center, transparent 20%, ${theme.bgDeep} 90%)` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div
          className="relative z-10 w-full max-w-md rounded-2xl border p-10 md:p-12 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(16,21,31,0.85)', borderColor: 'rgba(201,162,91,0.25)' }}
        >
          <p
            className="text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-3 text-center"
            style={{ color: theme.goldSoft }}
          >
            Welcome Back
          </p>

          <h1
            className="text-3xl md:text-4xl mb-6 text-center leading-none select-none"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            Sign <span style={{ color: theme.gold }}>In</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-10" style={{ backgroundColor: theme.gold }} />
            <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: theme.gold }} />
            <span className="h-px w-10" style={{ backgroundColor: theme.gold }} />
          </div>

          <div className="min-h-[3rem] mb-2">
            {error && (
              <div
                style={{ backgroundColor: theme.errorBg, color: theme.errorText, borderColor: theme.gold }}
                className="p-3 border-l-4 rounded-r-lg text-sm flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label
                className="text-xs font-medium uppercase tracking-widest mb-2 block"
                style={{ color: theme.goldSoft }}
              >
                Username
              </label>
              <input
                type="text"
                autoComplete="new-password"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ backgroundColor: theme.bgInput, color: '#fff', borderColor: 'rgba(201,162,91,0.25)' }}
                className="w-full border rounded-xl py-3.5 px-5 outline-none transition-all placeholder:text-[#5a6072] focus:border-[#c9a25b]"
              />
            </div>

            <div>
              <label
                className="text-xs font-medium uppercase tracking-widest mb-2 block"
                style={{ color: theme.goldSoft }}
              >
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: theme.bgInput, color: '#fff', borderColor: 'rgba(201,162,91,0.25)' }}
                className="w-full border rounded-xl py-3.5 px-5 outline-none transition-all placeholder:text-[#5a6072] focus:border-[#c9a25b]"
              />
            </div>

            <button
              type="submit"
              style={{ borderColor: theme.gold, color: theme.gold }}
              className="w-full border rounded-full py-3.5 text-sm font-medium uppercase tracking-widest transition-all duration-300 hover:text-[#05070c] mt-2"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Log In
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: theme.textMuted }}>
            New user?{' '}
            <Link href="/signup" style={{ color: theme.gold }} className="font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </main>

      {/* Footer — same as homepage */}
      <footer
        className="py-6 text-center text-xs tracking-[0.3em] uppercase mt-auto border-t"
        style={{ backgroundColor: theme.bgDeep, borderColor: 'rgba(201,162,91,0.15)', color: '#5a6072' }}
      >
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>

    </div>
  );
}