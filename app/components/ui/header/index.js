"use client";
import { usePathname } from "next/navigation";
import React from "react";
import UploadCSV from "../../uploadFile";

const Header = ({
  noUpload,
  buttonText,
  currentPage,
  handleModalOpen,
  userPlaceholder,
}) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-wrap sm:flex-row sm:items-center sm:justify-between pb-6 pt-0 dark:bg-gray-800 rounded-md ">
      <div className="flex flex-col sm:flex-row sm:items-center">
        <h1 className="sm:text-2xl text-xl font-semibold leading-6 text-gray-900 dark:text-white">
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
      </div>
      {pathname !== "/dashboard" ? (
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 items-center space-x-4">
          {pathname === "/dashboard/fees" || pathname === "/dashboard/scanner" || pathname === "/dashboard/notification" || pathname === "/dashboard/settings" ? null
           : <UploadCSV />}
          {buttonText && (
            <button
              onClick={handleModalOpen}
              type="button"
              style={{
                margin: "0px",
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition"
            >
              {buttonText}
            </button>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
