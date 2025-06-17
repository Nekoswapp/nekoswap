"use client";
import React from "react";
import { Footer } from "@/components/Footer";
import QuizGame from "@/components/Game";

export default function DocsPage() {
  return (
    <div>
      <main>
    <QuizGame/>
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
