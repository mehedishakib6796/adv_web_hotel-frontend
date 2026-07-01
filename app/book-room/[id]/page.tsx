"use client";
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header'; 
import Footer from '@/components/Footer';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304";
const THEME = {
  accent: "#487be8",
  bg: "#140f37",
  card: "#1d2942",
  text: "#ffffff",
  input: "#1e2126"
};

const BookRoomContent = () => {
  const { id: roomIdFromUrl } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialImage = searchParams.get('img');

  const [userName, setUserName] = useState(""); 
  const [roomImage, setRoomImage] = useState<string>(initialImage || ""); 
  const [formData, setFormData] = useState({
    customerName: "", 
    email: "", 
    phoneNumber: "", 
    gender: "Male", 
    checkInDate: "", 
    checkOutDate: ""
  });

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    const token = localStorage.getItem('access_token');
    
    if (!token) return router.push('/login');
    
    if (name) {
      setUserName(name);
      setFormData(prev => ({ ...prev, customerName: name }));
    }

    const fetchRoomDetails = async () => {
      if (initialImage) return;
      try {
        const response = await axios.get(`https://adv-web-hotel-backend.vercel.app/customer/rooms/${roomIdFromUrl}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoomImage(response.data.imageURL || DEFAULT_IMAGE); 
      } catch (error) {
        setRoomImage(DEFAULT_IMAGE);
      }
    };

    fetchRoomDetails();
  }, [roomIdFromUrl, router, initialImage]);

  const handleInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    // YYYY-MM-DD ফরম্যাটকে ব্যাকএন্ডের রিকোয়ারমেন্ট অনুযায়ী DD-MM-YYYY তে রূপান্তর করার ফাংশন
    const formatDateForBackend = (dateString: string) => {
      if (!dateString) return "";
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    };

    try {
      const payload = { 
        ...formData, 
        roomId: Number(roomIdFromUrl), 
        checkInDate: formatDateForBackend(formData.checkInDate), // DD-MM-YYYY ফরম্যাটে কনভার্ট হলো
        checkOutDate: formatDateForBackend(formData.checkOutDate) // DD-MM-YYYY ফরম্যাটে কনভার্ট হলো
      };

      await axios.post('https://adv-web-hotel-backend.vercel.app/customer/bookings', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("🎉 Reservation Confirmed successfully!");
      router.push('/home'); 
    } catch (error: any) {
      alert("❌ Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: THEME.bg, color: THEME.text }}>
      <Header userName={userName} />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-white/5 shadow-2xl transition-all" 
        style={{ backgroundColor: THEME.card }}>
          
          <div className="md:w-5/12 relative flex flex-col justify-end overflow-hidden group min-h-[300px]">
            {roomImage && (
              <img 
                src={roomImage} 
                alt="Room" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e: any) => { e.target.src = DEFAULT_IMAGE; }} 
              />
            )}

            <div className="absolute inset-0 opacity-80" style={{ background: `linear-gradient(to top, ${THEME.accent}, transparent)` }}></div>
            <div className="relative p-8 z-10 text-white">
              <h2 className="text-4xl font-black italic drop-shadow-md">Room #{roomIdFromUrl}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Premium Choice</p>
            </div>
          </div>

          <div className="md:w-7/12 p-8 md:p-10">
            <div className="mb-6">
              <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: THEME.accent }}>Room Booking</h1>
              <div className="h-1 w-8 bg-slate-700 mt-2 rounded-full"></div>
            </div>

            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
              <InputField 
                label="Full Name" 
                name="customerName" 
                val={formData.customerName} 
                change={handleInput} 
                full 
                accent={THEME.accent} 
                bg={THEME.input} 
              />

              <InputField 
                label="Email Address" 
                name="email" 
                type="email" 
                val={formData.email}
                placeholder="example@mail.com" 
                change={handleInput} 
                accent={THEME.accent} 
                bg={THEME.input} 
              />

              <InputField 
                label="Phone Number" 
                name="phoneNumber" 
                val={formData.phoneNumber}
                placeholder="01XXXXXXXXX" 
                change={handleInput} 
                accent={THEME.accent} 
                bg={THEME.input} 
              />

              <InputField 
                label="Check-in Date" 
                name="checkInDate" 
                type="date" 
                val={formData.checkInDate}
                change={handleInput} 
                accent={THEME.accent} 
                bg={THEME.input} 
              />

              <InputField 
                label="Check-out Date" 
                name="checkOutDate" 
                type="date" 
                val={formData.checkOutDate}
                change={handleInput} 
                accent={THEME.accent} 
                bg={THEME.input} 
              />

              <div className="md:col-span-2 pt-4 flex gap-3">
                <button type="submit" className="flex-1 font-bold py-4 rounded-xl uppercase text-xs transition-all active:scale-95 shadow-lg" style={{ backgroundColor: THEME.accent, color: "#ffffff" }}>
                  Confirm Now
                </button>
                <button type="button" onClick={() => router.back()} className="px-8 border border-white/10 text-[10px] font-bold uppercase rounded-xl hover:bg-white/5 transition-all">
                  Back
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function BookRoomPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#18142e] text-white">Loading...</div>}>
      <BookRoomContent />
    </Suspense>
  );
}

const InputField = ({ label, name, type = "text", val, change, full, accent, bg, placeholder = "" }: any) => (
  <div className={`${full ? 'md:col-span-2' : ''} space-y-1.5`}>
    <label className="text-[15px] uppercase font-bold text-slate-500 ml-1 tracking-wider">{label}</label>
    <input 
      name={name} 
      type={type} 
      required 
      value={val} 
      onChange={change} 
      placeholder={placeholder}
      style={{ backgroundColor: bg, border: `1px solid rgba(255,255,255,0.05)`, color: "#ffffff" }}
      className="w-full p-4 rounded-xl outline-none text-sm transition-all focus:ring-1 placeholder:text-gray-600"
    />
  </div>
);