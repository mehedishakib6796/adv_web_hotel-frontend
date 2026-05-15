"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ userName }: { userName?: string }) => {
  const router = useRouter();

  // 🎨 এখানে কালারগুলোর ওপর মাউস রাখলে VS Code কালার বক্স দেখাবে। 
  // তুমি সরাসরি বক্স থেকে কালার পিক করে পরিবর্তন করতে পারবে।
  const headerColors = {
    background: "#111d39", // হেডারের মেইন ব্যাকগ্রাউন্ড কালার
    brandBlue: "#3b82f6",  // 'ROYAL' লেখার কালার
    userIconBg: "#2563eb", // ইউজার আইকনের ব্যাকগ্রাউন্ড
    logoutBg: "#ef4444",   // লগআউট বাটনের সলিড রেড কালার
    borderColor: "#1e293b",// নিচের বর্ডার কালার
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('user_name');
    router.push('/login');
  };

  return (
    <header 
      style={{ backgroundColor: headerColors.background, borderBottomColor: headerColors.borderColor }}
      className="backdrop-blur-md text-white p-5 shadow-2xl border-b flex justify-between items-center sticky top-0 z-50"
    >
      
      {/* Left Side: User Icon and Name */}
      <div className="flex items-center space-x-5">
        <div 
          style={{ backgroundColor: headerColors.userIconBg }}
          className="h-12 w-12 rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/30"
        >
          {userName ? userName[0].toUpperCase() : 'G'}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Signed in as</p>
          <span className="text-lg font-extrabold text-white tracking-tight">
            {userName || "Guest User"}
          </span>
        </div>
      </div>

      {/* Middle: Brand Name */}
      <div className="hidden lg:block text-2xl font-black tracking-[0.25em] text-white">
        HOTEL <span style={{ color: headerColors.brandBlue }}>ROYAL</span>
      </div>

      {/* Right Side: Logout Button */}
      <button 
        onClick={handleLogout}
        style={{ backgroundColor: headerColors.logoutBg }}
        className="hover:brightness-110 text-white px-7 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg active:scale-95 text-base"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;