"use client";
import React from "react";
import CountUp from "react-countup";

const TokenBurnSection = () => {
  const totalSupply = 1_000_000_000;
  const burnedTokens = 320_000_000;
  const burnedPercent = Math.floor((burnedTokens / totalSupply) * 100);

  return (
    <section className="bg-gradient-to-r from-black to-from-black text-white py-20 px-6 sm:px-12 lg:px-24 mt-1">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4">Nekoswap Token Burn</h2>
        <p className="text-lg font-light mb-12 max-w-3xl mx-auto">
          Nekoswap regularly burns tokens to reduce supply, creating scarcity and increasing
          token value for holders.
        </p>

        <div className="max-w-3xl mx-auto mb-10">
          {/* Progress Bar */}
          <div className="relative h-6 rounded-full bg-orange-300 dark:bg-orange-800 overflow-hidden shadow">
            <div
              className="absolute top-0 left-0 h-6 bg-white rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: `${burnedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2 font-semibold px-2">
            <span>
              <CountUp start={0} end={burnedPercent} duration={200000} suffix="%" />
              {" "}Burned
            </span>
            <span>
              <CountUp
                start={0}
                end={burnedTokens}
                duration={200000}
                separator=","
                decimals={0}
              />{" "}
              Tokens
            </span>
          </div>
        </div>

        {/* Statistik utama yang responsif */}
        <div className="flex flex-wrap justify-center gap-16 font-mono text-xl font-semibold px-4 sm:px-0">
          <div className="min-w-[150px] flex-1 max-w-xs">
            <p className="uppercase text-orange-200 text-sm tracking-widest mb-1">Total Supply</p>
            <p>{totalSupply.toLocaleString()}</p>
          </div>
          <div className="min-w-[150px] flex-1 max-w-xs">
            <p className="uppercase text-orange-200 text-sm tracking-widest mb-1">Burned Tokens</p>
            <p>
              <CountUp
                start={0}
                end={burnedTokens}
                duration={20000000}
                separator=","
                decimals={0}
              />
            </p>
          </div>
          <div className="min-w-[150px] flex-1 max-w-xs">
            <p className="uppercase text-orange-200 text-sm tracking-widest mb-1">Burned %</p>
            <p>
              <CountUp start={0} end={burnedPercent} duration={2000000000} suffix="%" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenBurnSection;
