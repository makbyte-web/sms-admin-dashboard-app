"use client";
import { CompanyName } from "@/defaults";

export function MinimalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-center py-3 border-t border-slate-800">
      <p className="text-slate-400 text-sm">
        © {currentYear}{" "}
        <a
          target="_blank"
          href="https://makbyte.io/"
          className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
        >
          {CompanyName}
        </a>
        . All rights reserved.
      </p>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent blur-sm" />
    </footer>
  );
}
