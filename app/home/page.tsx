"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

const HomePage = () => {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  const theme = {
    bgMain: "#0b0f1a",
    bgDeep: "#05070c",
    gold: "#c9a25b",
    goldSoft: "#e8d6ab",
    textMuted: "#cbd2e0",
    imgOpacity: "0.18",
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

  const buttonClass = `w-full sm:w-56 border rounded-full py-4 text-sm font-medium uppercase tracking-widest transition-all duration-300 hover:text-[#05070c] text-center`;

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen text-white flex flex-col antialiased`}
      style={{ backgroundColor: theme.bgMain, fontFamily: 'var(--font-body)' }}
    >

      <Header userName={userName} />

      <main className="flex-1 relative flex items-center justify-center overflow-hidden px-6 py-32">

        {/* Background image, same treatment as login/signup */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')",
            opacity: theme.imgOpacity,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at center, transparent 20%, ${theme.bgDeep} 90%)` }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center px-6 mb-16">

          <p
            className="text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-3"
            style={{ color: theme.goldSoft }}
          >
            Welcome Back
          </p>

          <h1
            className="text-5xl md:text-7xl mb-6 leading-none select-none"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            <span style={{ color: theme.gold }}>{userName}</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-10" style={{ backgroundColor: theme.gold }} />
            <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: theme.gold }} />
            <span className="h-px w-10" style={{ backgroundColor: theme.gold }} />
          </div>

          <p
            style={{ color: theme.textMuted }}
            className="text-lg md:text-xl mb-16 max-w-2xl mx-auto font-light"
          >
            Experience the pinnacle of luxury at{' '}
            <span className="text-white font-semibold italic">Hotel Royal</span>.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-4xl mx-auto">
            <Link href="/view-rooms">
              <button
                className={buttonClass}
                style={{ borderColor: theme.gold, color: theme.gold }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Book Room
              </button>
            </Link>

            <Link href="/my-bookings">
              <button
                className={buttonClass}
                style={{ borderColor: theme.gold, color: theme.gold }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                My Bookings
              </button>
            </Link>

            <Link href="/profile">
              <button
                className={buttonClass}
                style={{ borderColor: theme.gold, color: theme.gold }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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