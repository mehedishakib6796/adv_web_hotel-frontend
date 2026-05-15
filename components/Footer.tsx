"use client";
import React from 'react';

const Footer = () => {
  // 🎨 নিচের কালারগুলোর ওপর মাউস রাখলে VS Code এ কালার বক্স আসবে।
  // তুমি জাস্ট বক্স থেকে কালার সিলেক্ট করলেই কোড আপডেট হয়ে যাবে।
  const colors = {
    background: "#0c162f", // এখানে ক্লিক করে ব্যাকগ্রাউন্ড কালার চেঞ্জ করো
    brandBlue: "#3b82f6",  // এখানে ক্লিক করে 'ROYAL' এর কালার চেঞ্জ করো
    textSlate: "#94a3b8",  // স্লোগান এর কালার
    borderLine: "#1e293b", // বর্ডার কালার
  };

  return (
    <footer 
      style={{ backgroundColor: colors.background, borderTopColor: colors.borderLine }} 
      className="p-6 border-t text-white w-full mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* ১. ব্র্যান্ড নেম */}
        <div className="text-xl font-black tracking-[0.2em]">
          HOTEL <span style={{ color: colors.brandBlue }}>ROYAL</span>
        </div>

        {/* ২. স্লোগান */}
        <div style={{ color: colors.textSlate }} className="italic text-xs md:text-sm font-medium tracking-wide">
          "Where Luxury Meets Comfort"
        </div>

        {/* ৩. কপিরাইট */}
        <div style={{ color: colors.textSlate }} className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold opacity-60">
          &copy; 2026 All Rights Reserved
        </div>

      </div>
    </footer>
  );
};

export default Footer;