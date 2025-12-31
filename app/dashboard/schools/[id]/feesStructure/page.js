"use client";
import AddFeesStructureType from "@/app/components/addFeesStructureForm";
import AddFeesType from "@/app/components/addFeesTypeForm";
import SchoolFeesStructureList from "@/app/components/schoolFeesStructureList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";

const FeesStructure = () => {
  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <SchoolFeesStructureList />
    </div>
  );
};

export default FeesStructure;
