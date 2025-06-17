"use client";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Card, CardHeader, CardFooter } from "@heroui/card";
import { NumberInput } from "@heroui/number-input";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import routerABI from "@/Data/routerABI.json";
import { ERC20_ABI, TOKEN_LIST } from "@/Data/token";
import addresses from "@/Data/addresses.json";
import { useAccount } from "wagmi";
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import {  toast } from "react-toastify";
import { formatUnits, parseUnits } from "viem";
import { usePublicClient, useWalletClient } from 'wagmi'
import { readContract } from 'wagmi/actions'
import {config} from "../components/Web3Provider"



export default function SwapCard() {
  const [tokenA, setTokenA] = useState(TOKEN_LIST[0]);
  const [tokenB, setTokenB] = useState(TOKEN_LIST[1]);
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);
  const [balanceA, setBalanceA] = useState("0");
  const [balanceB, setBalanceB] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const publicClient = usePublicClient()
  const { address, isConnected } = useAccount();
const { data: walletClient } = useWalletClient()
  const isETH = (token: typeof tokenA) => token.isNative || token.address === ethers.ZeroAddress;

const loadBalances = async () => {
 if (!publicClient || !address) return;

  const getBal = async (token: typeof tokenA) => {
    if (isETH(token)) {
      const bal = await publicClient.getBalance({ address: address as `0x${string}` });
      return formatUnits(bal, token.decimals);
    } else {
     
      const bal = await readContract(config, {
  address: token.address as `0x${string}`,
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [address as `0x${string}`],
});

      return ethers.formatUnits(bal, token.decimals );

    }
  };

  try {
    setBalanceA(await getBal(tokenA));
    setBalanceB(await getBal(tokenB));
    console.log("TokenA:", tokenA);
console.log("TokenB:", tokenB);
  } catch (err) {
    console.error("Failed to load balances:", err);
    setBalanceA("0");
    setBalanceB("0");
  }
};

const getAmountsOut = async () => {
  if (!amountA || amountA <= 0 || !address) {
    setAmountB(0);
    return;
  }
  try {
    const amountIn = parseUnits(amountA.toString(), tokenA.decimals);
    const path = isETH(tokenA)
      ? [addresses.WETH, tokenB.address]
      : isETH(tokenB)
      ? [tokenA.address, addresses.WETH]
      : [tokenA.address, tokenB.address];
const result = await readContract(config, {
  address: addresses.Router as `0x${string}`,
  abi: routerABI,
  functionName: 'getAmountsOut',
  args: [amountIn, path as [`0x${string}`, ...`0x${string}`[]]],
});
  const amounts = result as bigint[];
  const amountOut = formatUnits(amounts[amounts.length - 1], tokenB.decimals);
  setAmountB(parseFloat(amountOut));
  } catch (err) {
    console.error("getAmountsOut error:", err);
    setAmountB(0);
  }
};


 // Fungsi approveIfNeeded berbasis wagmi
