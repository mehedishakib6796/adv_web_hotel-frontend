"use client";
import { useState } from 'react';
import api from '../../lib/api'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ১. কালার প্যালেট
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

export default function SignupPage() {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords Mismatch)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/customer/signup', { 
        username: name, 
        password: password 
      });

      if (res.status === 201 || res.status === 200) {
        alert('Account Create Successfull');
        router.push('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Having trouble signing up.';
      setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ backgroundColor: colors.bgOuter }} 
      className="min-h-screen flex items-center justify-center p-6"
    >
      
      <div 
        style={{ backgroundColor: colors.bgCard }} 
        className="
          w-full 
          max-w-5xl 
          flex 
          flex-col 
          md:flex-row 
          rounded-3xl 
          shadow-2xl 
          overflow-hidden 
          border 
          border-white/10
        "
      >
        
        {/* বাম পাশ: ইমেজ */}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480" 
            className="w-full h-full object-cover opacity-80" 
            alt="Signup Visual"
          />
        </div>

        {/* ডান পাশ: ফর্ম */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          
          <h1 
            style={{ color: colors.white }} 
            className="text-4xl font-extrabold mb-2"
          >
            Sign Up
          </h1>
          
          <p 
            style={{ color: colors.textGray }} 
            className="text-lg mb-6"
          >
            Create your Hotel Royal account
          </p>

          {/* এরর মেসেজ বক্স */}
          {error && (
            <div 
              style={{ backgroundColor: colors.errorBg, color: colors.errorText }}
              className="mb-6 p-4 border-l-4 border-red-500 rounded-r-lg text-sm"
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
            
            {/* Full Name Input */}
            <div>
              <label 
                style={{ color: colors.textGray }} 
                className="text-xs font-bold uppercase tracking-widest mb-1 block"
              >
                Full Name
              </label>
              <input 
                type="text" 
                autoComplete="new-password"
                placeholder="Enter your full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ backgroundColor: colors.bgInput, color: colors.white }}
                className="w-full border border-white/10 rounded-xl py-3 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Email Input */}
            <div>
              <label 
                style={{ color: colors.textGray }} 
                className="text-xs font-bold uppercase tracking-widest mb-1 block"
              >
                Email
              </label>
              <input 
                type="email" 
                autoComplete="new-password"
                placeholder="email@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ backgroundColor: colors.bgInput, color: colors.white }}
                className="w-full border border-white/10 rounded-xl py-3 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Password Input */}
            <div>
              <label 
                style={{ color: colors.textGray }} 
                className="text-xs font-bold uppercase tracking-widest mb-1 block"
              >
                Password
              </label>
              <input 
                type="password" 
                autoComplete="new-password"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: colors.bgInput, color: colors.white }}
                className="w-full border border-white/10 rounded-xl py-3 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label 
                style={{ color: colors.textGray }} 
                className="text-xs font-bold uppercase tracking-widest mb-1 block"
              >
                Confirm Password
              </label>
              <input 
                type="password" 
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ backgroundColor: colors.bgInput, color: colors.white }}
                className="w-full border border-white/10 rounded-xl py-3 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: colors.primary }}
              className="
                w-full 
                text-white 
                font-bold 
                py-4 
                rounded-xl 
                text-xl 
                shadow-lg 
                hover:brightness-110 
                active:scale-95 
                transition-all 
                mt-4
              "
            >
              {loading ? "Processing..." : "Create Account"}
            </button>

          </form>

          {/* Footer Link */}
          <p 
            className="mt-8 text-center" 
            style={{ color: colors.textGray }}
          >
            Already have an account? 
            <Link 
              href="/login" 
              style={{ color: colors.primary }} 
              className="font-bold ml-2 hover:underline"
            >
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}