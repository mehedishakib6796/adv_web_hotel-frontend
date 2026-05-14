"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// '@/lib/usePusher' এর পরিবর্তে সরাসরি আপনার ফোল্ডার পাথ অনুযায়ী ইম্পোর্ট করুন
import { usePusher } from '../../lib/usePusher';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]); // টাইপ ডিফাইন করা হলো যাতে 'any' এরর না আসে
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(""); 
  const router = useRouter();

  // ডাটা ফেচ করার ফাংশন
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

  // --- Pusher আলাদা লজিক এখানে কল করা হয়েছে ---
  // এখানে (data: any) লিখে দিন যাতে parameter 'data' implicitly has an 'any' type এররটি চলে যায়
  usePusher('hotel-royal-channel', 'booking-update', (data: any) => {
    alert(`🔔 Real-time Update: ${data.message}`);
    const token = localStorage.getItem('access_token');
    if (token) fetchBookings(token);
  });

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:3000/customer/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // অটোমেটিক স্টেট আপডেট
      setBookings(prev => prev.filter((b: any) => b.id !== id));
      alert("✅ Cancellation Request Sent!");
    } catch (err) {
      alert("❌ Cancellation failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <Header userName={userName} />
      <main className="flex-grow max-w-6xl mx-auto w-full py-12 px-6">
        <h1 className="text-4xl font-black uppercase italic mb-10 tracking-widest text-yellow-500 border-l-8 border-yellow-500 pl-4">
          BOOKING <span className="text-white">CART</span>
        </h1>

        {loading ? (
          <div className="text-center py-20 text-zinc-500 animate-pulse uppercase tracking-widest">Loading Records...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-32 bg-zinc-900/10 rounded-[40px] border border-zinc-800 border-dashed">
             <p className="text-zinc-600 font-bold uppercase">No items in your booking cart</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-[#0c0c0c] border border-zinc-800 p-8 rounded-[35px] flex flex-col lg:flex-row items-center gap-10 hover:border-yellow-500/40 transition-all shadow-2xl relative group">
                <div className="w-full lg:w-48 h-48 bg-zinc-900 rounded-[30px] flex flex-col items-center justify-center border-2 border-zinc-800 group-hover:border-yellow-500/50 transition-all shrink-0">
                  <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Room ID</span>
                  <span className="text-5xl font-black text-yellow-500">#{booking.room?.id || 'N/A'}</span>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-1 group-hover:text-yellow-500 transition-colors">{booking.room?.roomName || "Luxury Suite"}</h2>
                      <p className="text-zinc-500 text-sm font-medium">Customer: {booking.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Price</p>
                      <p className="text-4xl font-black text-yellow-500">${booking.room?.price || '00'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-zinc-800/50">
                    <div><p className="text-[10px] text-zinc-600 font-black uppercase mb-1">Check-In</p><p className="text-sm font-bold text-zinc-200">{booking.checkInDate}</p></div>
                    <div><p className="text-[10px] text-zinc-600 font-black uppercase mb-1">Check-Out</p><p className="text-sm font-bold text-zinc-200">{booking.checkOutDate}</p></div>
                    <div><p className="text-[10px] text-zinc-600 font-black uppercase mb-1">Contact</p><p className="text-sm font-bold text-zinc-200">{booking.phoneNumber}</p></div>
                    <div><p className="text-[10px] text-zinc-600 font-black uppercase mb-1">Status</p><span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full font-black uppercase">{booking.status}</span></div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col gap-3">
                  <button onClick={() => router.push(`/give-review?bookingId=${booking.id}`)} className="w-full lg:w-48 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Give Review</button>
                  <button onClick={() => router.push(`/edit-booking/${booking.id}`)} className="w-full lg:w-48 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Edit Booking</button>
                  <button onClick={() => handleCancel(booking.id)} className="w-full lg:w-48 bg-transparent hover:bg-red-600 text-zinc-500 hover:text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-800">Cancel Booking</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;