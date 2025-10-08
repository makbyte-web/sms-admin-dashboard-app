"use client";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAdminAuth = (WrappedComponent) => {
  const AdminAuthComponent = (props) => {
    const { isSuperAdmin } = useUserContext();
    const router = useRouter();

    useEffect(() => {
      if (!isSuperAdmin) {
        router.push("/dashboard");
      }
    }, [isSuperAdmin, router]);

    if (!isSuperAdmin) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return AdminAuthComponent;
};

export default withAdminAuth;
