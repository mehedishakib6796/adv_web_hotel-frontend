"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HomePage = () => {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে অথেন্টিকেশন ডাটা চেক করা
    const token = localStorage.getItem('access_token');
    const name = localStorage.getItem('user_name');

    if (!token) {
      router.push('/login'); 
    } else {
      setUserName(name || "Guest User");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      
      {/* হেডারে ডাইনামিক নাম দেখাবে */}
      <Header userName={userName} />

      <main className="flex-1 relative flex items-center justify-center">
        
        {/* ব্যাকগ্রাউন্ড ইমেজ এবং ডার্ক গ্রাডিয়েন্ট ওভারলে */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] hover:scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920')" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90"></div>
        </div>

        {/* মেইন কন্টেন্ট সেকশন */}
        <div className="relative text-center z-10 px-6 max-w-5xl">
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            Welcome, <span className="text-[#eab308] uppercase">{userName}</span>
          </h1>
          
          <p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Step into a world of elegance at <span className="text-white font-bold italic">Hotel Royal</span>. 
            Discover rooms that redefine luxury and comfort.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            
            {/* ১. BOOK A ROOM */}
            <Link href="/view-rooms">
              <button className="bg-[#eab308] hover:bg-[#facc15] text-[#0f1a15] font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-[0_10px_40px_rgba(234,179,8,0.3)] active:scale-95 flex items-center gap-2">
                <span className="text-lg">🏨</span> BOOK A ROOM
              </button>
            </Link>

            {/* ২. MY BOOKINGS - এখান থেকেই ইউজার রিভিউ দেওয়ার অপশন পাবে */}
            <Link href="/my-bookings">
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-10 py-5 rounded-2xl transition-all backdrop-blur-lg active:scale-95 flex items-center gap-2">
                <span className="text-lg">📋</span> MY BOOKINGS
              </button>
            </Link>

            {/* ৩. PROFILE Section */}
            <Link href="/profile">
              <button className="bg-transparent border border-gray-800 hover:border-gray-500 text-gray-500 hover:text-white font-medium px-10 py-5 rounded-2xl transition-all active:scale-95">
                PROFILE
              </button>
            </Link>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;