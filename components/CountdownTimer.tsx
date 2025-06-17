// src/components/CountdownTimer.tsx
import React from 'react';
import { useCountdown } from '../config/timePool';

export default function CountdownTimer() {
  const targetTime = "2025-06-03T12:00:00"; // <- Di sinilah kamu pasang waktunya
  const { days, hours, minutes, seconds, expired } = useCountdown(targetTime);

  return (
    <div className="text-center text-xl font-bold">
      {expired ? (
        <p>Waktu telah habis!</p>
      ) : (
        <p>
          {days} Hari {hours} Jam {minutes} Menit {seconds} Detik
        </p>
      )}
    </div>
  );
}
