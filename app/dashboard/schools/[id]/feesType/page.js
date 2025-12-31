"use client";
import AddFeesType from "@/app/components/addFeesTypeForm";
import SchoolFeesTypeList from "@/app/components/schoolFeesTypeList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import React from "react";

const FeesType = () => {
  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <SchoolFeesTypeList />
    </div>
  );
};

export default FeesType;
