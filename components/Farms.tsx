"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ethers, Contract, Signer, Provider } from "ethers";
import Farming from "../Data/Farming";
import { useAccount } from "wagmi";
import { ToastContainer, toast } from 'react-toastify';
import Abi from "../Data/Abi";
type Pool = {
  id: number;
  TokenReward: string;
  name: string;
  amount: number; // total staked, akan di-update dari contract
  apr: number;    // apr, juga akan di-fetch
  status: string;
  logo: string;
  userStake: number;
  rewardToken: number;
  contractAddress: string;
  claimableReward?: number;
  decimalsReward: number;
  decimalsStake: number;
  tokenStakeAddres: string;
};

interface FarmsProps {
  farms: Pool[];
}

const Farms: React.FC<FarmsProps> = ({ farms }) => {
  const { address, isConnected } = useAccount();
  

  const [stakeAmounts, setStakeAmounts] = useState<{ [key: number]: string }>({});
  const [userStakes, setUserStakes] = useState<{ [key: number]: string }>({});
  const [claimableRewards, setClaimableRewards] = useState<{ [key: number]: string }>({});
  const [aprMap, setAprMap] = useState<{ [key: number]: string }>({});
  const [totalStakedMap, setTotalStakedMap] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [nativeFees, setNativeFees] = useState<{ [key: number]: ethers.BigNumberish }>({});
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const getContract = useCallback(
    (address: string): ethers.Contract => {
      if (!signer) throw new Error("Wallet not connected");
      return new ethers.Contract(address, Farming, signer);
    },
    [signer]
  );

  // Set signer on wallet connect
  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum && isConnected && address) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
          const walletSigner = await provider.getSigner();
          setSigner(walletSigner);
        } catch (error) {
          console.error("Failed to get signer", error);
          setSigner(null);
        }
      } else {
        setSigner(null);
      }
    };
    init();
  }, [isConnected, address]);

  // Fetch native fee per pool
  const fetchNativeFee = useCallback(
    async (pool: Pool) => {
      if (!signer) return;
      try {
        const contract = getContract(pool.contractAddress);
        const fee = await contract.nativeFee();
        setNativeFees((prev) => ({ ...prev, [pool.id]: fee }));
      } catch (err) {
        console.error(`Failed to fetch fee for pool ${pool.id}`, err);
        setNativeFees((prev) => ({ ...prev, [pool.id]: ethers.parseEther("0") }));
      }
    },
    [signer, getContract]
  );

  // Fetch user staking data
  const fetchUserStakingData = useCallback(
    async (pool: Pool) => {
      if (!signer || !address) return;

      try {
        const contract = getContract(pool.contractAddress);
        const [userStake, reward] = await Promise.all([
          contract.getUserStaked(address),
          contract.getPendingReward(address),
        ]);

        const userStakeFormatted = new Intl.NumberFormat("id-ID", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(parseFloat(ethers.formatUnits(userStake, pool.decimalsStake)));

        const rewardFormatted = new Intl.NumberFormat("id-ID", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(parseFloat(ethers.formatUnits(reward, pool.decimalsReward)));

        setUserStakes((prev) => ({ ...prev, [pool.id]: userStakeFormatted }));
        setClaimableRewards((prev) => ({ ...prev, [pool.id]: rewardFormatted }));
      } catch (err) {
        console.error(`Error fetching staking data for pool ${pool.id}:`, err);
      }
    },
    [signer, getContract, address]
  );

  // Fetch total staked & APR from contract per pool
  const fetchPoolStats = useCallback(
    async (pool: Pool) => {
      if (!signer) return;

      try {
        const contract = getContract(pool.contractAddress);
        // Total staked
        const totalStaked = await contract.getTotalStaked();
        const totalStakedFormatted = new Intl.NumberFormat("id-ID", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(parseFloat(ethers.formatUnits(totalStaked, pool.decimalsStake)));
        setTotalStakedMap((prev) => ({ ...prev, [pool.id]: totalStakedFormatted }));

        // APR, pastikan fungsi APR di contract ada dan namanya sesuai
        // Jika di contract tidak ada fungsi apr, bisa hardcode atau ambil dari API
        if (typeof contract.getAPR === "function") {
          const aprBig = await contract.getAPR();
        
          // Misalnya APR disimpan dalam 1e18 seperti token ERC20
          const apr = Number(ethers.formatUnits(aprBig, 5)) * 100; // hasil dalam %
          const aprFormatted = apr.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        
          setAprMap((prev) => ({ ...prev, [pool.id]: aprFormatted }));
        } else {
          setAprMap((prev) => ({
            ...prev,
            [pool.id]: pool.apr.toFixed(2),
          }));
        }
      } catch (err) {
        console.error(`Failed to fetch pool stats for pool ${pool.id}:`, err);
        setTotalStakedMap((prev) => ({ ...prev, [pool.id]: pool.amount.toLocaleString() }));
        setAprMap((prev) => ({ ...prev, [pool.id]: pool.apr.toFixed(2) }));
      }
    },
    [signer, getContract]
  );

  // On signer, address, or pools update, fetch necessary data
  useEffect(() => {
    if (!signer || !address || farms.length === 0) return;

    farms.forEach((pool) => {
      fetchNativeFee(pool);
      fetchUserStakingData(pool);
      fetchPoolStats(pool);
    });

    const interval = setInterval(() => {
      farms.forEach(fetchUserStakingData);
      farms.forEach(fetchPoolStats);
    }, 10000);

    return () => clearInterval(interval);
  }, [signer, address, farms, fetchNativeFee, fetchUserStakingData, fetchPoolStats]);

  // Wrapper to set loading state during async calls
  const withLoading =
    (poolId: number, fn: () => Promise<void>) =>
    async () => {
      try {
        setLoading((prev) => ({ ...prev, [poolId]: true }));
        await fn();
      } finally {
        setLoading((prev) => ({ ...prev, [poolId]: false }));
      }
    };

  const handleStake = (pool: Pool) =>
    withLoading(pool.id, async () => {
      if (!signer) return;

      const input = stakeAmounts[pool.id];
      const amount = parseFloat(input);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Transaksi gagal");
        return;
      }
      function getTokenContract(
        tokenAddress: string,
        signerOrProvider: Signer | Provider
      ): Contract {
        const ERC20_ABI = [
          "function approve(address spender, uint256 amount) public returns (bool)",
          "function allowance(address owner, address spender) public view returns (uint256)"
        ];
        return new ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider);
      }
 

      try {
        const tokenContract = getTokenContract(pool.tokenStakeAddres, signer); // Fungsi untuk ambil ERC20 contract
        const stakingContract = getContract(pool.contractAddress); // Kontrak staking
  
        const contract = getContract(pool.contractAddress);
        const value = nativeFees[pool.id] ?? ethers.parseEther("0");
        const amountInWei = ethers.parseUnits(amount.toString(), pool.decimalsStake);

        
        const ownerAddress = await signer.getAddress();
        const allowance = await tokenContract.allowance(ownerAddress, pool.contractAddress);
  
        // ✅ Approve jika allowance kurang dari jumlah yang mau di-stake
        if (allowance < amountInWei) {
          const approveTx = await tokenContract.approve(pool.contractAddress, amountInWei);
          await approveTx.wait();
          console.log("✅ Approve success");
        }
  
        const tx = await contract.stake(amountInWei, { value });
        await tx.wait();

        toast.success("Stake berhasil!");

        fetchUserStakingData(pool);
        setStakeAmounts((prev) => ({ ...prev, [pool.id]: "" }));
      } catch (error) {
        console.error("❌ Staking failed:", error);
        toast.error("Transaksi gagal");
      }
    })();

  const handleUnstake = (pool: Pool) =>
    withLoading(pool.id, async () => {
      const input = stakeAmounts[pool.id];
      const amount = parseFloat(input);
      if (isNaN(amount) || amount <= 0 || !signer) {
        toast.error("Transaksi gagal");
        return;
      }

      try {
        const contract = getContract(pool.contractAddress);
        const amountInWei = ethers.parseUnits(amount.toString(), pool.decimalsStake);
        const tx = await contract.unstake(amountInWei);
        await tx.wait();

        toast.success("Unstake berhasil!");

        fetchUserStakingData(pool);
        setStakeAmounts((prev) => ({ ...prev, [pool.id]: "" }));
      } catch (err) {
        console.error("Unstake error:", err);
        toast("Unstake Failed");
      }
    })();

  const handleHarvest = (pool: Pool) =>
    withLoading(pool.id, async () => {
      if (!signer) return;
      try {
        const contract = getContract(pool.contractAddress);
        const tx = await contract.claimReward();
        await tx.wait();

        toast( "Harvest Successful");

        fetchUserStakingData(pool);
      } catch (err) {
        console.error("Harvest error:", err);
        toast("Harvest Failed" );
      }
    })();

  return (
    <div className="gap-5 flex justify-center items-center flex-wrap">
      {farms.map((pool) => (
        <div
          key={pool.id}
          className="bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-900 dark:via-zinc-800 dark:to-green-900 rounded-2xl shadow-lg p-6 border-2 border-green-400 max-w-sm w-full relative"
        >
          <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-green-600 text-white font-bold">
            FARMS
          </span>

          <div className="flex items-center gap-4 mb-4">
            <img src={`/images/${pool.logo}`} alt={pool.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                🌿 {pool.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{pool.TokenReward} Reward</p>
            </div>
            <span
              className={`ml-auto px-3 py-1 text-sm rounded-full font-medium ${
                pool.status.toLowerCase() === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {pool.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
            <div>
              <p className="font-medium">Total Staked</p>
              <p className="text-lg font-semibold">{totalStakedMap[pool.id] ?? pool.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">APR</p>
              <p className="text-lg font-semibold">{aprMap[pool.id] ?? pool.apr.toFixed(2)}%</p>
            </div>
            <div>
              <p className="font-medium">Your Stake</p>
              <p className="text-lg font-semibold">{userStakes[pool.id] ?? "0"}</p>
            </div>
            <div>
              <p className="font-medium">{pool.TokenReward} Earned</p>
              <p className="text-lg font-semibold">{claimableRewards[pool.id] ?? "0"}</p>
            </div>
          </div>

          <input
            type="number"
            inputMode="decimal"
            placeholder="Enter amount"
            value={stakeAmounts[pool.id] ?? ""}
            onChange={(e) => setStakeAmounts((prev) => ({ ...prev, [pool.id]: e.target.value }))}
            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-gray-600 dark:text-white"
            disabled={pool.status.toLowerCase() === "inactive"}
            min="0"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleStake(pool)}
              disabled={pool.status.toLowerCase() === "inactive"}
              className={`flex-1 py-2 rounded-lg text-white font-semibold transition ${
                pool.status.toLowerCase() === "inactive"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Stake
            </button>
            <button
              onClick={() => handleUnstake(pool)}
              disabled={pool.status.toLowerCase() === "inactive"}
              className={`flex-1 py-2 rounded-lg text-white font-semibold transition ${
                pool.status.toLowerCase() === "inactive"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Unstake
            </button>
            <button
              onClick={() => handleHarvest(pool)}
              disabled={pool.status.toLowerCase() === "inactive"}
              className={`flex-1 py-2 rounded-lg text-white font-semibold transition ${
                pool.status.toLowerCase() === "inactive"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Harvest
            </button>
          </div>
        </div>
      ))}

      <div className="flex-1 flex justify-center">
        <img
          src="/images/farms.png"
          alt="Nekoswap Tokenomics Illustration"
          className="max-w-sm w-32"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Farms;
