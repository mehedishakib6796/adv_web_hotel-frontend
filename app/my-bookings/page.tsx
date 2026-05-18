"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePusherBeams } from '../../lib/usePusher';

const MyBookingsPage = () => {
  
  const theme = {
    backgroundColor: "#0f172a",      
    cardColor: "#10235e",             
    accentColor: "#b7b8ed",          
    roomBoxColor: "#161b22",       
    textColor: "#94a3b8",             
    headerTitleColor: "#ffffff",     
  };

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(""); 
  const router = useRouter();

  const fetchBookings = useCallback(async (token: string) => {
    try {
      const res = await axios.get('http://localhost:3000/customer/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data.bookings || []);
      setBookings(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const name = localStorage.getItem('user_name'); 
    if (!token) {
      router.push('/login');
      return;
    }
    setUserName(name || "Guest User"); 
    fetchBookings(token);
  }, [router, fetchBookings]);

  usePusherBeams('global');

  // 🛠️ ক্যানসেলেশনের ফিক্সড ও বুলেটপ্রুফ মেথড
  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel?")) 
      return;
      
    try {
      const token = localStorage.getItem('access_token');
      
      // ব্যাকঅ্যান্ড এপিআই-তে ডিলিট রিকোয়েস্ট পাঠানো হচ্ছে
      await axios.delete(`http://localhost:3000/customer/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // ডিলিট সফল হলে স্টেট ফিল্টার হবে এবং সাকসেস মেসেজ আসবে
      setBookings(prev => prev.filter((b: any) => b.id !== id));
      alert("Booking successfully cancelled!");

    } catch (err: any) {
      console.error("Cancellation Error Details:", err);
      
      // 💡 ব্যাকঅ্যান্ড যদি ডিলিট সফল করার পর খালি রেসপন্স (No Content) দেয়, 
      // তবে অ্যাক্সিওস যেন ওটাকে এরর না ধরে। তাই এই সেফটি চেক:
      if (!err.response || err.response?.status === 200 || err.response?.status === 204) {
        setBookings(prev => prev.filter((b: any) => b.id !== id));
        alert("Booking successfully cancelled!");
      } else {
        alert("Cancellation failed: " + (err.response?.data?.message || "Server Error"));
      }
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const btnBase = "flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 active:scale-95 border flex items-center justify-center text-center";

  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }} 
    className="flex flex-col min-h-screen font-sans">
      <Header userName={userName} />
      
      <main className="flex-grow max-w-screen-2xl mx-auto w-full py-12 px-8">
  
        <div className="mb-12 border-b border-white/5 pb-8 flex items-center justify-left">
          <h1 style={{ color: theme.headerTitleColor }} className="text-4xl font-black tracking-tighter uppercase italic">
            My <span style={{ color: theme.accentColor }}>Bookings</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 animate-spin text-2xl" style={{ color: theme.accentColor }}>◌</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => (

              <div key={booking.id} style={{ backgroundColor: theme.cardColor }}
               className="group rounded-3xl p-6 flex flex-col md:flex-row items-center gap-10 border border-white/5 hover:scale-105 transition-all duration-500">
                
                <div style={{ backgroundColor: theme.roomBoxColor }} 
                className="w-full md:w-56 h-40 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/5 group-hover:bg-indigo-600 transition-colors duration-500">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white/60 mb-1">Room</span>
                  <span className="text-5xl font-black text-white italic tracking-tighter">#{booking.room?.id || '0'}</span>
                </div>

                <div className="flex-1 w-full space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                        {booking.room?.name || "Exclusive Suite"}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-md border ${getStatusStyle(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span style={{ color: theme.accentColor }} className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                          Guest: {userName}
                        </span>
                      </div>
                    </div>
                    <div className="md:text-right">
                       <span className="text-4xl font-black text-white tracking-tighter">${booking.room?.price || '0'}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-5 border-t border-white/5">
                    {[
                      { label: "Check-In", val: booking.checkInDate },
                      { label: "Check-Out", val: booking.checkOutDate },
                      { label: "Email Address", val: booking.email },
                      { label: "Contact No", val: booking.phoneNumber },
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-sm font-bold text-slate-200 truncate">{item.val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 w-full md:w-48 shrink-0">
                  <button 
                    onClick={() => router.push(`/give-review?bookingId=${booking.id}`)} 
                    className={`${btnBase} bg-white text-black border-transparent hover:opacity-90`}
                  >
                    Give Review
                  </button>
                  
                  <button 
                    onClick={() => router.push(`/edit-booking/${booking.id}`)} 
                    className={`${btnBase} bg-white text-black border-transparent hover:opacity-90`}
                  >
                    Modify
                  </button>
                  
                  <button 
                    onClick={() => handleCancel(booking.id)} 
                    className={`${btnBase} bg-white text-black border-transparent hover:opacity-90`}
                  >
                    Cancel Booking
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => router.push('/home')}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-indigo-400 transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Home
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;