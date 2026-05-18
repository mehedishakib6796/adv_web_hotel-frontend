// hotel-frontend/lib/usePusher.ts
import { useEffect } from 'react';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

export const usePusherBeams = (interestName: string) => {
  useEffect(() => {
    // ১. Pusher Beams ক্লায়েন্ট ইনিশিয়ালাইজ করা
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: '14a93161-ec71-4fc7-8525-b8deae1f33be', // 🌟 এখানে আপনার Pusher ড্যাশবোর্ডের Instance ID বসবে
    });

    // ২. নোটিফিকেশন পারমিশন চাওয়া এবং ইন্টারেস্টে সাবস্ক্রাইব করা
    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest(interestName))
      .then(() => {
        console.log(`Successfully subscribed to Beams interest: ${interestName}`);
      })
      .catch((error) => {
        console.error('Error starting Pusher Beams client:', error);
      });

    // ৩. ক্লিনআপ ফাংশন (যাতে কম্পোনেন্ট আনমাউন্ট হলে ডুপ্লিকেট লিসেনার তৈরি না হয়)
    return () => {
      beamsClient.getDeviceInterests()
        .then((interests) => {
          if (interests.includes(interestName)) {
            return beamsClient.removeDeviceInterest(interestName);
          }
        })
        .then(() => console.log(`Unsubscribed from interest: ${interestName}`))
        .catch(console.error);
    };
  }, [interestName]);
};