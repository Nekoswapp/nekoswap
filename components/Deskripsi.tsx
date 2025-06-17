"use client";

import { motion } from "framer-motion";

export function EarnPassiveIncomeSection() {
  return (
    <section className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white py-20 px-8 md:px-24 flex flex-col md:flex-row items-center gap-16 max-w-7xl mx-auto rounded-xl shadow-2xl border border-gray-700">
      {/* Text content */}
      <div className="flex-1 max-w-xl space-y-8">
        <h2 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
          Earn Passive Income
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          With <span className="font-semibold text-pink-400">Nekoswap NFTs</span> and the <span className="font-semibold text-purple-400">NEKO token</span>, you can unlock multiple opportunities to earn passive income.
          Participate in staking, exclusive private token sales, and many other features currently being developed in the Nekoswap ecosystem.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed">
          Stake your tokens to receive rewards regularly, and use your NFTs as exclusive access to premium events and features.
        </p>
        <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-pink-600 hover:via-red-500 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          Learn More
        </button>
      </div>

      {/* Floating image pakai motion */}
      <motion.div
        className="flex-1 max-w-sm relative"
        animate={{ y: [0, -24, 0] }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.img
          src="/images/cat2.png"
          alt="Nekoswap NFT Floating"
          className=" w-96  h-auto rounded-lg"
          whileHover={{
            scale: 1.05,
            rotate: 5,
            y: -30,
            boxShadow: "0px 15px 25px rgba(255, 105, 180, 0.7)",
            transition: { duration: 0.4 },
          }}
          style={{ cursor: "grab" }}
        />
      </motion.div>
    </section>
  );
}
