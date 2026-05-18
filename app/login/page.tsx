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
  errorBg: "#882929",
  errorText: "#f69090"
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
    <div style={{ backgroundColor: colors.bgOuter }} className="min-h-screen text-white flex flex-col font-sans antialiased">
      
    
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/40">
        <div className="max-w-full mx-auto px-6 md:px-16 h-20 flex items-center justify-between">
          
          <Link href="/home" className="text-2xl md:text-3xl font-black tracking-widest uppercase select-none">
            HOTEL <span style={{ color: colors.primary }}>ROYAL</span>
          </Link>

        </div>
      </header>
      
      
      <main className="flex-grow flex items-center justify-center px-6 py-24 md:py-32">
        <div 
          style={{ backgroundColor: colors.bgCard }} 
          className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        >
        
         
          <div className="hidden md:block md:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480" 
              className="w-full h-full object-cover opacity-90" 
              alt="Login Visual"
            />
          </div>

          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <h1 style={{ color: colors.white }} className="text-4xl text-left font-extrabold mb-2">Login</h1>
            <p style={{ color: colors.textGray }} className="text-lg text-left mb-2">Access Hotel Royal</p>

            <div className="h-12 mb-2"> 
              {error && (
                <div 
                  style={{ backgroundColor: colors.errorBg, color: colors.errorText }}
                  className="p-3 border-l-4 border-red-500 rounded-r-lg text-sm flex items-center gap-2"
                >
                  <span>⚠️</span> {error}
                </div>
              )}
            </div>

            
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            
              <div>
                <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-2 block">
                  Username
                </label>
                <input 
                  type="text" 
                  autoComplete="new-password" 
                  placeholder="Enter Your Name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: colors.bgInput, color: colors.white }}
                  className="w-full border border-white/10 rounded-xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <label style={{ color: colors.textGray }} className="text-xs font-bold uppercase tracking-widest mb-2 block">
                  Password
                </label>
                <input 
                  type="password" 
                  autoComplete="new-password"
                  placeholder="Enter Your Password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ backgroundColor: colors.bgInput, color: colors.white }}
                  className="w-full border border-white/10 rounded-xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
                />
              </div>

              <button 
                type="submit" 
                style={{ backgroundColor: colors.primary }}
                className="w-full text-white font-bold py-4 rounded-2xl text-lg shadow-2xl hover:brightness-125 active:scale-95 transition-all mt-4"
              >
                Log In
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
      </main>
   
    
      <footer className="bg-slate-950 py-6 text-center text-slate-600 text-xs tracking-widest uppercase border-t border-slate-900/40 mt-auto">
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>

    </div>
  );
}