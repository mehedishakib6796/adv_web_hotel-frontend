

const Footer = () => {
  
  const colors = {
    background: "#1d2b4d", 
    brandBlue: "#3b82f6",  
    textSlate: "#94a3b8", 
    borderLine: "#1e293b", 
  };

  return (
    <footer 
      style={{ backgroundColor: colors.background, borderTopColor: colors.borderLine }} 
      className="p-6 border-t text-white w-full mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-7xl mx-auto flex flex-row md:flex-row justify-between items-center md:items-center gap-20">
        
     <div className="text-xl font-black tracking-[0.2em]">
  HOTEL <span style={{ color: colors.brandBlue }}>ROYAL</span>
</div>
      
       
        <div style={{ color: colors.textSlate }} className="italic text-s md:text-sm font-medium tracking-wide">
          "Where Luxury Meets Comfort"
        </div>

      <div style={{ color: colors.textSlate }} className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold opacity-60">
          &copy; 2026 All Rights Reserved
        </div>

      </div>
    </footer>
  );
};

export default Footer;