"use client";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TypewriterEffectSmooth } from "@/components/ui/typerwriter-effect";
import { MinimalFooter } from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 overflow-hidden">
      {/* Main content area */}
      <main className="flex-1 relative flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />

        <h1
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white relative z-20"
          )}
        >
          <TypewriterEffectSmooth
            words={[
              { text: "Welcome" },
              { text: "to" },
              { text: "School", className: "text-blue-500 dark:text-blue-500" },
              {
                text: "Management",
                className: "text-blue-500 dark:text-blue-500",
              },
              {
                text: "Dashboard.",
                className: "text-blue-500 dark:text-blue-500",
              },
            ]}
            className="max-sm:hidden"
          />
        </h1>

        <h2 className="px-2 hidden max-sm:block max-sm:text-2xl text-white relative z-20 capitalize">
          Welcome to{" "}
          <span className="text-blue-500 font-semibold">
            School Management Dashboard
          </span>
        </h2>

        <p className="text-center mt-4 text-lg sm:text-xl md:text-2xl text-white relative z-20">
          Get started by
        </p>

        <div className="mt-6 z-20">
          <Link
            href="/login"
            className="inline-flex items-center rounded-md bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
          >
            Login
          </Link>
        </div>
      </main>

      {/* Footer always at the bottom */}
      <MinimalFooter />
    </div>
  );
}
