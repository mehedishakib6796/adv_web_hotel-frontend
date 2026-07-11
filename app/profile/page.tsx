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

  const infoFields = [
    { label: "Full Name", icon: User, value: user.name, editable: true, key: "name" as const, placeholder: "Enter your name" },
    { label: "Phone Number", icon: Phone, value: user.phone, editable: true, key: "phone" as const, placeholder: "Enter phone number" },
    { label: "Email Address", icon: Mail, value: user.email, editable: false, key: "email" as const, placeholder: "" },
  ];

  return (
    <div style={{ backgroundColor: theme.background }} className="flex flex-col min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <Header userName={user.name} />

      <main className="flex-grow w-full mx-auto px-6 py-12 md:py-16 z-10 max-w-3xl">

        {/* Top nav row */}
        <div className="flex items-center justify-between gap-6 mb-8">
          <span style={{ color: theme.textMuted }} className="text-xs font-bold uppercase tracking-[0.25em] opacity-70">
            My Account
          </span>
          <button
            onClick={() => router.push('/home')}
            className="inline-flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Single unified card */}
        <div
          style={{ backgroundColor: theme.cardBg + "33" }}
          className="relative border border-white/[0.04] rounded-3xl overflow-hidden shadow-2xl shadow-black/20"
        >
          {/* subtle glow accent */}
          <div
            style={{ backgroundColor: theme.accent }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
          />

          {/* Centered identity block */}
          <div className={`relative flex flex-col items-center text-center px-8 pt-12 pb-8 border-b ${theme.border}`}>
            <div className="relative w-24 h-24 mb-5">
              <div
                style={{ background: `linear-gradient(to right, ${theme.accent}, ${theme.accent}aa)` }}
                className="absolute -inset-1 rounded-full blur opacity-30"
              />
              <div
                style={{ color: theme.accent }}
                className="relative w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-3xl font-black select-none border border-white/10 ring-2 ring-white/[0.03]"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{user.name}</h1>

            <div
              style={{ backgroundColor: theme.accent + "0d", borderColor: theme.accent + "1a" }}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border"
            >
              <ShieldCheck style={{ color: theme.accent }} className="w-3.5 h-3.5" />
              <span style={{ color: theme.accent }} className="text-[10px] font-bold tracking-widest uppercase">
                {user.role}
              </span>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{ color: theme.accent }}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mt-6 hover:opacity-80 transition-opacity"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>

          {/* Info list */}
          <div className="px-6 md:px-8 py-8 space-y-4">
            {infoFields.map((field) => {
              const Icon = field.icon;
              const isThisEditable = isEditing && field.editable;
              return (
                <div
                  key={field.key}
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/[0.03]"
                >
                  <div
                    style={{ backgroundColor: theme.accent + "12", color: theme.accent }}
                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="flex-grow min-w-0">
                    <p style={{ color: theme.textMuted }} className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
                      {field.label}
                    </p>
                    {isThisEditable ? (
                      <input
                        type="text"
                        value={field.key === "name" ? newName : newPhone}
                        onChange={(e) =>
                          field.key === "name" ? setNewName(e.target.value) : setNewPhone(e.target.value)
                        }
                        placeholder={field.placeholder}
                        className={`bg-zinc-950/80 border ${theme.border} focus:border-cyan-500/40 px-3 py-2 rounded-lg w-full text-white outline-none text-sm font-semibold transition-all`}
                      />
                    ) : (
                      <p className="text-sm md:text-base font-semibold text-zinc-100 truncate">{field.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action footer */}
          {isEditing && (
            <div className={`px-6 md:px-8 pb-8 pt-2 flex items-center justify-end gap-3 border-t ${theme.border} mt-2`}>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                style={{ backgroundColor: theme.accent, color: "black" }}
                className="font-extrabold px-5 py-2.5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 active:scale-[0.98]"
              >
                <Check className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;