"use client";
import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// মূল ফর্ম কম্পোনেন্টটি আলাদা করা হয়েছে যাতে useSearchParams ঠিকমতো কাজ করে
const GiveReviewForm = () => {
  const [customerName, setCustomerName] = useState("");
  const [bookingId, setBookingId] = useState(""); 
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // ১. My Bookings পেজ থেকে পাঠানো bookingId ইউআরএল থেকে রিসিভ করা
    const idFromUrl = searchParams.get('bookingId');
    if (idFromUrl) {
      setBookingId(idFromUrl);
    }

    const name = localStorage.getItem('user_name');
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/login');
    } else if (name) {
      setCustomerName(name);
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const token = localStorage.getItem('access_token');

    try {
      const reviewData = {
        customerName: customerName,
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
        setTimeout(() => router.push('/rooms'), 2000);
      }
    } catch (err: any) {
      const backendError = err.response?.data?.message;
      setError(Array.isArray(backendError) ? backendError[0] : backendError || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#111] p-10 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">
            Guest <span className="text-yellow-500">Feedback</span>
          </h2>
          <p className="text-[8px] text-gray-500 uppercase tracking-[0.4em]">Connected via Booking ID</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Customer Name</label>
            <input 
              type="text" 
              value={customerName}
              readOnly
              className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl text-gray-400 text-sm outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Booking ID</label>
            <input 
              type="number" 
              placeholder="Booking ID (e.g. 5)"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              // যদি URL থেকে আইডি আসে তবে এটি এডিট করা যাবে না
              readOnly={!!searchParams.get('bookingId')}
              className={`w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none transition text-sm ${searchParams.get('bookingId') ? 'text-yellow-500 cursor-not-allowed' : 'focus:border-yellow-500'}`}
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Rating (1-5)</label>
            <input 
              type="number" 
              min="1" max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-yellow-500 outline-none transition text-sm"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1 block">Your Comment</label>
            <textarea 
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your stay?"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-yellow-500 outline-none transition text-sm resize-none"
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-white hover:bg-yellow-500 text-black font-black py-4 rounded-2xl uppercase tracking-widest transition-all active:scale-95 mt-4 shadow-xl shadow-black/50"
          >
            {loading ? "SENDING..." : "SUBMIT REVIEW"}
          </button>

          {message && <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 text-yellow-500 text-center text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20">{message}</div>}
          {error && <div className="mt-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-center text-[10px] font-bold uppercase tracking-widest border border-red-500/20">{error}</div>}
        </form>
      </div>
    </main>
  );
};

// মেইন পেজ কম্পোনেন্ট যা Suspense দিয়ে মোড়ানো
const GiveReviewPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading form...</div>}>
        <GiveReviewForm />
      </Suspense>
      <Footer />
    </div>
  );
};

export default GiveReviewPage;