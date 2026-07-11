"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HomePage = () => {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  
  const theme = {
    bgMain: "#0f172a",
    primary: "#487be8",
    textMuted: "#94a3b8",
    imgOpacity: "0.30"
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const name = localStorage.getItem('user_name');

    if (!token) {
      router.push('/login');
    } else {
      setUserName(name || "Guest User");
    }
  }, [router]);

 

  const buttonClass = `w-full sm:w-50 text-white font-bold py-5 rounded-2xl transition-all duration-200 hover:brightness-125 hover:scale-105 active:scale-90 shadow-xl text-xl text-center`;
  

  return (
    <div style={{ backgroundColor: theme.bgMain }}
     className="min-h-screen text-white flex flex-col font-sans">
      
      <Header userName={userName} />

      <main className="flex-1 relative flex items-center justify-center">
        
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')",
            opacity: theme.imgOpacity
          }}
        ></div>

        <div className="relative text-center z-10 px-6  mb-16">

          
          <h1 className="text-6xl text:center md:text-8xl font-black  transition-all hover:brightness-125 duration-300 hover:scale-105 active:scale-90 mb-6 tracking-tighter ">
            Welcome, <br className="md:hidden" /> 
            <span style={{ color: theme.primary }}>{userName}</span>
          </h1>
          
        
          <p style={{ color: theme.textMuted }}
           className="text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-light">
            Experience the pinnacle of luxury at <span className="text-white font-semibold italic">Hotel Royal</span>.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 w-full max-w-5xl mx-auto">
            <Link href="/view-rooms">
              <button 
                className={buttonClass}
                style={{ backgroundColor: theme.primary }}
              >
                Book Room
              </button>
            </Link>

            <Link href="/my-bookings">
              <button 
                className={buttonClass}
                style={{ backgroundColor: theme.primary }}
              >
                My Bookings
              </button>
            </Link>

            <Link href="/profile">
              <button 
                className={buttonClass}
                style={{ backgroundColor: theme.primary }}
              >
                My Profile
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