"use client";
import AddFeesStructureType from "@/app/components/addFeesStructureForm";
import AddFeesType from "@/app/components/addFeesTypeForm";
import SchoolFeesStructureList from "@/app/components/schoolFeesStructureList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";

const FeesStructure = () => {
  return (
    <>
      <SchoolFeesStructureList />
    </>
  );
};

export default FeesStructure;
