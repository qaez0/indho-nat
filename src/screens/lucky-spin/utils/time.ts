import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

export const useCountdownFormattedHours = (endTimeISO: string): string => {
  const [formattedTime, setFormattedTime] = useState('00:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const end = moment.utc(endTimeISO).subtract(8, 'hours').tz('Asia/Manila');
      const now = moment().tz('Asia/Manila');

      const msLeft = end.valueOf() - now.valueOf();

      if (msLeft <= 0) {
        setFormattedTime('00:00:00');
        return;
      }

      const totalSeconds = Math.floor(msLeft / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const pad = (n: number) => String(n).padStart(2, '0');
      setFormattedTime(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [endTimeISO]);

  return formattedTime;
};
