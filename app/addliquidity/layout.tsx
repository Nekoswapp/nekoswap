"use client";
import React from "react";

export default function addliquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="md:py-10">
      <div className="">{children}</div>
     
    </section>
  );
}
