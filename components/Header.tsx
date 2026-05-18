"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Header = ({ userName }: { userName?: string }) => {
  const router = useRouter();

  
  
  const headerColors = {
    background: "#1d2b4d", 
    brandBlue: "#3b82f6",  
    userIconBg: "#2563eb", 
    logoutBg: "#9a1717",  
    borderColor: "#1e293b",
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('user_name');
    router.push('/login');
  };

  return (
    <header 
      style={{ backgroundColor: headerColors.background, borderBottomColor: headerColors.borderColor }}
      className=" text-white p-5 shadow-2xl border-b flex flex-row md:flex-row item-center justify-between sticky top-0 z-50"
    >
      
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

   
      <div className="hidden lg:block text-2xl  font-black tracking-[0.25em] text-white">
        HOTEL 
        <span style={{ color: headerColors.brandBlue }}>ROYAL</span>
      </div>

      <button 
        onClick={handleLogout}
        style={{ backgroundColor: headerColors.logoutBg }}
        className="transition-all hover:brightness-125 hover:scale-105 text-white px-7 py-3 rounded-xl transition-all duration-300 font-bold shadow-lg active:scale-95 text-base"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;