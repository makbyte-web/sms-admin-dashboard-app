"use client";
import { useTheme } from "@/context/themeContext";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";

export default function Alert({ handleModalOpen, page }) {
  const { userType, setUserType } = useTheme();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";

      setUserType(userType);
    }
  }, []);

  return (
    <div className="border-l-4 border-[--bgBlue] bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="h-5 w-5 text-[--bgSoft]"
          />
        </div>
        <div className="ml-3">
          {userType === "superadmin" ? (
            <p className="text-sm text-[--bg]">
              Select a School to view this page or Data for this page is not yet added.
            </p>
          ) : (
            <p className="text-sm text-[--bg]">
              You have no {page} Data. You need to add {page} by clicking this{" "}
              {userType === "superadmin" ? (
                <button
                  className="font-medium text-[--bg] underline hover:text-[--bgBlue]"
                  onClick={handleModalOpen}
                >
                  Add {page}.
                </button>
              ) : null}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
