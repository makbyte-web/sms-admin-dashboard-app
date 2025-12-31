"use client";
import React from "react";
import { useTheme } from "@/context/themeContext";
import ParentStudentsList from "@/app/components/parentStudentsList";

const ParentStudentLink = () => {
  const { handleModalOpen } = useTheme();

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <ParentStudentsList handleModalOpen={handleModalOpen} />
    </div>
  );
};

export default ParentStudentLink;
