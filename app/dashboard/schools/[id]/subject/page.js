"use client";
import SchoolSubjectList from "@/app/components/schoolSubjectList";
import { useTheme } from "@/context/themeContext";
import React from "react";

const Subject = () => {
  const { handleModalOpen } = useTheme();

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <SchoolSubjectList handleModalOpen={handleModalOpen} />
    </div>
  );
};

export default Subject;
