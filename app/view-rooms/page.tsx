"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'; 
import Footer from '@/components/Footer';

const THEME = {
  background: "#0f172a",
  cardBg: "#0e122e",
  primary: "#4927d2",
  textMain: "#ffffff",
  textMuted: "#a1b5d2",
  accent: "#558ee9"
};

const ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600"
];

const ROOM_SUBTITLES = ["Standard Comfort", "Executive Suite", "Premium Lounge", "Royal Luxury"];

interface Room { id: number; name: string; price: number; }

const RoomCard = ({ room, index, onBook }: { room: Room, index: number, onBook: (id: number, img: string) => void }) => {
  const imageUrl = ROOM_IMAGES[index % ROOM_IMAGES.length];
  const subTitle = ROOM_SUBTITLES[index % ROOM_SUBTITLES.length];

  return (
    <div style={{ backgroundColor: THEME.cardBg }} className="min-w-[280px] md:min-w-[320px] rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-2 snap-center group shadow-xl">
      <div className="h-44 overflow-hidden relative bg-gray-800">
        <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={room.name} />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-1 tracking-tight">{room.name}</h3>
        <p style={{ color: THEME.accent }} className="text-[10px] uppercase tracking-widest font-bold mb-6">{subTitle}</p>
        <div className="mt-auto flex justify-between items-center pt-5 border-t border-white/5">
          <div>
            <p style={{ color: THEME.textMuted }} className="text-[10px] uppercase font-bold">Per Night</p>
            <p className="text-2xl font-black">৳{room.price}</p>
          </div>
          <button 
            onClick={() => onBook(room.id, imageUrl)}
            style={{ backgroundColor: THEME.textMain, color: THEME.background }}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md"
          >Book</button>
        </div>
      </div>
    </div>
  );
};

const ViewRoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const name = localStorage.getItem('user_name');
    if (!token) return router.push('/login');
    setUserName(name || "User");

    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/customer/rooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchRooms();
  }, [router]);

  return (
    <div style={{ backgroundColor: THEME.background, color: THEME.textMain }} className="min-h-screen flex flex-col font-sans">
      <Header userName={userName} />
      
      <main className="flex-1 w-full py-12 overflow-hidden flex flex-col items-center">
        <div className="mb-12 text-center px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">Available Rooms</h1>
          <div style={{ backgroundColor: THEME.primary }} className="h-1 w-16 mx-auto mb-4 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: THEME.primary }}></div>
          </div>
        ) : (
          <>
            <div className="flex flex-nowrap md:justify-center gap-6 overflow-x-auto px-10 pb-10 no-scrollbar snap-x w-full">
              {rooms.map((room, index) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  index={index} 
                  onBook={(id, img) => router.push(`/book-room/${id}?img=${encodeURIComponent(img)}`)} 
                />
              ))}
            </div>

            {/* --- Compact Back to Home Button --- */}
            <div className="mt-6 mb-8">
              <button 
                onClick={() => router.push('/home')}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-[11px] font-bold tracking-[0.1em] uppercase active:scale-95 shadow-sm"
              >
                <span className="opacity-50 group-hover:-translate-x-0.5 transition-transform text-sm">←</span> 
                Home
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ViewRoomsPage;