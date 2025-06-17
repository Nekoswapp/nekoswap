"use client";
import React, { useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Footer } from "@/components/Footer";
import PoolList from "@/components/staking";
import pools from "@/Data/pools.json";
import { FaCoins, FaHistory, FaGift } from "react-icons/fa";
import Farms from "@/components/Farms";
import farms from "@/Data/farms.json"

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState<"pools" | "history" | "rewards">("pools");

  return (
    <div className="flex flex-col items-center mt-20">
      {/* Hero Heading */}
      <div className="max-w-6xl mx-auto text-center mb-20 px-4">
        <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          💎 Pools & Farms
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
          Earn rewards by staking your assets into Neko Pools.
        </p>
      </div>

      {/* Breadcrumb Tabs */}
      <Breadcrumbs
        classNames={{
          list: "bg-gradient-to-br from-rose-500 to-pink-500 shadow-small rounded-md px-4 py-2",
        }}
        itemClasses={{
          item: "text-white/60 data-[current=true]:text-white cursor-pointer",
          separator: "text-white/40",
        }}
        underline="hover"
        variant="solid"
        onAction={(key) => setActiveTab(key as "pools" | "history" )}
      >
        <BreadcrumbItem key="pools" isCurrent={activeTab === "pools"}>
          <div className="flex items-center gap-1">
            <FaCoins />
            Pools
          </div>
        </BreadcrumbItem>
        <BreadcrumbItem key="history" isCurrent={activeTab === "history"}>
          <div className="flex items-center gap-1">
            <FaHistory />
            Farms
          </div>
        </BreadcrumbItem>

      </Breadcrumbs>

      {/* Tab Content */}
      <div className="mt-10 w-full max-w-5xl px-4">
        {activeTab === "pools" && <PoolList pools={pools} />}
        {activeTab === "history" && (   <Farms farms={farms} />)}
  
      </div>

      <Footer />
    </div>
  );
}
