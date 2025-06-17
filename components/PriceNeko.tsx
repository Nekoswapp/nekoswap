import React from "react";
import { useTokenPrice } from "@/config/useTokenPrice";

export default function TokenPriceDisplay() {
  const pairAddress = "0x140C07a8801f7F8b93A95CBA63144271c93321E8";    // ganti dengan pair contract address pool kamu
  const token0Address = "0x649a2DA7B28E0D54c13D5eFf95d3A660652742cC";  // ganti dengan token0 address
  const token1Address = "0x808e4f1d6e0A507b031a1136601f5962A8AAC7a2";  // ganti dengan token1 address

  // Panggil hook untuk ambil harga token1 dalam token0
  const price = useTokenPrice({ pairAddress, token0Address, token1Address });

  return (
    <div>
        <div>
        <button
  disabled={price === "Loading..." || price === "Error"}
  className={`
    inline-flex items-center gap-2
    px-3 py-1.5 rounded-md
    bg-white text-gray-800 text-sm font-semibold
    shadow-sm border border-gray-300
    hover:bg-gray-100 transition
    disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200
  `}
  title="Harga token NEKO dalam IDR"
>
  <span className="text-orange-600 font-bold">NEKO</span>
  <span className="text-xs font-medium">
    {price === "Loading..."
      ? "Memuat..."
      : price === "Error"
      ? "Gagal"
      : `≈ IDR ${parseFloat(price).toLocaleString("id-ID", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        })}`}
  </span>
</button>

        </div>

    </div>
  );
}
