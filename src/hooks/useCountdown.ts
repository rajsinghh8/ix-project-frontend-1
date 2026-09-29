import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function computeParts(targetDate: string): CountdownParts {
  const diffMs = new Date(targetDate).getTime() - Date.now();
  const isPast = diffMs <= 0;
  const absoluteMs = Math.abs(diffMs);

  const days = Math.floor(absoluteMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absoluteMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((absoluteMs / (1000 * 60)) % 60);
  const seconds = Math.floor((absoluteMs / 1000) % 60);

  return { days, hours, minutes, seconds, isPast };
}

export function useCountdown(targetDate: string): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => computeParts(targetDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setParts(computeParts(targetDate));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);

  return parts;
}
