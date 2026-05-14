"use client";
import { useState } from 'react';
import api from '../../lib/api'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const colors = {
  bgOuter: "#0f172a",
  bgCard: "#1e293b",  
  bgInput: "#0f172a",
  primary: "#2563eb",
  white: "#ffffff",
  textGray: "#94a3b8",
  errorBg: "#450a0a",
  errorText: "#f87171"
};

export default function LoginPage() {
  const [name, setName] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ভ্যালিডেশন
    if (!name || !password) {
      setError('Please Enter Name & Password');
      return;
    }

    try {
      const res = await api.post('/customer/login', { username: name, password });
      if (res.data?.access_token) {
        localStorage.setItem('access_token', res.data.access_token);
        router.push('/home'); 
      }
    } catch (err: any) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div 
      style={{ backgroundColor: colors.bgOuter }} 
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div 
        style={{ backgroundColor: colors.bgCard }} 
        className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480" 
            className="w-full h-full object-cover opacity-80" 
            alt="Login Visual"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
          <h1 style={{ color: colors.white }} className="text-4xl font-extrabold mb-2">Login</h1>
          <p style={{ color: colors.textGray }} className="text-lg mb-4">Access Hotel Royal</p>

          {/* এরর মেসেজ এরিয়া - ফিক্সড হাইট যাতে লেআউট না নড়ে */}
          <div className="h-16 mb-2"> 
            {error && (
              <div 
                style={{ backgroundColor: colors.errorBg, color: colors.errorText }}
                className="p-3 border-l-4 border-red-500 rounded-r-lg text-sm flex items-center gap-2 animate-pulse"
              >
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            <input type="text" style={{ display: 'none' }} />
            <input type="password" style={{ display: 'none' }} />

            <div>
              <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-2 block">
                Username
              </label>
              <input 
                type="text" 
                name="mehedi_user_shakib" 
                autoComplete="new-password"
                placeholder="Enter Name"
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ backgroundColor: colors.bgInput, color: colors.white }}
                className="w-full border border-white/10 rounded-xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 autofill:bg-slate-900"
              />
            </div>

            <div>
              <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-2 block">
                Password
              </label>
              <input 
                type="password" 
                name="mehedi_pass_shakib" 
                autoComplete="new-password"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: colors.bgInput, color: colors.white }}
                className="w-full border border-white/10 rounded-xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>

            <button 
              type="submit" 
              style={{ backgroundColor: colors.primary }}
              className="w-full text-white font-bold py-4 rounded-xl text-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center" style={{ color: colors.textGray }}>
            New user? 
            <Link href="/signup" style={{ color: colors.primary }} className="font-bold ml-2 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}