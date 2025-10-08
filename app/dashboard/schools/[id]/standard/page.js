"use client";
import AddStandard from "@/app/components/addStandard";
import SchoolStandardList from "@/app/components/schoolStandardList";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import React from "react";

const Standard = () => {
  const { openModal, handleModalClose, title, handleModalOpen } = useTheme();

  return (
    <>
      {/* <Modal open={openModal} handleModalClose={handleModalClose}>
        {title === "Add Standard" || title === "Edit Standard" ? (
          <AddStandard handleModalClose={handleModalClose} title={title} />
        ) : null}
      </Modal> */}
      <SchoolStandardList handleModalOpen={handleModalOpen} />
    </>
  );
};

export default Standard;
