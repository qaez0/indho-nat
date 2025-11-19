import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

export const formatTime = (ms: number) => {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0',
  );
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours} : ${minutes} : ${seconds}`;
};

export const getMillisecondsUntilTenSecondsAfter = (
  inputDate: Date | string,
): number => {
  const date = inputDate instanceof Date ? inputDate : new Date(inputDate);
  const targetTime = new Date(date.getTime() + 10000);
  const now = new Date();
  return Math.max(targetTime.getTime() - now.getTime(), 0);
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date
    .toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    .toUpperCase();
};

export const formatTimeStamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const useCountdownFormattedHours = (endTimeISO: string): string => {
  const [formattedTime, setFormattedTime] = useState('00:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      // Always treat input as IST
      const end = moment.tz(endTimeISO, 'Asia/Kolkata').valueOf();
      const now = moment().tz('Asia/Kolkata').valueOf();

      const msLeft = end - now;

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
