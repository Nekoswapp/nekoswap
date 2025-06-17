"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Avatar } from "@heroui/avatar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // Scroll mentok ke atas -> hide navbar
      if (scrollTop === 0) {
        setShowNavbar(false);
      }

      // Scroll ke bawah sedikit -> show navbar
      if (scrollTop > 10 && !showNavbar) {
        setShowNavbar(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showNavbar]);

  return (
    <>
      {showNavbar && (
        <motion.div
          key={Date.now()} // agar animasi diulang setiap muncul
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md"
        >
          <div className="flex items-center justify-between px-4 py-2 w-full max-w-7xl mx-auto">
            <NextLink href="/" className="flex items-center space-x-2">
              <Avatar size="sm" src="/images/logo.png" />
              <h4 className="font-bold text-base text-gray-800 dark:text-white">
                Nekoswap
              </h4>
            </NextLink>
            <div className="text-sm">
              <ConnectButton  showBalance={false}
      accountStatus="avatar" // atau "icon" kalau mau hanya logo wallet
      label="Connect Wallet"/>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};
