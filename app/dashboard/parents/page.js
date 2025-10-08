"use client";
import ParentsList from "@/app/components/parentsList";
import { useTheme } from "@/context/themeContext";
import Modal from "@/app/components/ui/modal";
import React, { useState } from "react";
import AddNewParentForm from "@/app/components/addNewParentForm";

const Parents = () => {
  const { openModal, handleModalClose, handleModalOpen, title } = useTheme();

  return (
    <>
      {/* <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewParentForm handleModalClose={handleModalClose} title={title} />
      </Modal> */}
      <ParentsList handleModalOpen={handleModalOpen} />
    </>
  );
};

export default Parents;
