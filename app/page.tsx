"use client";
import HeroSection from "@/components/HeroSection";
import UserStatsSection from "@/components/UserStatsSections";


import TokenBurnSection from "@/components/BurnSection";
import React from "react";
import { EarnPassiveIncomeSection } from "@/components/Deskripsi";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center">
        <HeroSection />
        <UserStatsSection />
      <EarnPassiveIncomeSection/>
      <TokenBurnSection/>
      <Footer/>
      </div>
    </section>
  );
}
