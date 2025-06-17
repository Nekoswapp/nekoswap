"use client";

import { useEffect } from "react";
import React from "react";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
   
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center m-5">
         <img
          src="/images/swap-i.png" // ganti dengan path gambarmu
          alt="Nekoswap NFT Floating"
          className="w-full h-auto rounded-3xl animate-floating"
          style={{ filter: 'drop-shadow(0 0 15px #d92777)' }}
        />
        
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
