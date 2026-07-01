"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EditBookingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  
  
  const cleanId = typeof id === 'string' ? id.replace(/[^0-9]/g, '') : id;

  
  const [accent] = useState("#487be8"); 
  const [bg] = useState("#18142e");     
  const [card] = useState("#111827");   
  const [text] = useState("#ffffff");   
  const [inputBg] = useState("#1f2937"); 

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

  const toViewDate = (dateVal: any) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
  };

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
    
    if (cleanId) {
      // লোকালহোস্ট এপিআই পরিবর্তন করে লাইভ ডেটা ফেচিং ইউআরএল ব্যবহার করা হয়েছে
      axios.get(`https://adv-web-hotel-backend.vercel.app/customer/bookings/${cleanId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
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
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Data cannot load";
        setError(Array.isArray(msg) ? msg[0] : msg);
      })
      .finally(() => setFetching(false));
    }
  }, [cleanId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const token = localStorage.getItem('access_token');
    const payload = {
      ...formData,
      roomId: Number(formData.roomId),
      checkInDate: toBackendDate(formData.checkInDate),
      checkOutDate: toBackendDate(formData.checkOutDate)
    };

    try {
      // লোকালহোস্ট এপিআই পরিবর্তন করে লাইভ প্যাচ এপিআই এন্ডপয়েন্ট ব্যবহার করা হয়েছে
      await axios.patch(`https://adv-web-hotel-backend.vercel.app/customer/bookings/${cleanId}`, payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessage("✅ Booking Update Successfully!");
      setTimeout(() => router.push('/my-bookings'), 2000);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Update Failed।";
      setError(Array.isArray(errMsg) ? errMsg[0] : errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: bg, color: text }}>
      <Header userName={userName} />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-[2rem] p-8 md:p-10 border border-white/5 shadow-2xl transition-all" style={{ backgroundColor: card }}>
          
          {/* হেডার সেকশন */}
          <div className="mb-6">
            <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: accent }}>Update Booking</h1>
            <div className="h-1 w-8 bg-slate-700 mt-2 rounded-full"></div>
          </div>

          {fetching ? (
            <p className="text-center py-10 animate-pulse text-zinc-500 font-bold tracking-widest text-xs">LOADING...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Customer Name - ReadOnly */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Customer Name</label>
                <input 
                  type="text" 
                  value={formData.customerName} 
                  readOnly 
                  style={{ backgroundColor: inputBg, border: `1px solid rgba(255,255,255,0.05)` }}
                  className="w-full p-4 rounded-xl outline-none text-sm text-zinc-400 cursor-not-allowed opacity-70" 
                />
              </div>

              {/* Email Address - ReadOnly */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  readOnly 
                  style={{ backgroundColor: inputBg, border: `1px solid rgba(255,255,255,0.05)` }}
                  className="w-full p-4 rounded-xl outline-none text-sm text-zinc-400 cursor-not-allowed opacity-70" 
                />
              </div>

              {/* Phone Number - Editable */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                  style={{ backgroundColor: inputBg, border: `1px solid rgba(255,255,255,0.05)`, color: "#ffffff" }}
                  className="w-full p-4 rounded-xl outline-none text-sm font-medium focus:ring-1 transition-all"
                  required 
                />
              </div>

              {/* Dates - 2 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Check-In</label>
                  <input 
                    type="date" 
                    value={formData.checkInDate} 
                    onChange={(e) => setFormData({...formData, checkInDate: e.target.value})} 
                    style={{ backgroundColor: inputBg, border: `1px solid rgba(255,255,255,0.05)`, color: "#ffffff" }}
                    className="w-full p-4 rounded-xl outline-none text-sm focus:ring-1" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Check-Out</label>
                  <input 
                    type="date" 
                    value={formData.checkOutDate} 
                    onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} 
                    style={{ backgroundColor: inputBg, border: `1px solid rgba(255,255,255,0.05)`, color: "#ffffff" }}
                    className="w-full p-4 rounded-xl outline-none text-sm focus:ring-1" 
                    required 
                  />
                </div>
              </div>

              {/* Buttons - Confirm & Back */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 font-bold py-4 rounded-xl uppercase text-xs transition-all active:scale-95 shadow-lg disabled:opacity-50" 
                  style={{ backgroundColor: accent, color: "#ffffff" }}
                >
                  {loading ? "Saving..." : "Update Booking"}
                </button>
                <button 
                  type="button" 
                  onClick={() => router.back()} 
                  className="px-8 border border-white/10 text-[10px] font-bold uppercase rounded-xl hover:bg-white/5 transition-all"
                >
                  Back
                </button>
              </div>

              {/* error & success message */}
              {message && <div className="text-green-400 text-center text-xs bg-green-500/5 py-3 rounded-xl border border-green-500/10 font-bold uppercase tracking-wider">{message}</div>}
              {error && <div className="text-red-400 text-center text-xs bg-red-500/5 py-3 rounded-xl border border-red-500/10 font-bold uppercase tracking-wider">{error}</div>}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditBookingPage;