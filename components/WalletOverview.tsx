"use client";
import { FaWallet } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import tokens from "@/Data/walletToken.json";
import {
  useAccount,
  usePublicClient,
} from "wagmi";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export const WalletOverview = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [balances, setBalances] = useState<Record<string, string>>({});
  const [activityData, setActivityData] = useState<{ name: string; volume: number }[]>([]);

  // Konversi viem provider ke ethers provider
  const provider = publicClient
    ? new ethers.JsonRpcProvider(publicClient.transport.url)
    : undefined;

  useEffect(() => {
    const loadWalletData = async () => {
      if (!isConnected || !address || !provider) return;

      const result: Record<string, string> = {};

      for (const token of tokens) {
        try {
          if (token.address === "0x0000000000000000000000000000000000000000") {
            const balance = await provider.getBalance(address);
            result[token.symbol] = ethers.formatUnits(balance, token.decimals);
          } else {
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const rawBalance = await contract.balanceOf(address);
            result[token.symbol] = ethers.formatUnits(rawBalance, token.decimals);
          }
        } catch {
          result[token.symbol] = "0";
        }
      }

      setBalances(result);
    };

    const pollActivity = async () => {
      if (!address || !provider) return;

      const balance = await provider.getBalance(address);
      const ethVolume = parseFloat(ethers.formatEther(balance));

      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

      setActivityData((prev) => {
        const newData = [...prev, { name: time, volume: ethVolume }];
        return newData.slice(-10);
      });
    };

    loadWalletData();
    pollActivity();

    const interval = setInterval(pollActivity, 15000);
    return () => clearInterval(interval);
  }, [address, isConnected, provider]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white border-b-2 border-indigo-500 pb-2">
        Wallet Overview
      </h2>
      <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <FaWallet className="text-indigo-500 dark:text-indigo-400" />
        {address ? (
          <span className="font-mono bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded-md select-all cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        ) : (
          <span className="italic text-red-500">Not connected</span>
        )}
      </p>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">POL Activity</h4>
 
      </div>

      {/* Token list */}
      <div className="flex flex-col space-y-3 mb-6 mt-4">
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
          >
            <div className="flex items-center space-x-3">
              <Image src={token.logo} alt={token.symbol} width={28} height={28} />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{token.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{token.symbol}</div>
              </div>
            </div>
            <div className="text-xs ml-9 font-semibold text-gray-900 dark:text-white">
              {balances[token.symbol]
                ? new Intl.NumberFormat("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(balances[token.symbol]))
                : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
