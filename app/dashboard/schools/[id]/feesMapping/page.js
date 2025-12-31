"use client";
import AddFeesMapping from "@/app/components/addFeesMapping";
import SchoolFeesMappingList from "@/app/components/schoolFeesMappingList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import React from "react";

const FeesMapping = () => {
  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <SchoolFeesMappingList />
    </div>
  );
};

export default FeesMapping;
