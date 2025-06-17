"use client";

import React from "react";
import SlotGame from "@/components/Game";
import { Footer } from "@/components/Footer";
export default function DocsPage() {
  return (
    <div>
      <main>
     
      <div className="flex-1 my-6 flex justify-center">
        <img
          src="/images/quis.png"
          alt="Nekoswap Tokenomics Illustration"
          className="max-w-sm w-48"
          loading="lazy"
        />
      </div>

      <Footer/>
    </main>
    </div>
  );
}
