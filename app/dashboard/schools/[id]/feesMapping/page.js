"use client";
import AddFeesMapping from "@/app/components/addFeesMapping";
import SchoolFeesMappingList from "@/app/components/schoolFeesMappingList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import React from "react";

const FeesMapping = () => {
  return (
    <>
      <SchoolFeesMappingList />
    </>
  );
};

export default FeesMapping;
