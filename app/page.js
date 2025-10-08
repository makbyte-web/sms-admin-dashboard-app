"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TypewriterEffectSmooth } from "@/components/ui/typerwriter-effect";
import LoadingSpinner from "./components/ui/loadingSpinner";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  // const { user, loading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loading) {
  //     if (user) {
  //       router.push("/dashboard");
  //     } else {
  //       console.log(user);
  //     }
  //   }
  // }, [user ,loading, router]);

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <h1
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white relative z-20 text-center"
        )}
      >
        <TypewriterEffectSmooth
          words={[
            { text: "Welcome" },
            { text: "to" },
            { text: "Student", className: "text-blue-500 dark:text-blue-500" },
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
      <h2 className="px-2 hidden max-sm:block max-sm:text-2xl text-white relative z-20 text-center capitalize">
        Welcome to{" "}
        <span className="text-blue-500 z-20 text-center capitalize font-semibold">
          Student Management Dashboard
        </span>
      </h2>
      <p className="text-center mt-2 text-md sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl relative z-20 text-white">
        Get started by
      </p>
      <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 md:gap-8 z-10">
        <Link
          href="/login"
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-8 py-3 sm:px-10 sm:py-3 md:px-12 md:py-4 text-base sm:text-lg md:text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 pulse"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
