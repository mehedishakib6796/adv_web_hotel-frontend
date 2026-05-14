// hotel-frontend/lib/usePusher.ts
import { useEffect } from 'react';
import Pusher from 'pusher-js';

export const usePusher = (channelName: string, eventName: string, onUpdate: (data: any) => void) => {
  useEffect(() => {
    // ১. Pusher কানেকশন তৈরি
    const pusher = new Pusher('f6ea48692172c968bea9', {
      cluster: 'ap2'
    });

    // ২. চ্যানেলে সাবস্ক্রাইব করা
    const channel = pusher.subscribe(channelName);

    // ৩. ইভেন্ট লিসেন করা
    channel.bind(eventName, (data: any) => {
      onUpdate(data);
    });

    // ৪. ক্লিনআপ (যাতে মেমোরি লিক বা ডুপ্লিকেট কানেকশন না হয়)
    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, onUpdate]);
};