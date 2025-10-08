"use client";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../components/ui/loader";

const UserLayout = ({ children }) => {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        {/* <p className="text-4xl">Loading...</p> */}
        <Loader />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default UserLayout;
