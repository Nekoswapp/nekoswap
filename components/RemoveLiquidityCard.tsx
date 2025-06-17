"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ethers, ZeroAddress } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { ERC20_ABI, TOKEN_LIST } from "@/Data/token";
import routerABI from "@/Data/routerABI.json";
import lpTokenABI from "@/Data/pairABI.json";
import { BrowserProvider } from "ethers";
import type { Eip1193Provider } from "ethers";
import { toast } from "react-toastify";

const ROUTER_ADDRESS = "0xCf406235c78dc620B19bF772bAA9CFF468D0fEb9";

export default function RemoveLiquidityCard() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [tokenA, setTokenA] = useState(TOKEN_LIST[0]);
  const [tokenB, setTokenB] = useState(TOKEN_LIST[1]);
  const [lpTokenAddress, setLpTokenAddress] = useState("");
  const [liquidity, setLiquidity] = useState("");
  const [balanceLP, setBalanceLP] = useState("0");
  const [lpDecimals, setLpDecimals] = useState(18);
  const [removing, setRemoving] = useState(false);

  const getSigner = useCallback(async () => {
    if (!walletClient) throw new Error("Wallet client not found");
    const provider = new BrowserProvider(walletClient.transport as Eip1193Provider);
    return provider.getSigner();
  }, [walletClient]);

 
  async function getPairAddress(
    router: ethers.Contract,
    tokenA: string,
    tokenB: string,
    provider: ethers.Provider
  ) {
    const factoryAddress = await router.factory();
    const factoryABI = ["function getPair(address,address) view returns (address)"];
    const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
    return await factory.getPair(tokenA, tokenB);
  }

  async function loadLPBalance() {
    if (!isConnected || !walletClient || !address) return;

    const provider = new BrowserProvider(walletClient.transport as Eip1193Provider);
    const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, provider);
    const pairAddress = await getPairAddress(router, tokenA.address, tokenB.address, provider);

    if (!pairAddress || pairAddress === ZeroAddress) {
      setLpTokenAddress("");
      setBalanceLP("0");
      return;
    }

    setLpTokenAddress(pairAddress);
    const lp = new ethers.Contract(pairAddress, lpTokenABI, provider);
    const balance = await lp.balanceOf(address);
    const decimals = (await lp.decimals()) ?? 18;

    setLpDecimals(decimals);
    setBalanceLP(ethers.formatUnits(balance, decimals));
  }

  async function approveIfNeeded(spender: string, token: string, amount: bigint) {
    try {
      const signer = await getSigner();
      const tokenContract = new ethers.Contract(token, ERC20_ABI, signer);
      const owner = await signer.getAddress();
      const allowance = await tokenContract.allowance(owner, spender);

      if (allowance < amount) {
        toast.info("Approving token...", { position: "bottom-left" });
        const tx = await tokenContract.approve(spender, ethers.MaxUint256);
        await tx.wait();
        toast.success("Approve success!", { position: "bottom-left" });
      }
    } catch (err: any) {
      console.error("Approve failed", err);
      toast.error("Approve failed:");
      throw err;
    }
  }

  async function getDeadline(): Promise<number> {
    if (!walletClient) {
      toast.error("Wallet belum terhubung.");
      throw new Error("Wallet not connected");
    }

    const provider = new BrowserProvider(walletClient.transport as Eip1193Provider);
    const block = await provider.getBlock("latest");
    return (block?.timestamp ?? Math.floor(Date.now() / 1000)) + 3600;
  }

  async function removeLiquidity() {
    if (!isConnected || !walletClient || !address) {
      toast.error("Wallet not connected", { position: "top-left" });
      return;
    }

    if (!liquidity || isNaN(Number(liquidity)) || Number(liquidity) <= 0) {
      toast.error("Amount invalid", { position: "top-center" });
      return;
    }

    if (!lpTokenAddress || lpTokenAddress === ZeroAddress) {
      toast.error("LP Token not found", { position: "top-center" });
      return;
    }

    setRemoving(true);
    try {
      const signer = await getSigner();
      const amountLP = ethers.parseUnits(liquidity, lpDecimals);
      await approveIfNeeded(ROUTER_ADDRESS, lpTokenAddress, amountLP);

      const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, signer);
      const deadline = await getDeadline();

      toast.info("Removing liquidity...", { position: "bottom-left" });

      const tx = await router.removeLiquidity(
        tokenA.address,
        tokenB.address,
        amountLP,
        0,
        0,
        address,
        deadline
      );

      await tx.wait();
      toast.success("Remove liquidity success!", { position: "bottom-left" });
      setLiquidity("");
      await loadLPBalance();
    } catch (err) {
      console.error("Remove liquidity failed:", err);
      toast.error("Remove failed: ");
    }
    setRemoving(false);
  }

  useEffect(() => {
    if (isConnected && walletClient) {
      loadLPBalance();
    }
  }, [isConnected, tokenA, tokenB, address, walletClient]);

  return (
    <div className="items-center flex flex-col justify-center mt-0">
      <Card className="max-w-[400px] shadow-lg shadow-green-500 justify-center items-center p-5">
        <CardHeader className="flex justify-center items-center gap-2">
          <h3 className="text-xl font-bold">Remove Liquidity</h3>
        </CardHeader>

        {!isConnected ? (
          <p className="text-center text-red-500 mt-4">Wallet belum terhubung.</p>
        ) : (
          <>
            {[{ label: "Token A", token: tokenA, setter: setTokenA, exclude: tokenB.symbol },
              { label: "Token B", token: tokenB, setter: setTokenB, exclude: tokenA.symbol }
            ].map(({ label, token, setter, exclude }) => (
              <div className="w-full mt-4" key={label}>
                <p className="text-sm mb-1">{label}</p>
                <div className="flex gap-2 items-center">
                  <Avatar src={token.logo} size="sm" />
                  <Select
                    className="w-full"
                    selectedKeys={[token.symbol]}
                    onSelectionChange={(keys) => {
                      const selected = TOKEN_LIST.find(t =>
                        t.symbol === (typeof keys === "string" ? keys : Array.from(keys)[0])
                      );
                      if (selected && selected.symbol !== exclude) setter(selected);
                    }}
                  >
                    {TOKEN_LIST.map((t) => (
                      <SelectItem key={t.symbol} isDisabled={t.symbol === exclude}>
                        {t.symbol}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            ))}

            <Divider className="my-4" />

            <div className="w-full">
              <p className="text-sm mb-1">LP Amount</p>
              <Input
                aria-label="LP Amount"
                type="text"
                value={liquidity}
                onChange={(e) => setLiquidity(e.target.value)}
                placeholder="0.0"
                className="w-full"
              />
              <p className="text-xs text-right text-default-500 mt-1">
                LP Balance: {balanceLP}
              </p>
            </div>

            <CardFooter className="mt-6 w-full">
              <Button
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
                onClick={removeLiquidity}
                disabled={removing}
              >
                {removing ? "Removing..." : "Remove Liquidity"}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      <div className="flex-1 flex justify-center">
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
