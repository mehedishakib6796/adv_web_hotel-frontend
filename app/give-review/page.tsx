"use client";
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 💡 সব লজিক এবং ইউআই এখন ১টি মাত্র সহজ কম্পোনেন্টের ভেতরে
const GiveReviewContent = () => {
  const [userName, setUserName] = useState(""); 
  const [bookingId, setBookingId] = useState(""); 
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false); // ফর্ম সাবমিশনে আর ইউজ হচ্ছে না
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // ==========================================================
  // 🎨 কালার প্যানেল (এখান থেকে নিজের ইচ্ছামতো কালার এডিট করো)
  // ==========================================================
  const colors = {
    pageBg: "#18142e",       // পুরো পেজের ব্যাকগ্রাউন্ড কালার
    cardBg: "#111827",       // মাঝখানের মেইন কার্ডের ব্যাকগ্রাউন্ড কালার
    accent: "#487be8",       // মেইন হাইলাইট কালার (টাইটেল, বাটন এবং ফোকাসড বর্ডার)
    inputBg: "#1f2937",      // ইনপুট ফিল্ড ও টেক্সটএরিয়ার ব্যাকগ্রাউন্ড কালার
    inputBorder: "rgba(255, 255, 255, 0.05)", // ইনপুটের হালকা বর্ডার কালার
    textLabel: "#64748b",    // ইনপুটের উপরের ছোট লেবেল টেক্সটের কালার (slate-500)
    textReadonly: "#a1a1aa", // কাস্টমার নেম (যেটা এডিট করা যায় না) সেটার টেক্সট কালার
    textInput: "#ffffff",    // সাধারণ ইনপুট টেক্সটের কালার
  };

  useEffect(() => {
    // ১. URL থেকে bookingId নেওয়া
    const idFromUrl = searchParams.get('bookingId');
    if (idFromUrl) setBookingId(idFromUrl);

    // ২. LocalStorage থেকে ইউজার ও টোকেন চেক করা
    const name = localStorage.getItem('user_name');
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/login');
    } else if (name) {
      setUserName(name); 
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem('access_token');

    try {
      const reviewData = {
        customerName: userName,
        bookingId: parseInt(bookingId), 
        rating: parseInt(rating.toString()), 
        comment: comment
      };

      const res = await axios.post('http://localhost:3000/customer/reviews', reviewData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 201 || res.status === 200) {
        setMessage("Review submitted successfully!");
        
        // 💡 সাবমিট হওয়ার ২ সেকেন্ড পর সরাসরি '/my-bookings' পেজে নিয়ে যাবে
        setTimeout(() => router.push('/my-bookings'), 2000);
      }
    } catch (err: any) {
      const backendError = err.response?.data?.message;
      setError(Array.isArray(backendError) ? backendError[0] : backendError || "Submission failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: colors.pageBg, color: "#ffffff" }}>
      {/* হেডার কম্পোনেন্ট */}
      <Header userName={userName} />
      
      <main className="flex-1 flex items-center justify-center p-4">
        {/* মেইন কার্ড কন্টেইনার */}
        <div className="w-full max-w-2xl rounded-[2rem] p-8 md:p-10 border shadow-2xl transition-all" 
          style={{ backgroundColor: colors.cardBg, borderColor: colors.inputBorder }}>
          
          {/* টাইটেল */}
          <div className="mb-6">
            <h1 className="text-2xl font-black uppercase tracking-widest" style={{ color: colors.accent }}>Guest Feedback</h1>
            <div className="h-1 w-8 mt-2 rounded-full" style={{ backgroundColor: colors.textLabel }}></div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Customer Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] uppercase font-bold ml-1 tracking-wider" style={{ color: colors.textLabel }}>Customer Name</label>
              <input 
                type="text" 
                value={userName}
                readOnly
                style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textReadonly }}
                className="w-full p-4 rounded-xl border outline-none text-sm cursor-not-allowed"
              />
            </div>

            {/* Booking ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold ml-1 tracking-wider" style={{ color: colors.textLabel }}>Booking ID</label>
              <input 
                type="number" 
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                readOnly={!!searchParams.get('bookingId')}
                style={{ 
                  backgroundColor: colors.inputBg, 
                  borderColor: colors.inputBorder, 
                  color: searchParams.get('bookingId') ? colors.accent : colors.textInput 
                }}
                className={`w-full p-4 rounded-xl border outline-none text-sm transition-all ${searchParams.get('bookingId') ? 'cursor-not-allowed font-bold' : ''}`}
                required
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold ml-1 tracking-wider" style={{ color: colors.textLabel }}>Rating (1-5)</label>
              <input 
                type="number" 
                min="1" max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textInput }}
                className="w-full p-4 rounded-xl border outline-none text-sm transition-all focus:border-slate-500"
                required
              />
            </div>

            {/* Comment */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] uppercase font-bold ml-1 tracking-wider" style={{ color: colors.textLabel }}>Your Comment</label>
              <textarea 
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your stay?"
                style={{ backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textInput }}
                className="w-full p-4 rounded-xl border outline-none text-sm transition-all resize-none"
                required
              />
            </div>

            {/* Actions (Buttons) */}
            <div className="md:col-span-2 pt-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  style={{ backgroundColor: colors.accent, color: "#ffffff" }}
                  className="flex-1 font-bold py-4 rounded-xl uppercase text-xs transition-all active:scale-95 shadow-lg"
                >
                  SUBMIT REVIEW
                </button>
                <button 
                  type="button" 
                  onClick={() => router.back()} 
                  style={{ borderColor: colors.inputBorder }}
                  className="px-8 border text-[10px] font-bold uppercase rounded-xl hover:bg-white/5 transition-all"
                >
                  Back
                </button>
              </div>

              {/* সাকসেস ও এরর মেসেজ টোস্ট */}
              {message && <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-center text-[10px] font-bold uppercase border border-emerald-500/20">✅ {message}</div>}
              {error && <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-center text-[10px] font-bold uppercase border border-red-500/20">❌ {error}</div>}
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function GiveReviewPage() {
  return (
    <Suspense fallback={<div className="h-screen text-white flex items-center justify-center" style={{ backgroundColor: "#18142e" }}>Loading...</div>}>
      <GiveReviewContent />
    </Suspense>
  );
}