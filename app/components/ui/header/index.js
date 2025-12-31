"use client";
import { usePathname } from "next/navigation";
import React from "react";
import UploadCSV from "../../uploadFile";

const Header = ({ noUpload, buttonText, currentPage, handleModalOpen, userPlaceholder }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 pb-6 pt-0 dark:bg-gray-800 rounded-md w-full">
      {/* Title Section */}
      <h1 className="text-xl sm:text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
        {pathname === "/dashboard" ? (
          <>
            <span className="text-indigo-600 text-2xl sm:text-3xl">
              Welcome,{" "}
            </span>
            {userPlaceholder}
          </>
        ) : (
          currentPage
        )}
      </h1>

      {pathname !== "/dashboard" && (
        <div className="w-full">
          {pathname !== "/dashboard/fees" && pathname !== "/dashboard/attendance" && pathname !== "/dashboard/scanner" &&
            pathname !== "/dashboard/notification" && pathname !== "/dashboard/settings" && pathname !== "/dashboard/schools" &&
            pathname !== "/dashboard/schools/configuration" && pathname !== "/dashboard/profile" && <UploadCSV />}

          {buttonText && (
            <button
              onClick={handleModalOpen}
              type="button"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition w-1/2 sm:w-auto flex justify-self-end justify-center"
            >
              {buttonText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