const approveIfNeeded = async (
  tokenAddress: `0x${string}`,
  amount: bigint,
  owner: `0x${string}`
) => {
  const allowance = await readContract(config, {
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [owner, addresses.Router as `0x${string}`],
  });

  if (allowance < amount) {
    const txHash = await writeContract(config, {
      address: tokenAddress,
      abi:ERC20_ABI,
      functionName: 'approve',
      args: [addresses.Router as `0x${string}`, amount],
      account: owner,
    });

    await waitForTransactionReceipt(config, {
      hash: txHash,
    });
  }
};
const handleSwap = async () => {
  if (!walletClient || !address || amountA <= 0) {
    return alert("Masukkan jumlah yang valid");
  }

  setIsLoading(true);

  try {
    const amountIn = parseUnits(amountA.toString(), tokenA.decimals);
    const amountOutMin = parseUnits(
      (amountB * (1 - (slippage || 0.5) / 100)).toFixed(tokenB.decimals),
      tokenB.decimals
    );
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const path = isETH(tokenA)
      ? [addresses.WETH, tokenB.address]
      : isETH(tokenB)
      ? [tokenA.address, addresses.WETH]
      : [tokenA.address, tokenB.address];

    // ✅ Approve jika tokenA bukan ETH
    if (!isETH(tokenA)) {
      await approveIfNeeded(tokenA.address as `0x${string}`, amountIn, address as `0x${string}`);
    }

    const functionName = isETH(tokenA)
      ? 'swapExactETHForTokens'
      : isETH(tokenB)
      ? 'swapExactTokensForETH'
      : 'swapExactTokensForTokens';

    const args =
      functionName === 'swapExactETHForTokens'
        ? [amountOutMin, path, address as `0x${string}`, BigInt(deadline)] // 4 argumen
        : [amountIn, amountOutMin, path, address as `0x${string}`, BigInt(deadline)]; // 5 argumen

    const txHash = await writeContract(config, {
      address: addresses.Router as `0x${string}`,
      abi: routerABI,
      functionName,
      args,
      value: isETH(tokenA) ? amountIn : undefined,
      account: walletClient.account,
    });

    await waitForTransactionReceipt(config, {
      hash: txHash,
    });

    toast.success("Swap Success!");
    await loadBalances();
    setAmountA(0);
    setAmountB(0);
  } catch (err) {
    console.error("Swap error:", err);
    toast.error("Swap failed!");
  } finally {
    setIsLoading(false);
  }
};


  const handleSelectToken = (isA: boolean, symbol: string) => {
    const selected = TOKEN_LIST.find((t) => t.symbol === symbol);
    if (!selected || selected.symbol === (isA ? tokenB.symbol : tokenA.symbol)) {
      toast.warning("Token is not a same !", {
        position: "bottom-center",
      });
      return;
    }
    if (isA) {
      setTokenA(selected);
      setAmountA(0);
    } else {
      setTokenB(selected);
    }
    setAmountB(0);
  };

  useEffect(() => {
    if (isConnected) loadBalances();
  }, [tokenA, tokenB, address, isConnected]);

  useEffect(() => {
    getAmountsOut();
  }, [amountA, tokenA, tokenB]);

  return (
    <div className="items-center flex flex-col justify-center">
      <Card className="max-w-[400px]   shadow-orange-500 shadow-lg p-5">
        <CardHeader className="flex justify-center items-center gap-2" />
        {/* From */}
        <div className="w-full mt-4">
          <p className="text-sm mb-1">From</p>
          <div className="flex gap-2 items-center">
            <Avatar src={tokenA.logo} size="sm" />
            <Select
              className="w-full"
              selectedKeys={[tokenA.symbol]}
              onSelectionChange={(keys) => handleSelectToken(true, String(Array.from(keys)[0]))}
            >
              {TOKEN_LIST.map((token) => (
                <SelectItem key={token.symbol} isDisabled={token.symbol === tokenB.symbol}>
                  {token.symbol}
                </SelectItem>
              ))}
            </Select>
          </div>
          <NumberInput
            className="w-full mt-2"
            value={amountA}
            onValueChange={(val) => {
              if (typeof val === "string") setAmountA(parseFloat(val) || 0);
              else if (typeof val === "number") setAmountA(val);
            }}
            
            placeholder="0.0"
          />
          <p className="text-xs text-gray-600 mt-1">Balance: {balanceA}</p>
        </div>

        <Divider className="my-4" />

        {/* To */}
        <div className="w-full">
          <p className="text-sm mb-1">To (estimated)</p>
          <div className="flex gap-2 items-center">
            <Avatar src={tokenB.logo} size="sm" />
            <Select
              className="w-full"
              selectedKeys={[tokenB.symbol]}
              onSelectionChange={(keys) => handleSelectToken(false, String(Array.from(keys)[0]))}
            >
              {TOKEN_LIST.map((token) => (
                <SelectItem key={token.symbol} isDisabled={token.symbol === tokenA.symbol}>
                  {token.symbol}
                </SelectItem>
              ))}
            </Select>
          </div>
          <NumberInput
            className="w-full mt-2"
            value={amountB}
            isReadOnly
            placeholder="0.0"
          />
          <p className="text-xs text-gray-600 mt-1">Balance: {balanceB}</p>
        </div>

        <Divider className="my-4" />

        {/* Slippage */}
        <div className="w-full">
          <p className="text-sm mb-1">Slippage Tolerance (%)</p>
          <NumberInput
            className="w-full"
            value={slippage}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(val) => {
              if (typeof val === "string") setAmountA(parseFloat(val) || 0);
              else if (typeof val === "number") setAmountA(val);
            }}
            
          />
        </div>

        <CardFooter className="mt-4">
          <Button
            isLoading={isLoading}
            disabled={isLoading || amountA <= 0 || tokenA.symbol === tokenB.symbol}
            onClick={handleSwap}
            className="w-full bg-orange-500 text-white hover:bg-orange-600"
          >
            Swap
          </Button>
        </CardFooter>
      </Card>

      <div className="flex-1 flex justify-center mt-4">
        <img
          src="/images/pohon.png"
          alt="Nekoswap Tokenomics Illustration"
          className="max-w-sm w-24"
          loading="lazy"
        />
      </div>
    </div>
  );
}
