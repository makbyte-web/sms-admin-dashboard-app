"use client";
import TeachersList from "@/app/components/teachersList";
import { useTheme } from "@/context/themeContext";
import Modal from "@/app/components/ui/modal";
import React, { useState } from "react";
import AddNewTeacherForm from "@/app/components/addNewTeacherForm";

const Teachers = () => {
  // const { openModal, handleModalClose, handleModalOpen, title } = useTheme();

  return (
    <>
      {/* <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewTeacherForm handleModalClose={handleModalClose} title={title} />
      </Modal> */}
      <TeachersList />
    </>
  );
};

export default Teachers;
