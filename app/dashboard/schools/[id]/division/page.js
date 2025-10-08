"use client";
import AddDivision from "@/app/components/addDivision";
import SchoolDivisionList from "@/app/components/schoolDivisionList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import React from "react";

const Division = () => {
  return (
    <>
      <SchoolDivisionList />
    </>
  );
};

export default Division;
