"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "./theme-switch"; // asumsikan komponen theme switch
import { FaWallet,FaHome,FaChevronDown } from "react-icons/fa";
const BottomNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = (path: string) => {
    setDropdownOpen(false);
    router.push(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-xl mx-auto flex justify-between items-center py-2 px-5 text-gray-700 dark:text-gray-300 font-medium font-sans">
        {/* Swap Button */}
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          style={{ fontSize: "0.75rem" }}
          aria-label="Swap"
        >
          {/* Exchange Icon */}
          <FaHome size={24} color="#4f46e5" />
          <span>Home</span>
        </button>

        {/* More Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            style={{ fontSize: "0.75rem" }}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="More menu"
          >
            Menu
            <FaChevronDown className="" />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg min-w-[160px] text-gray-700 dark:text-gray-300 font-medium">
              {/* Duplicate Swap here */}
              <button
                onClick={() => navigate("/addliquidity")}
                className="block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors rounded"
              >
                Swap
              </button>
              <button
                onClick={() => navigate("/Earn")}
                className="block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors rounded"
              >
                Earn
              </button>
              <button
                onClick={() => navigate("/Nft")}
                className="block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors rounded"
              >
                NFT
              </button>
              <button
                onClick={() => navigate("/games")}
                className="block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors rounded"
              >
                Games
              </button>
              <button
                onClick={() => navigate("/WhitePaper")}
                className="block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors rounded"
              >
                WhitePaper
              </button>
              <button
                onClick={() => navigate("/Lauchpad")}
                className="block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors rounded"
              >
                Nekopad
              </button>
              <div className="border-t border-gray-300 dark:border-gray-700 mt-1 px-4 py-2">
                <ThemeSwitch />
              </div>
            </div>
          )}
        </div>

        {/* Earn Button */}
        <button
          onClick={() => navigate("/Wallet")}
          className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          style={{ fontSize: "0.75rem" }}
          aria-label="Earn"
        >
          {/* Coin icon */}
          <FaWallet className="text-indigo-500 dark:text-indigo-400" />
          <span>Wallet</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavbar;
