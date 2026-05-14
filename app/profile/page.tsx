"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileApi } from '../../services/userService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, ShieldCheck, UserCircle, ArrowLeft, Edit3, Save, X } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('user_name');
      const email = localStorage.getItem('user_email');
      const phone = localStorage.getItem('user_phone') || "Not Set";
      
      setUser({ name: name || "User", email: email || "user@example.com", phone: phone, role: "Premium Member" });
      setNewName(name || "");
      setNewPhone(phone !== "Not Set" ? phone : "");
    }
  }, []);

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfileApi(newName, newPhone);
      
      // লোকাল স্টোরেজ আপডেট
      localStorage.setItem('user_name', newName);
      localStorage.setItem('user_phone', newPhone);
      
      setUser((prev: any) => ({ ...prev, name: newName, phone: newPhone }));
      setIsEditing(false);
      alert("✅ Profile Updated Successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Update Failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="bg-black min-h-screen text-white flex items-center justify-center font-black animate-pulse">LOADING...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans">
      <Header userName={user.name} />
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-[#0c0c0c] border border-zinc-800 rounded-[45px] p-12 text-center shadow-2xl">
          <div className="mx-auto w-28 h-28 bg-yellow-500 rounded-[35px] flex items-center justify-center text-black text-5xl font-black mb-8 border-4 border-black">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-8">
            {isEditing ? (
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-zinc-900 border border-yellow-500 p-3 rounded-xl w-full text-center outline-none" />
            ) : (
              <h1 className="text-4xl font-black tracking-tighter uppercase">{user.name}</h1>
            )}
            
            <div className="flex items-center justify-center gap-2 text-yellow-500">
              <ShieldCheck className="w-4 h-4" /> <span className="text-[11px] font-black uppercase tracking-widest">{user.role}</span>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-5 px-6 py-5 bg-zinc-900/40 rounded-3xl border border-zinc-800">
                <Mail className="w-6 h-6 text-zinc-600" />
                <div><p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Email</p><p className="font-bold">{user.email}</p></div>
              </div>
              <div className="flex items-center gap-5 px-6 py-5 bg-zinc-900/40 rounded-3xl border border-zinc-800">
                <UserCircle className="w-6 h-6 text-zinc-600" />
                <div className="w-full">
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Phone</p>
                  {isEditing ? (
                    <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="bg-black border border-zinc-700 p-1 rounded w-full outline-none focus:border-yellow-500" />
                  ) : ( <p className="font-bold">{user.phone}</p> )}
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              {isEditing ? (
                <div className="flex gap-3">
                  <button onClick={handleUpdateProfile} disabled={loading} className="flex-1 bg-yellow-500 text-black font-black py-4 rounded-[20px] hover:bg-yellow-400"> {loading ? "SAVING..." : "SAVE"} </button>
                  <button onClick={() => setIsEditing(false)} className="px-6 bg-zinc-800 py-4 rounded-[20px]"><X/></button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full bg-zinc-900 border border-zinc-800 py-5 rounded-[25px] font-black"><Edit3 className="inline mr-2"/> Edit Profile</button>
              )}
              <button onClick={() => router.push('/home')} className="w-full bg-white text-black py-5 rounded-[25px] font-black hover:bg-yellow-500 transition-all"><ArrowLeft className="inline mr-2"/> Back to Home</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;