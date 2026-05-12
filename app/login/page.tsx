"use client";
import { useState } from 'react';
import api from '../../lib/api'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [name, setName] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !password) {
      setError('Please fill in all fields before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/customer/login', { 
        username: name, 
        password: password 
      });

      if (res.data && res.data.access_token) {
        // ১. টোকেন এবং ইউজারের নাম সেভ করা
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('user_name', name); 
        
        // ২. সফল হলে সরাসরি হোমপেজে পাঠানো
        router.push('/home'); 
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid username or password';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainCard}>
        {/* বাম অংশ: ছবি */}
        <div className={styles.imageSide}>
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480" 
            alt="Luxury Resort" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b23] via-transparent to-black/20"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-5xl font-black mb-4 tracking-tighter leading-tight">
              Luxury <br/> <span className="text-[#eab308]">Awaits</span> You.
            </h2>
          </div>
        </div>

        {/* ডান অংশ: ফর্ম */}
        <div className={styles.formSide}>
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Login</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2 animate-pulse">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                className={styles.input}
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs text-gray-500">
                Don't have an account? 
                <Link href="/signup" className="text-[#eab308] font-bold ml-2 hover:underline">
                  Sign Up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// তোমার স্টাইল অবজেক্ট আগের মতোই থাকবে
const styles = {
  wrapper: "min-h-screen flex items-center justify-center bg-[#121a16] p-4 md:p-8 font-sans",
  mainCard: "w-full max-w-6xl flex flex-col md:flex-row bg-[#1a2b23] rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden min-h-[600px] border border-white/5",
  imageSide: "w-full md:w-[55%] relative overflow-hidden group",
  formSide: "w-full md:w-[45%] p-10 md:p-16 flex flex-col justify-center bg-[#1a2b23] text-white",
  input: "w-full bg-[#243a30] border border-white/5 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#eab308] focus:bg-[#2d463a] transition-all text-sm text-white placeholder:text-gray-500",
  button: "w-full bg-[#eab308] hover:bg-[#facc15] text-[#0f1a15] font-black py-4 rounded-2xl transition-all shadow-xl shadow-yellow-500/10 mt-4 active:scale-95 disabled:opacity-50",
};