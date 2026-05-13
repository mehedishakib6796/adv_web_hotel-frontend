"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EditBookingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phoneNumber: '',
    checkInDate: '',
    checkOutDate: '',
    gender: 'Male',
    roomId: 0
  });

  // ডাটাবেসের ISO তারিখকে Input ফিল্ডের উপযোগী (YYYY-MM-DD) করা
  const toViewDate = (dateVal: any) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
  };

  // Input ফিল্ডের তারিখকে ব্যাকএন্ড DTO (DD-MM-YYYY) ফরম্যাটে নেওয়া
  const toBackendDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const name = localStorage.getItem('user_name');
    if (!token) {
      router.push('/login');
      return;
    }
    setUserName(name || "User");
    fetchBookingDetails(token);
  }, [id]);

  const fetchBookingDetails = async (token: string) => {
    try {
      // তোর নতুন বানানো GET /bookings/:id রুট থেকে ডাটা আসবে
      const res = await axios.get(`http://localhost:3000/customer/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = res.data;
      if (data) {
        setFormData({
          customerName: data.customerName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          gender: data.gender || 'Male',
          roomId: data.room?.id || data.roomId || 0,
          checkInDate: toViewDate(data.checkInDate),
          checkOutDate: toViewDate(data.checkOutDate)
        });
      }
    } catch (err: any) {
      setError("ডাটা লোড করা যায়নি। আইডি ঠিক আছে কি না চেক করো।");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const token = localStorage.getItem('access_token');
    
    // ব্যাকএন্ডে পাঠানোর জন্য ডাটা রেডি করা
    const payload = {
      ...formData,
      roomId: Number(formData.roomId),
      checkInDate: toBackendDate(formData.checkInDate),
      checkOutDate: toBackendDate(formData.checkOutDate)
    };

    try {
      await axios.patch(`http://localhost:3000/customer/bookings/${id}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessage("✅ বুকিং সফলভাবে আপডেট হয়েছে!");
      setTimeout(() => router.push('/my-bookings'), 2000);
    } catch (err: any) {
      const errMsg = err.response?.data?.message;
      setError(Array.isArray(errMsg) ? errMsg[0] : errMsg || "আপডেট ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Header userName={userName} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-xl w-full bg-[#0d0d0d] p-10 rounded-[45px] border border-white/5 shadow-2xl">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black uppercase italic tracking-tight">
              EDIT <span className="text-blue-500">BOOKING</span>
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase mt-2">Update phone and stay duration</p>
          </div>

          {fetching ? (
            <p className="text-center animate-pulse text-zinc-600 font-bold">LOADING...</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name & Email - Auto-filled & ReadOnly */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-zinc-600 mb-2 block tracking-widest">Customer Name</label>
                  <input type="text" value={formData.customerName} readOnly className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-zinc-500 cursor-not-allowed outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-zinc-600 mb-2 block tracking-widest">Email Address</label>
                  <input type="email" value={formData.email} readOnly className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-zinc-500 cursor-not-allowed outline-none" />
                </div>
              </div>

              {/* Phone - Editable */}
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-black text-blue-500 mb-2 block tracking-widest">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                  className="w-full bg-white/5 border border-blue-500/20 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold" 
                  required 
                />
              </div>

              {/* Dates - Editable */}
              <div>
                <label className="text-[10px] uppercase font-black text-blue-500 mb-2 block tracking-widest">Check-In</label>
                <input 
                  type="date" 
                  value={formData.checkInDate} 
                  onChange={(e) => setFormData({...formData, checkInDate: e.target.value})} 
                  className="w-full bg-white/5 border border-blue-500/20 p-4 rounded-2xl outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-blue-500 mb-2 block tracking-widest">Check-Out</label>
                <input 
                  type="date" 
                  value={formData.checkOutDate} 
                  onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} 
                  className="w-full bg-white/5 border border-blue-500/20 p-4 rounded-2xl outline-none" 
                  required 
                />
              </div>

              <button disabled={loading} className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[20px] uppercase mt-4 transition-all active:scale-95">
                {loading ? "SAVING..." : "UPDATE BOOKING"}
              </button>

              {message && <div className="md:col-span-2 text-green-500 text-center font-bold text-[10px] uppercase bg-green-500/10 py-3 rounded-xl border border-green-500/20">{message}</div>}
              {error && <div className="md:col-span-2 text-red-500 text-center font-bold text-[10px] uppercase bg-red-500/10 py-3 rounded-xl border border-red-500/20">{error}</div>}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditBookingPage;