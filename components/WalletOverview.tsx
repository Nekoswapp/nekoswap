"use client";
import { FaWallet } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import tokens from "@/Data/walletToken.json";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
];

export const WalletOverview = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [balances, setBalances] = useState<Record<string, string>>({});

  const formatBalanceShort = (value: number): string => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toFixed(2);
  };

  useEffect(() => {
    if (!isConnected || !address || !publicClient) return;

    const loadWalletData = async () => {
      const result: Record<string, string> = {};

      for (const token of tokens) {
        try {
          if (token.address === "0x0000000000000000000000000000000000000000") {
            const balance = await publicClient.getBalance({ address });
            result[token.symbol] = formatUnits(balance, token.decimals);
          } else {
            const rawBalance = await publicClient.readContract({
              address: token.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: "balanceOf",
              args: [address as `0x${string}`],
            });
            result[token.symbol] = formatUnits(rawBalance as bigint, token.decimals);
          }
        } catch {
          result[token.symbol] = "0";
        }
      }

      setBalances(result);
    };

    loadWalletData();
  }, [address, isConnected, publicClient]);

  const sortedTokens = useMemo(() => {
    if (!balances) return tokens;
    return [...tokens].sort((a, b) => {
      const balA = Number(balances[a.symbol]) || 0;
      const balB = Number(balances[b.symbol]) || 0;
      return balB - balA;
    });
  }, [balances]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-100 via-white to-orange-50 dark:from-gray-900 dark:via-black dark:to-gray-800 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 tracking-wide uppercase mb-6">
          <span className="inline-flex items-center gap-2">Neko Wallet</span>
        </h2>

        <p className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
          <FaWallet className="text-orange-500 dark:text-orange-400 text-lg" />
          {address ? (
            <span className="font-mono bg-orange-200 dark:bg-orange-900 text-gray-800 dark:text-white px-3 py-1 rounded-md select-all cursor-pointer hover:bg-orange-300 dark:hover:bg-orange-800 transition-colors duration-300">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          ) : (
            <span className="italic text-red-500">Not connected</span>
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedTokens.map((token) => (
            <div
              key={token.symbol}
              className="flex justify-between items-center p-4 bg-white/80 dark:bg-white/10 backdrop-blur rounded-xl shadow hover:shadow-xl transition border border-orange-200 dark:border-orange-800"
            >
              <div className="flex items-center gap-2">
                <Image src={token.logo} alt={token.symbol} width={32} height={32} className="rounded-full" />
                <div className="mr-12 ">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">{token.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{token.symbol}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-gray-800 dark:text-white">
                {balances[token.symbol] ? formatBalanceShort(Number(balances[token.symbol])) : "0.00"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
