// src/components/WhitepaperSection.tsx
import { FaFilePdf } from "react-icons/fa"
import Link from "next/link"
import { Button } from "@heroui/button"

export default function WhitepaperSection() {
  return (
    <section className="relative bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="backdrop-blur-md bg-white/70 dark:bg-zinc-800/60 rounded-3xl shadow-2xl p-10 md:p-16 border border-zinc-200 dark:border-zinc-700 transition-all">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
            📄 Whitepaper NekoSwap
          </h2>
          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 mb-10 leading-relaxed">
          Explore the vision, core technology, token model, and future roadmap of NekoSwap. This whitepaper outlines our commitment to building a community-driven DeFi ecosystem.
          </p>
          <div className="flex justify-center flex-wrap gap5 ">
            <Link href="/NekoSwap Whitepaper (ENGLESH).pdf" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gap-5 px-8 py-5 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <FaFilePdf className="w-6 h-6" />
               (English)
              </Button>
            </Link>
            <Link href="/NekoSwap Whitepaper (BAHASA INDONESIA).pdf" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gap-3 px-8 py-5 text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <FaFilePdf className="w-6 h-6" />
                 (Indonesia)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-300 opacity-20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-300 opacity-20 rounded-full filter blur-3xl"></div>
      </div>
    </section>
  )
}
