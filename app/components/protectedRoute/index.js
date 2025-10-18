"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../ui/loadingSpinner";
import { useUserContext } from "@/context/UserContext";
import Loader from "../ui/loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUserContext();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
    if (!loading && user && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <Loader />;
  }

  return children;
}
