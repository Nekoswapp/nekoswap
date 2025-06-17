"use client";
import React from "react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex items-center justify-center gap-4 py-8 md:py-10">
      <div className="  text-center justify-center">
        {children}
      </div>
    </section>
  );
}
