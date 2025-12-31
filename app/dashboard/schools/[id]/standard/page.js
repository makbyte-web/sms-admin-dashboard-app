"use client";
import SchoolStandardList from "@/app/components/schoolStandardList";
import { useTheme } from "@/context/themeContext";
import React from "react";

const Standard = () => {
  const { handleModalOpen } = useTheme();

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <SchoolStandardList handleModalOpen={handleModalOpen} />
    </div>
  );
};

export default Standard;
