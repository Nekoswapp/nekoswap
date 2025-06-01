"use client";
import React from "react";

const launchpadTokens = [
 
  {
    name: "ZerogicNFT",
    symbol: "ZFT",
    logo: "/images/Zerogic.png",
    launchDate: "Nov 10, 2025",
    description:
      "ZFT is a community-driven token with a focus on NFTs and DeFi innovations.",
    features: [
      "NFT marketplace integration",
      "Yield farming",
      "Cross-chain compatibility",
    ],
    listingUrl: "/launchpad/mew-coin",
  },
];

const LaunchpadSection = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          🚀 Nekoswap Launchpad
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover and support the newest tokens launching on Nekoswap. Join the
          community early and be part of the next big projects!
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {launchpadTokens.map(
          ({ name, symbol, logo, launchDate, description, features, listingUrl }, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              <div className="flex items-center gap-4 p-6">
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="w-16 h-16 rounded-full border-4 border-pink-500 shadow"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {name}{" "}
                    <span className="text-pink-500 font-bold">({symbol})</span>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Launching: <span className="font-medium">{launchDate}</span>
                  </p>
                </div>
              </div>

              <div className="px-6 pb-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                  {description}
                </p>

                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 mb-4">
                  {features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>

                <a
                  href={listingUrl}
                  className="block text-center bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl px-6 py-3 transition duration-200"
                >
                  🔍 View Details & Apply
                </a>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default LaunchpadSection;
