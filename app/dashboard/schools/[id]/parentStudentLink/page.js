"use client";
import React from "react";
import { useTheme } from "@/context/themeContext";
import Modal from "@/app/components/ui/modal";
import AddLinkParentStudents from "@/app/components/addLinkParentStudents";
import ParentStudentsList from "@/app/components/parentStudentsList";

const ParentStudentLink = () => {
  const { openModal, handleModalClose, title, handleModalOpen } = useTheme();

  return (
    <>
      {/* <Modal open={openModal} handleModalClose={handleModalClose}>
          {title === "Add Parent Students Link" || title === "Edit Parent Students Link" ? (
            <AddLinkParentStudents handleModalClose={handleModalClose} title={title} />
          ) : null}
      </Modal> */}
      <ParentStudentsList handleModalOpen={handleModalOpen} />
    </>
  );
};

export default ParentStudentLink;
