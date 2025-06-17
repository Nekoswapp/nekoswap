"use client";
import React, { useEffect, useState } from "react";
import { ethers, ZeroAddress } from "ethers";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { ERC20_ABI, TOKEN_LIST } from "@/Data/token";
import routerABI from "@/Data/routerABI.json";
import lpTokenABI from "@/Data/pairABI.json";
import {  toast } from "react-toastify";
const ROUTER_ADDRESS = "0xCf406235c78dc620B19bF772bAA9CFF468D0fEb9";

export default function RemoveLiquidityCard() {
  const { address, isConnected } = useAccount();

  const [tokenA, setTokenA] = useState(TOKEN_LIST[0]);
  const [tokenB, setTokenB] = useState(TOKEN_LIST[1]);
  const [lpTokenAddress, setLpTokenAddress] = useState<string>("");
  const [liquidity, setLiquidity] = useState<string>("");
  const [balanceLP, setBalanceLP] = useState<string>("0");
  const [lpDecimals, setLpDecimals] = useState<number>(18);
  const [removing, setRemoving] = useState(false);

  // Dapatkan provider dan signer dari window.ethereum
  async function getProviderAndSigner() {
    if (!window.ethereum) throw new Error("Wallet not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  }

  // Dapatkan alamat pair LP token dari factory lewat router
  async function getPairAddress(
    router: ethers.Contract,
    tokenA: string,
    tokenB: string,
    provider: ethers.BrowserProvider
  ): Promise<string> {
    try {
      const factoryAddress: string = await router.factory();
      const factoryABI = [
        "function getPair(address,address) external view returns (address)",
      ];
      const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
      return await factory.getPair(tokenA, tokenB);
    } catch {
      return ZeroAddress;
    }
  }

  // Load saldo LP token user
  async function loadLPBalance() {
    if (!isConnected || !address) {
      setLpTokenAddress("");
      setBalanceLP("0");
      return;
    }

    try {
      const { provider, signer } = await getProviderAndSigner();

      const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, provider);
      const pairAddress = await getPairAddress(router, tokenA.address, tokenB.address, provider);

      if (!pairAddress || pairAddress === ZeroAddress) {
        setLpTokenAddress("");
        setBalanceLP("0");
        return;
      }

      setLpTokenAddress(pairAddress);

      const pair = new ethers.Contract(pairAddress, lpTokenABI, provider);
      const balance = await pair.balanceOf(address);
      const decimals = await pair.decimals();

      setLpDecimals(decimals);
      setBalanceLP(ethers.formatUnits(balance, decimals));
    } catch (error) {
      console.error("Load LP balance error:", error);
      setBalanceLP("0");
      setLpTokenAddress("");
    }
  }

  // Cek dan approve router untuk menggunakan LP token jika belum cukup allowance
  async function approveIfNeeded(
    signer: ethers.Signer,
    spender: string,
    token: string,
    amount: bigint
  ) {
    const contract = new ethers.Contract(token, ERC20_ABI, signer);
    const owner = await signer.getAddress();
    const allowance = await contract.allowance(owner, spender);
    if (allowance < amount) {
      const tx = await contract.approve(spender, ethers.MaxUint256);
      await tx.wait();
    }
  }

  // Ambil timestamp block terbaru sebagai deadline transaksi
  async function getBlockchainTimestamp(provider: ethers.Provider): Promise<number> {
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    if (!block) throw new Error("Block not found");
    return block.timestamp;
  }

  // Fungsi untuk remove liquidity
  async function removeLiquidity() {
    if (!isConnected || !address) {
      toast.warning("Wallet not connected", {
        position: "top-left",
      });
      return;
    }

    if (!/^(\d+\.?\d*|\.\d+)$/.test(liquidity)) {
      toast.error("Amount not valid", {
        position: "top-center",
      });
      
      return;
    }

    if (!lpTokenAddress || lpTokenAddress === ZeroAddress) {
      toast.error("Amount not valid", {
        position: "top-center",
      });
      return;
    }

    setRemoving(true);

    try {
      const { provider, signer } = await getProviderAndSigner();
      const router = new ethers.Contract(ROUTER_ADDRESS, routerABI, signer);

      const deadline = (await getBlockchainTimestamp(provider)) + 3600; // 1 jam ke depan
      const amountLP = ethers.parseUnits(liquidity, lpDecimals);

      await approveIfNeeded(signer, ROUTER_ADDRESS, lpTokenAddress, amountLP);

      const tx = await router.removeLiquidity(
        tokenA.address,
        tokenB.address,
        amountLP,
        0, // minimal amount token A yang diterima (slippage protection)
        0, // minimal amount token B yang diterima
        address,
        deadline
      );

      await tx.wait();

      toast("Remove liquidity succses, have a nice day !", {
        position: "bottom-left",
      });
      setLiquidity("");
      await loadLPBalance();
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null) {
        const err = e as { reason?: string; message?: string };
        alert(`Error: ${err.reason || err.message || "Unknown error"}`);
      } else {
        toast.error("Remove liquidity failed !", {
          position: "top-right",
        });
      }
    }

    setRemoving(false);
  }

  // Load LP balance saat tokenA/tokenB berubah atau koneksi wallet berubah
  useEffect(() => {
    loadLPBalance();
  }, [tokenA, tokenB, isConnected, address]);

  return (
    <div className="items-center flex flex-col justify-center mt-0">
      <Card className="max-w-[400px] shadow-lg shadow-green-500 justify-center items-center p-5">
        <CardHeader className="flex justify-center items-center gap-2">
          <h3 className="text-xl font-bold">Remove Liquidity</h3>
        </CardHeader>

        {!isConnected ? (
          <p className="text-center text-red-500 mt-4">
            Wallet belum terhubung.
          </p>
        ) : (
          <>
            {[ 
              {
                label: "Token A",
                token: tokenA,
                setter: setTokenA,
                exclude: tokenB.symbol,
              },
              {
                label: "Token B",
                token: tokenB,
                setter: setTokenB,
                exclude: tokenA.symbol,
              },
            ].map(({ label, token, setter, exclude }) => (
              <div className="w-full mt-4" key={label}>
                <p className="text-sm mb-1">{label}</p>
                <div className="flex gap-2 items-center">
                  <Avatar src={token.logo} size="sm" />
                  <Select
                    className="w-full"
                    selectedKeys={[token.symbol]}
                    onSelectionChange={(keys) => {
                      const selected = TOKEN_LIST.find(
                        (t) =>
                          t.symbol ===
                          (typeof keys === "string"
                            ? keys
                            : Array.from(keys as Set<string>)[0])
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
