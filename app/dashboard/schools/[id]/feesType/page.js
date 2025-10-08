"use client";
import AddFeesType from "@/app/components/addFeesTypeForm";
import SchoolFeesTypeList from "@/app/components/schoolFeesTypeList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import React from "react";

const FeesType = () => {
  return (
    <>
      <SchoolFeesTypeList />
    </>
  );
};

export default FeesType;
