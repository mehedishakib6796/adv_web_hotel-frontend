"use client";
import { useState } from 'react';
import api from '../../lib/api'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

    // ১. ফ্রন্টএন্ড ভ্যালিডেশন
    if (!name || !email || !password || !confirmPassword) {
      setError('সবগুলো ঘর পূরণ করুন (Please fill in all fields).');
      return;
    }

    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড মেলেনি (Passwords do not match).');
      return;
    }

    setLoading(true);
    try {
      /** * ব্যাকএন্ড কানেকশন আপডেট:
       * আমরা এখানে 'email' এবং 'confirmPassword' পাঠাচ্ছি না কারণ ব্যাকএন্ডে এগুলো নেই।
       * শুধু username এবং password পাঠালে 'forbidNonWhitelisted' এরর আসবে না।
       */
      const res = await api.post('/customer/signup', { 
        username: name, 
        password: password 
      });

      if (res.status === 201 || res.status === 200) {
        alert('অ্যাকাউন্ট তৈরি সফল হয়েছে!');
        router.push('/login');
      }
    } catch (err: any) {
      // ব্যাকএন্ড থেকে আসা ConflictException (Username exists) বা অন্য এরর
      const errorMessage = err.response?.data?.message || 'সাইনআপ করতে সমস্যা হচ্ছে।';
      setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
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
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b23] via-transparent to-black/30"></div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <h2 className="text-4xl font-black mb-2 tracking-tighter leading-tight">
              Elite <br/> <span className="text-[#eab308]">Experience</span>
            </h2>
          </div>
        </div>

        {/* ডান অংশ: ইনপুট ফর্ম */}
        <div className={styles.formSide}>
          <div className="w-full max-w-sm mx-auto relative">
            
            <h1 className="text-3xl font-bold tracking-tight mb-6">Create Account</h1>

            {/* এরর মেসেজ */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2 animate-pulse">
                <span>⚠️ {error}</span>
              </div>
            )}
            
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                className={styles.input}
                placeholder="Full Name (Username)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {/* ইমেইল ইনপুট শুধু ফ্রন্টএন্ডের জন্য */}
              <input
                type="email"
                className={styles.input}
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Already have an account? 
                <Link href="/login" className="text-[#eab308] font-bold ml-1 hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  wrapper: "min-h-screen flex items-center justify-center bg-[#121a16] p-4 font-sans",
  mainCard: "w-full max-w-5xl flex flex-col md:flex-row bg-[#1a2b23] rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden min-h-[650px] border border-white/5",
  imageSide: "hidden md:block w-[45%] relative overflow-hidden group",
  formSide: "w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center bg-[#1a2b23] text-white",
  input: "w-full bg-[#243a30] border border-white/5 rounded-xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#eab308] focus:bg-[#2d463a] transition-all text-sm text-white placeholder:text-gray-500",
  button: "w-full bg-[#eab308] hover:bg-[#facc15] text-[#0f1a15] font-black text-lg py-4 rounded-xl transition-all shadow-xl shadow-yellow-500/10 mt-4 active:scale-95 disabled:opacity-50",
};