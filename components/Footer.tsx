import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-500 py-6 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left Side: Brand Name */}
        <div className="text-white font-bold tracking-widest text-sm">
          HOTEL <span className="text-yellow-500">ROYAL</span>
        </div>

        {/* Middle: Copyright */}
        <div className="text-[10px] uppercase tracking-widest">
          &copy; 2026 All Rights Reserved
        </div>

        {/* Right Side: Simple Links */}
        <div className="flex gap-6 text-[11px] uppercase tracking-wider">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;