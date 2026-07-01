
import { useEffect } from 'react';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

export const usePusherBeams = (interestName: string) => {
  useEffect(() => {
   
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: '14a93161-ec71-4fc7-8525-b8deae1f33be', 
    });

   
    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest(interestName))
      .then(() => {
        console.log(`Successfully subscribed to Beams interest: ${interestName}`);
      })
      .catch((error) => {
        console.error('Error starting Pusher Beams client:', error);
      });

  
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