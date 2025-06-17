import { useEffect, useState } from "react";
import { usePublicClient, useChainId } from "wagmi";
import { ethers } from "ethers";
import uniswapV2PairAbi from "@/Data/pairABI.json";
import { ERC20_ABI } from "@/Data/token";

type UseTokenPriceProps = {
  pairAddress: `0x${string}`;
  token0Address: `0x${string}`;
  token1Address: `0x${string}`;
};

export function useTokenPrice({ pairAddress, token0Address, token1Address }: UseTokenPriceProps) {
  const [price, setPrice] = useState<string>("Loading...");
  const publicClient = usePublicClient();
  const chainId = useChainId();

  useEffect(() => {
    const fetchPrice = async () => {
      if (!publicClient) return;

      try {
        // Ambil URL RPC dari publicClient (viem) atau fallback
        const rpcUrl = (publicClient.transport as any).url || getFallbackRpc(chainId);
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        const pairContract = new ethers.Contract(pairAddress, uniswapV2PairAbi, provider);
        const [reserves, actualToken0] = await Promise.all([
          pairContract.getReserves(),
          pairContract.token0(),
        ]);

        const token0IsCorrect = actualToken0.toLowerCase() === token0Address.toLowerCase();
        const reserve0Raw = token0IsCorrect ? reserves[0] : reserves[1];
        const reserve1Raw = token0IsCorrect ? reserves[1] : reserves[0];

        const token0Contract = new ethers.Contract(token0Address, ERC20_ABI, provider);
        const token1Contract = new ethers.Contract(token1Address, ERC20_ABI, provider);
        const [decimals0, decimals1] = await Promise.all([
          token0Contract.decimals(),
          token1Contract.decimals(),
        ]);

        const reserve0 = Number(ethers.formatUnits(reserve0Raw, decimals0));
        const reserve1 = Number(ethers.formatUnits(reserve1Raw, decimals1));

        const tokenPrice =  reserve0 / reserve1 ;
        setPrice(tokenPrice.toFixed(0));
      } catch (error) {
        console.error("Error fetching token price:", error);
        setPrice("Error");
      }
    };

    fetchPrice();
  }, [pairAddress, token0Address, token1Address, publicClient, chainId]);

  return price;
}

function getFallbackRpc(chainId: number): string {
  const map: Record<number, string> = {
    1: "https://eth.llamarpc.com",         // Ethereum
    56: "https://bsc-dataseed.binance.org", // BSC
    137: "https://polygon-rpc.com",        // Polygon
  };
  return map[chainId] || "https://eth.llamarpc.com";
}
