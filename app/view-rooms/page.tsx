"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'; 
import Footer from '@/components/Footer';

interface Room {
  id: number;
  name: string;   
  price: number;
}

const ViewRoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const name = localStorage.getItem('user_name');
    
    if (!token) {
      router.push('/login');
      return;
    }
    setUserName(name || "User");

    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:3000/customer/rooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(res.data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      
      {/* ১. হেডার */}
      <Header userName={userName} />

      <main className="flex-1 w-full px-4 md:px-10 py-12">
        {/* ২. বড় হিরো সেকশন */}
        <div className="mb-12 border-b border-white/10 pb-12 text-center bg-gradient-to-b from-white/[0.02] to-transparent rounded-b-[50px]">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
            Executive <span className="text-yellow-500">Suites</span>
          </h1>
          <p className="text-gray-500 text-[10px] tracking-[0.5em] uppercase font-bold">
            World-Class Luxury & Comfort
          </p>
        </div>

        {/* ৩. রুম লিস্ট */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Connecting to Database...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center p-12 bg-red-500/5 rounded-[40px] border border-red-500/10">
             <p className="text-red-500 font-black mb-2 uppercase text-sm">Error Detected</p>
             <p className="text-xs text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <div key={room.id} className="group bg-[#111] rounded-[35px] overflow-hidden border border-white/5 hover:border-yellow-500/30 transition-all duration-700 flex flex-col h-full shadow-2xl">
                
                {/* ইমেজ সেকশন */}
                <div className="h-48 bg-gray-900 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    alt={room.name}
                  />
                  <div className="absolute top-5 left-5">
                    <span className="bg-black/60 backdrop-blur-md text-[9px] text-white font-black px-3 py-1.5 rounded-full uppercase tracking-tighter border border-white/10">
                      Available
                    </span>
                  </div>
                </div>

                {/* কন্টেন্ট সেকশন */}
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-yellow-500 transition-colors duration-300">
                    {room.name}
                  </h3>
                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-2 font-bold italic">Premier Quality</p>
                  
                  {/* প্রাইজ এবং বুকিং বাটন */}
                  <div className="mt-10 flex justify-between items-center bg-white/[0.03] p-4 rounded-[24px] border border-white/5 group-hover:bg-white/[0.06] transition-all">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Rate</span>
                      <span className="text-xl font-black text-white leading-none">৳{room.price}</span>
                    </div>
                    
                    {/* বুকিং লিঙ্ক এখানে যুক্ত করা হয়েছে */}
                    <button 
                      onClick={() => router.push(`/book-room/${room.id}`)}
                      className="bg-white hover:bg-yellow-500 text-black text-[10px] font-black px-6 py-3 rounded-2xl transition-all shadow-xl active:scale-90 uppercase tracking-widest"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ৪. ফুটার */}
      <Footer />

    </div>
  );
};

export default ViewRoomsPage;