"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePusher } from '../../lib/usePusher';

const MyBookingsPage = () => {
  // 🎨 মাউস দিয়ে কালার চেঞ্জ করার জন্য এই সেকশনটি ব্যবহার করো
  // VS Code-এ হেক্স কোডের ওপর মাউস নিলে কালার বক্স আসবে।
  const theme = {
    backgroundColor: "#0f172a",       // পুরো পেজের ব্যাকগ্রাউন্ড
    cardColor: "#2f374e",             // প্রতিটি বুকিং কার্ডের রঙ
    accentColor: "#6366f1",           // প্রধান হাইলাইট রঙ (Indigo)
    roomBoxColor: "#161b22",         // বাম পাশের রুম আইডি বক্সের রঙ
    textColor: "#94a3b8",             // সাধারণ টেক্সট রঙ
    headerTitleColor: "#ffffff",      // মেইন টাইটেল রঙ
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

  usePusher('hotel-royal-channel', 'booking-update', () => {
    const token = localStorage.getItem('access_token');
    if (token) fetchBookings(token);
  });

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel?")) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:3000/customer/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(prev => prev.filter((b: any) => b.id !== id));
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const btnBase = "flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 border flex items-center justify-center text-center";

  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }} className="flex flex-col min-h-screen font-sans">
      <Header userName={userName} />
      
      <main className="flex-grow max-w-screen-2xl mx-auto w-full py-12 px-8">
        
        <div className="mb-12 border-b border-white/5 pb-8 flex items-center justify-between">
          <h1 style={{ color: theme.headerTitleColor }} className="text-4xl font-black tracking-tighter uppercase italic">
            My <span style={{ color: theme.accentColor }}>Bookings</span>
          </h1>
          <div style={{ color: theme.accentColor, borderColor: `${theme.accentColor}33` }} className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border">
            Active Records: {bookings.length}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 animate-spin text-2xl" style={{ color: theme.accentColor }}>◌</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <div key={booking.id} style={{ backgroundColor: theme.cardColor }} className="group rounded-3xl p-6 flex flex-col md:flex-row items-center gap-10 border border-white/5 hover:border-white/10 transition-all duration-500">
                
                {/* Room Box */}
                <div style={{ backgroundColor: theme.roomBoxColor }} className="w-full md:w-56 h-40 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/5 group-hover:bg-indigo-600 transition-colors duration-500">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white/60 mb-1">Room</span>
                  <span className="text-5xl font-black text-white italic tracking-tighter">#{booking.room?.id || '0'}</span>
                </div>

                {/* Info Section */}
                <div className="flex-1 w-full space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                        {booking.room?.roomName || "Exclusive Suite"}
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

                {/* Action Buttons */}
                <div className="flex md:flex-col gap-3 w-full md:w-48 shrink-0">
                  <button 
                    onClick={() => router.push(`/give-review?bookingId=${booking.id}`)} 
                    className={`${btnBase} bg-white text-black border-transparent hover:opacity-90`}
                  >
                    Post Review
                  </button>
                  
                  <button 
                    onClick={() => router.push(`/edit-booking/${booking.id}`)} 
                    className={`${btnBase} bg-[#1a1f26] text-slate-300 border-white/10 hover:bg-white/5`}
                  >
                    Modify
                  </button>
                  
                  <button 
                    onClick={() => handleCancel(booking.id)} 
                    className={`${btnBase} bg-transparent text-slate-500 border-white/10 hover:text-red-500 hover:border-red-500/20`}
                  >
                    Cancel Booking
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ব্যাক বাটন */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => router.push('/home')}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-indigo-400 transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> 
            Back to Dashboard
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;