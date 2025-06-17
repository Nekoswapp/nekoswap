// components/Web3Wrapper.tsx
"use client";
import React from "react";

import Web3Provider from "./Web3Provider";

export default function Web3Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Web3Provider>{children}</Web3Provider>;
}
