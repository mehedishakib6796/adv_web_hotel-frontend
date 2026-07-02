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
      className={`${display.variable} ${body.variable} h-screen w-screen text-white flex flex-col antialiased overflow-hidden relative`}
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

      <main className="flex-grow flex items-center justify-center px-4 md:px-6 pt-20 pb-16">
        <div
          style={{ backgroundColor: theme.bgCard, borderColor: 'rgba(201,162,91,0.25)' }}
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
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, ${theme.bgCard})` }} />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="h-px w-10" style={{ backgroundColor: theme.gold }} />
                <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: theme.gold }} />
              </div>
              <p
                className="text-2xl leading-snug"
                style={{ fontFamily: 'var(--font-display)', color: theme.goldSoft }}
              >
                Join the circle of<br />distinguished guests.
              </p>
            </div>
          </div>

          {/* Form side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[82vh] scrollbar-thin">

            <p
              className="text-xs uppercase tracking-[0.4em] font-medium mb-3"
              style={{ color: theme.goldSoft }}
            >
              Become a Member
            </p>
            <h1
              className="text-3xl md:text-4xl mb-1 leading-none"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              Sign <span style={{ color: theme.gold }}>Up</span>
            </h1>
            <p style={{ color: theme.textMuted }} className="text-sm mb-5">Create your Hotel Royal account</p>

            {success && (
              <div
                style={{ backgroundColor: theme.successBg, color: theme.successText, borderColor: theme.gold }}
                className="mb-4 p-3 border-l-4 rounded-r-lg text-sm"
              >
                ✅ {success}
              </div>
            )}

            {error && (
              <div
                style={{ backgroundColor: theme.errorBg, color: theme.errorText, borderColor: theme.gold }}
                className="mb-4 p-3 border-l-4 rounded-r-lg text-sm"
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3.5" autoComplete="off">

              <div>
                <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.goldSoft }}>Full Name</label>
                <input
                  type="text"
                  autoComplete="new-password"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: theme.bgInput, color: '#fff', borderColor: 'rgba(201,162,91,0.25)' }}
                  className="w-full border rounded-xl py-2.5 px-4 outline-none transition-all placeholder:text-[#5a6072] text-sm focus:border-[#c9a25b]"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.goldSoft }}>Email</label>
                <input
                  type="email"
                  autoComplete="new-password"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ backgroundColor: theme.bgInput, color: '#fff', borderColor: 'rgba(201,162,91,0.25)' }}
                  className="w-full border rounded-xl py-2.5 px-4 outline-none transition-all placeholder:text-[#5a6072] text-sm focus:border-[#c9a25b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.goldSoft }}>Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: theme.bgInput, color: '#fff', borderColor: 'rgba(201,162,91,0.25)' }}
                    className="w-full border rounded-xl py-2.5 px-4 outline-none transition-all placeholder:text-[#5a6072] text-sm focus:border-[#c9a25b]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-widest mb-1 block" style={{ color: theme.goldSoft }}>Confirm Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ backgroundColor: theme.bgInput, color: '#fff', borderColor: 'rgba(201,162,91,0.25)' }}
                    className="w-full border rounded-xl py-2.5 px-4 outline-none transition-all placeholder:text-[#5a6072] text-sm focus:border-[#c9a25b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ borderColor: theme.gold, color: theme.gold }}
                className="w-full border rounded-full py-3 text-sm font-medium uppercase tracking-widest transition-all duration-300 hover:text-[#05070c] mt-2"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Create Account
              </button>

            </form>

            <p className="mt-5 text-center text-sm" style={{ color: theme.textMuted }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: theme.gold }} className="font-medium hover:underline">Login here</Link>
            </p>

          </div>
        </div>
      </main>

      {/* Footer — same as homepage */}
      <footer
        className="py-4 text-center text-xs tracking-[0.3em] uppercase w-full border-t"
        style={{ backgroundColor: theme.bgDeep, borderColor: 'rgba(201,162,91,0.15)', color: '#5a6072' }}
      >
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>

    </div>
  );
}