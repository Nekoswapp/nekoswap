"use client";

import React from "react";
import SlotGame from "@/components/Game";
import { Footer } from "@/components/Footer";
import Nft from "@/components/Nft";
export default function DocsPage() {
  return (
    <div>
      <main>
        <h1 className="text-4xl md:text-6xl mb-10 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-lg animate-pulse text-center">
  NEKO NFT
</h1>
     <Nft/>
      <Footer/>
    </main>
    </div>
  );
}
