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

  const fields = [
    { label: "Full Name", icon: User, value: user.name, editable: true, key: "name" as const },
    { label: "Email Address", icon: Mail, value: user.email, editable: false, key: "email" as const },
    { label: "Phone Number", icon: Phone, value: user.phone, editable: true, key: "phone" as const },
  ];

  return (
    <div style={{ backgroundColor: theme.background }} className="flex flex-col min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <Header userName={user.name} />

      <main className="flex-grow w-full z-10">

        {/* Top banner strip with back button */}
        <div className={`border-b ${theme.border} px-6 py-4`}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span style={{ color: theme.textMuted }} className="text-xs font-bold uppercase tracking-[0.25em]">
              Account
            </span>
            <button
              onClick={() => router.push('/home')}
              className="inline-flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        {/* Hero identity banner */}
        <div
          style={{ background: `linear-gradient(135deg, ${theme.cardBg} 0%, ${theme.background} 100%)` }}
          className="w-full px-6 pt-14 pb-20 relative overflow-hidden"
        >
          <div
            style={{ backgroundColor: theme.accent }}
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-10 blur-3xl"
          />
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-6 relative">
            <div className="relative w-28 h-28 shrink-0">
              <div
                style={{ background: `linear-gradient(to right, ${theme.accent}, ${theme.accent}aa)` }}
                className="absolute -inset-1 rounded-full blur opacity-40"
              />
              <div
                style={{ color: theme.accent }}
                className="relative w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-4xl font-black select-none border border-white/10"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>

            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">{user.name}</h1>
              <div
                style={{ backgroundColor: theme.accent + "0d", borderColor: theme.accent + "1a" }}
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border"
              >
                <ShieldCheck style={{ color: theme.accent }} className="w-3.5 h-3.5" />
                <span style={{ color: theme.accent }} className="text-[10px] font-bold tracking-widest uppercase">
                  {user.role}
                </span>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: theme.accent, color: "black" }}
                className="inline-flex items-center gap-1.5 font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Info
              </button>
            )}
          </div>
        </div>

        {/* Info rows, pulled up over the banner */}
        <div className="max-w-5xl mx-auto px-6 -mt-10 pb-16">
          <div
            style={{ backgroundColor: theme.cardBg + "4d" }}
            className="border border-white/[0.02] rounded-2xl divide-y divide-white/[0.04] overflow-hidden"
          >
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 px-6 md:px-8 py-6">
                  <span style={{ color: theme.textMuted }} className="text-xs font-bold uppercase tracking-widest w-36 shrink-0">
                    {field.label}
                  </span>

                  <div className="flex-grow">
                    {isEditing && field.editable ? (
                      <input
                        type="text"
                        value={field.key === "name" ? newName : newPhone}
                        onChange={(e) =>
                          field.key === "name" ? setNewName(e.target.value) : setNewPhone(e.target.value)
                        }
                        placeholder={field.key === "phone" ? "Enter phone number" : undefined}
                        className={`bg-zinc-950/80 border ${theme.border} focus:border-cyan-500/40 px-4 py-2.5 rounded-xl w-full max-w-sm text-white outline-none text-sm font-medium transition-all`}
                      />
                    ) : (
                      <span className="text-base font-semibold text-zinc-200 flex items-center gap-2">
                        <Icon className="w-4 h-4 text-zinc-600" /> {field.value}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          {isEditing && (
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                style={{ backgroundColor: theme.accent, color: "black" }}
                className="font-extrabold px-5 py-2 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
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