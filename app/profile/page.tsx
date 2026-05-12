"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, ShieldCheck, UserCircle, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('user_name');
      const email = localStorage.getItem('user_email');
      
      setUser({
        name: name || "Mehedi Hasan Shakib",
        email: email || "mehedi@gmail.com",
        role: "Premium Member"
      });
    }
  }, []);

  if (!user) return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center font-black uppercase tracking-[0.3em] animate-pulse">
      Loading Profile...
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans">
      <Header userName={user.name} />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative">
        
        {/* প্রোফাইল কার্ড */}
        <div className="w-full max-w-md bg-[#0c0c0c] border border-zinc-800 rounded-[45px] p-12 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* প্রোফাইল পিকচার (বড় আইকন) */}
          <div className="mx-auto w-28 h-28 bg-yellow-500 rounded-[35px] flex items-center justify-center text-black text-5xl font-black mb-8 shadow-xl shadow-yellow-500/10 border-4 border-black">
            {user.name.charAt(0)}
          </div>

          <div className="space-y-8">
            {/* নাম ও মেম্বারশিপ */}
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">
                {user.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-yellow-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em]">
                  {user.role}
                </span>
              </div>
            </div>

            {/* ডিভাইডার */}
            <hr className="border-zinc-900 w-full" />

            {/* ইনফরমেশন লিস্ট */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-5 px-6 py-5 bg-zinc-900/40 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all">
                <Mail className="w-6 h-6 text-zinc-600" />
                <div>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none mb-2">Email Address</p>
                  <p className="text-base font-bold text-zinc-200">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 px-6 py-5 bg-zinc-900/40 rounded-3xl border border-zinc-800 hover:border-zinc-700 transition-all">
                <UserCircle className="w-6 h-6 text-zinc-600" />
                <div>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none mb-2">Account Type</p>
                  <p className="text-base font-bold text-zinc-200">{user.role}</p>
                </div>
              </div>
            </div>

            {/* শুধু ব্যাক বাটন (Home এ যাওয়ার জন্য) */}
         <div className="pt-6">
  <button 
    onClick={() => {
      // সরাসরি লোকালহোস্ট ৩০০১ এর হোম পেজে নিয়ে যাবে
      window.location.href = 'http://localhost:3001/home';
    }}
    className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-yellow-500 font-black py-5 rounded-[25px] transition-all active:scale-95 text-xs uppercase tracking-[0.2em] shadow-lg group"
  >
    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
    Back to Hotel Home
  </button>
</div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;