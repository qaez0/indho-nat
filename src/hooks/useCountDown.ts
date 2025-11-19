import { useState, useRef, useCallback, useEffect } from 'react';

export const useCountdown = (initialSeconds: number) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = useCallback(() => {
    console.log('Starting countdown with initial seconds:', initialSeconds);
    clearTimer();
    setSecondsLeft(initialSeconds);
    setIsRunning(true);

    // RN's setInterval returns a number
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  }, [initialSeconds]);

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, []);

  return { secondsLeft, isRunning, start, stop, reset };
};
