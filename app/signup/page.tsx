"use client";
import { useState } from 'react';
import api from '../../lib/api'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const colors = {
  bgOuter: "#0f172a",
  bgCard: "#1e293b",  
  bgInput: "#0f172a",
  primary: "#487be8", 
  white: "#ffffff",
  textGray: "#94a3b8",
  errorBg: "#450a0a",
  errorText: "#f87171",
  successBg: "#064e3b",
  successText: "#34d399"
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
   
    <div style={{ backgroundColor: colors.bgOuter }} className="h-screen w-screen text-white flex flex-col font-sans antialiased overflow-hidden relative">
      
    
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/40">
        <div className="max-w-full mx-auto px-6 md:px-16 h-20 flex items-center justify-between">
          
          <Link href="/home" className="text-2xl md:text-3xl font-black tracking-widest uppercase select-none">
            HOTEL <span style={{ color: colors.primary }}>ROYAL</span>
          </Link>
        </div>
      </header>
      
    
      <main className="flex-grow flex items-center justify-center px-4 md:px-6 pt-20 pb-16">
        <div 
          style={{ backgroundColor: colors.bgCard }}
          className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden border border-white/10 max-h-[82vh]"
        >
          
      
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480" 
              className="w-full h-full object-cover opacity-80" 
              alt="Signup Visual"
            />
          </div>

      
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[82vh] scrollbar-thin">

            <h1 style={{ color: colors.white }} className="text-3xl md:text-4xl font-extrabold mb-1 text-left">Sign Up</h1>
            <p style={{ color: colors.textGray }} className="text-base mb-4">Create your Hotel Royal account</p>

          
            {success && (
              <div 
                style={{ backgroundColor: colors.successBg, color: colors.successText }}
                className="mb-4 p-3 border-l-4 border-emerald-500 rounded-r-lg text-sm"
              >
                ✅ {success}
              </div>
            )}

          
            {error && (
              <div 
                style={{ backgroundColor: colors.errorBg, color: colors.errorText }}
                className="mb-4 p-3 border-l-4 border-red-500 rounded-r-lg text-sm"
              >
                ⚠️ {error}
              </div>
            )}

         
            <form onSubmit={handleSignup} className="space-y-3.5" autoComplete="off">
              
            
              <div>
                <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  autoComplete="new-password"
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: colors.bgInput, color: colors.white }}
                  className="w-full border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 text-sm"
                />
              </div>

          
              <div>
                <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-1 block">Email</label>
                <input 
                  type="email" 
                  autoComplete="new-password"
                  placeholder="email@example.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ backgroundColor: colors.bgInput, color: colors.white }}
                  className="w-full border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 text-sm"
                />
              </div>

           
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-1 block">Password</label>
                  <input 
                    type="password" 
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: colors.bgInput, color: colors.white }}
                    className="w-full border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 text-sm"
                  />
                </div>

                <div>
                  <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-1 block">Confirm Password</label>
                  <input 
                    type="password" 
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ backgroundColor: colors.bgInput, color: colors.white }}
                    className="w-full border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 text-sm"
                  />
                </div>
              </div>

         
              <button 
                type="submit" 
                style={{ backgroundColor: colors.primary }}
                className="w-full text-white font-bold py-3.5 rounded-xl text-lg shadow-lg hover:brightness-125 active:scale-95 transition-all mt-2"
              >
                Create Account
              </button>
              
            </form>
               
            <p className="mt-5 text-center text-sm" style={{ color: colors.textGray }}>
              Already have an account? 
              <Link href="/login" style={{ color: colors.primary }} className="font-bold ml-2 hover:underline">Login here</Link>
            </p>

          </div>  
        </div>
      </main>

    
      <footer className="bg-slate-950 py-4 text-center text-slate-600 text-xs tracking-widest uppercase border-t border-slate-900/40 w-full">
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>

    </div>
  );
}