"use client";
import AddDivision from "@/app/components/addDivision";
import SchoolDivisionList from "@/app/components/schoolDivisionList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import React from "react";

const Division = () => {
  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <SchoolDivisionList />
    </div>
  );
};

export default Division;
