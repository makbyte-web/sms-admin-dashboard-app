"use client";
import SchoolSubjectList from "@/app/components/schoolSubjectList";
import { useTheme } from "@/context/themeContext";
import React from "react";

const Subject = () => {
  const { openModal, handleModalClose, title, handleModalOpen } = useTheme();

  return (
    <>
      <SchoolSubjectList handleModalOpen={handleModalOpen} />
    </>
  );
};

export default Subject;
