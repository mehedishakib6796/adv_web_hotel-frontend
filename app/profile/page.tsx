"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProfileApi, updateProfileApi } from '@/services/userService'; 
import { Mail, ShieldCheck, ArrowLeft, Edit3, Phone, User, X, Check } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const router = useRouter();

  

  const [theme] = useState({
    background: "#0c1324",
    accent: "#06b6d4",     
    cardBg: "#1b3c96",    
    border: "border-zinc-800/60",
    textMuted: "#e9e9f1",  
  });


  useEffect(() => {
    const fetchDatabaseProfile = async () => {
      try {
        setFetchLoading(true);
        const currentUsername = localStorage.getItem('user_name');
        
        if (!currentUsername) {
          console.warn("No logged in user found in localStorage");
          setFetchLoading(false);
          return;
        }

        const dbUser = await getProfileApi(currentUsername);

        if (dbUser) {
          const profileData: UserProfile = {
            name: dbUser.username || "Customer",
            email: dbUser.email || `${dbUser.username || 'user'}@gmail.com`,
            phone: dbUser.phone || "Not Set",
            role: dbUser.role || "customer"
          };
          
          updateProfileState(profileData);
        }
      } catch (err: any) {
        console.error("Database fetch failed, checking localStorage backup:", err);
        
       const profileData: UserProfile = {
          name: localStorage.getItem('user_name') || "Customer",
          email: localStorage.getItem('user_email') || "user@example.com",
          phone: "01734157179", 
          role: "customer"
        };
        
        updateProfileState(profileData);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchDatabaseProfile();
  }, []);

 
  const updateProfileState = (data: UserProfile) => {
    const fixedPhone = "01734157179"; 

    setUser({
      ...data,
      phone: fixedPhone 
    });
    setNewName(data.name);
    setNewPhone(fixedPhone); 
    localStorage.setItem('user_name', data.name);
    localStorage.setItem('user_phone', fixedPhone); 
  };


  const handleUpdateProfile = async () => {
    if (!newName.trim()) return alert("Name cannot be empty!");

    setLoading(true);
    try {
      const data = await updateProfileApi(newName, newPhone);
      const updatedUser = data?.updatedUser;
      
      const latestName = updatedUser?.username || newName;
      const latestPhone = updatedUser?.phone || newPhone;

      updateProfileState({
        name: latestName,
        phone: latestPhone,
        email: user?.email || "",
        role: user?.role || "customer"
      });
      
      setIsEditing(false);
      alert("✅ Profile Updated Successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Update Failed!");
    } finally {
      setLoading(false);
    }
  };

 
  if (fetchLoading || !user) {
    return (
      <div className="bg-[#0b0f19] min-h-screen text-white flex flex-col items-center justify-center font-bold animate-pulse tracking-widest text-sm gap-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        SECURELY FETCHING DATABASE PROFILE...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.background }} className="flex flex-col min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <Header userName={user.name} />
      
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12 md:py-16 z-10">

       
        <div className={`flex items-center justify-between gap-6 mb-12 pb-4 border-b ${theme.border}`}>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">Profile</h1>
          <button 
            onClick={() => router.push('/home')} 
            className="inline-flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4"/> Back to Home
          </button>
        </div>

        {/* মেইন গ্রিড কন্টেন্ট */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side Avatar Card */}
          <div style={{ backgroundColor: theme.cardBg + "99" }}
           className="lg:col-span-4 border border-white/[0.03] p-8 rounded-2xl flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-5">
              <div style={{ background: `linear-gradient(to right, ${theme.accent}, ${theme.accent + "aa"})` }}
               className="absolute -inset-1 rounded-full blur opacity-30"></div>
              <div style={{ color: theme.accent, borderColor: theme.border }}
               className="relative w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-3xl font-black select-none border">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <h2 className="text-xl font-bold truncate max-w-full text-white">{user.name}</h2>
            <div style={{ backgroundColor: theme.accent + "0d", borderColor: theme.accent + "1a" }} className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border">
              <ShieldCheck style={{ color: theme.accent }} className="w-3.5 h-3.5" /> 
              <span style={{ color: theme.accent }} className="text-[10px] font-bold tracking-widest uppercase">{user.role}</span>
            </div>
          </div>

          {/* Right Side Information Card */}
          <div style={{ backgroundColor: theme.cardBg + "4d" }} className="lg:col-span-8 border border-white/[0.02] p-8 md:p-10 rounded-2xl">
            <div className={`flex items-center justify-between mb-8 pb-3 border-b ${theme.border}`}>
              <h3 style={{ color: theme.textMuted }} className="font-bold text-xs uppercase tracking-widest">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  style={{ color: theme.accent }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5"/> Edit Info
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 py-2">
                <span style={{ color: theme.textMuted }} className="text-xs font-bold uppercase tracking-widest w-32">Full Name</span>
                <div className="flex-grow">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      className={`bg-zinc-950/80 border ${theme.border} focus:border-cyan-500/40 px-4 py-2.5 rounded-xl w-full text-white outline-none text-sm font-medium transition-all`}
                    />
                  ) : (
                    <span className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                      <User className="w-4 h-4 text-zinc-600" /> {user.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 py-2">
                <span style={{ color: theme.textMuted }} className="text-xs font-bold uppercase tracking-widest w-32">Email Address</span>
                <div className="flex-grow">
                  <span style={{ color: theme.textMuted }} className="text-base font-semibold flex items-center gap-2 select-all">
                    <Mail className="w-4 h-4 text-zinc-600" /> {user.email}
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 py-2">
                <span style={{ color: theme.textMuted }} className="text-xs font-bold uppercase tracking-widest w-32">Phone Number</span>
                <div className="flex-grow">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={newPhone} 
                      onChange={(e) => setNewPhone(e.target.value)} 
                      className={`bg-zinc-950/80 border ${theme.border} focus:border-cyan-500/40 px-4 py-2.5 rounded-xl w-full text-white outline-none text-sm font-medium transition-all`}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <span className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-zinc-600" /> {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button (cancel & save) */}
            {isEditing && (
              <div className={`mt-10 pt-6 border-t ${theme.border} flex items-center justify-end gap-3`}>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5"/> Cancel
                </button>
                <button 
                  onClick={handleUpdateProfile} 
                  disabled={loading} 
                  style={{ backgroundColor: theme.accent, color: "black" }}
                  className="font-extrabold px-5 py-2 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                > 
                  <Check className="w-3.5 h-3.5"/> {loading ? "Saving..." : "Save Changes"} 
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;