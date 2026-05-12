"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

const BookRoomPage = () => {
  const params = useParams();
  const roomIdFromUrl = params.id; 
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    gender: "Male",
    checkInDate: "",
    checkOutDate: "",
  });

  useEffect(() => {
    const name = localStorage.getItem('user_name');
    if (name) setFormData(prev => ({ ...prev, customerName: name }));
    
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/login');
  }, [router]);

  // ব্যাকএন্ডের রিকোয়ারমেন্ট অনুযায়ী DD-MM-YYYY ফরম্যাট
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`; 
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      // তোমার DTO অনুযায়ী প্রপার্টিগুলোর নাম হুবহু মিলানো হয়েছে
      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        roomId: Number(roomIdFromUrl), // DTO তে 'roomId' নাম আছে (ছোট d)
        checkInDate: formatDate(formData.checkInDate),
        checkOutDate: formatDate(formData.checkOutDate)
      };

      const response = await axios.post('http://localhost:3000/customer/bookings', payload, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert("✅ Booking Success!");
      router.push('/home');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message;
      alert("❌ Error: " + (Array.isArray(errorMsg) ? errorMsg.join(' | ') : errorMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex justify-center items-center font-sans">
      <div className="bg-[#111] p-10 rounded-[40px] border border-white/5 w-full max-w-lg shadow-2xl">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-tighter">Room Reservation</h2>
          <p className="bg-yellow-500/10 text-yellow-500 text-[12px] py-1 px-4 rounded-full inline-block mt-3 font-bold uppercase">
            Room ID: {roomIdFromUrl}
          </p>
        </div>
        
        <form onSubmit={handleBooking} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Customer Name</label>
            <input type="text" required value={formData.customerName}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, customerName: e.target.value})} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Email (@gmail.com)</label>
            <input type="email" required placeholder="example@gmail.com"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Phone Number</label>
            <input type="text" required placeholder="017XXXXXXXX"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Gender</label>
            <select className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
              onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="Male" className="bg-black">Male</option>
              <option value="Female" className="bg-black">Female</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Check-in</label>
              <input type="date" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
                onChange={(e) => setFormData({...formData, checkInDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2">Check-out</label>
              <input type="date" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500"
                onChange={(e) => setFormData({...formData, checkOutDate: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} 
            className="w-full bg-yellow-500 text-black font-black py-5 rounded-[22px] mt-4 uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-yellow-500/10">
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRoomPage;