// src/components/UserStatsSection.tsx
"use client";
import React from "react";

import CountUp from "react-countup";

const stats = [
  {
    label: "Users in the last 30 days",
    value: 4_400_000,
    description:
      "Over 4 million users have actively used the platform this month.",
  },
  {
    label: "Trades in the last 30 days",
    value: 55_000_000,
    description: "Millions of transactions processed quickly and securely.",
  },
  {
    label: "Total Value Locked",
    value: 1.3,
    prefix: "$",
    suffix: "K",
    description:
      "Funds locked on NekoSwap show strong user trust and adoption.",
  },
];

export default function UserStatsSection() {
  return (
    <div className="w-full bg-orange-50 dark:bg-zinc-900">
      {" "}
      {/* Full lebar background */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Used by Millions. Trusted with Billions.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-12">
            NekoSwap has more users than any other decentralized platform. Join
            them and be part of the revolution.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 w-full max-w-sm text-left border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              >
                <div className="text-4xl font-extrabold text-pink-500 mb-2">
                  <CountUp
                    end={stat.value}
                    start={0}
                    duration={5000000}
                    delay={1}
                    separator=","
                    decimals={stat.suffix === "B" ? 1 : 0}
                    prefix={stat.prefix || ""}
                    suffix={stat.suffix || ""}
                  />
                </div>
                <div className="text-gray-900 dark:text-white font-semibold text-lg mb-1">
                  {stat.label}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-snug">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
