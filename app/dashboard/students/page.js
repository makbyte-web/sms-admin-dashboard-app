"use client";
import List from "@/app/components/studentsList/index";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import AddNewStudentForm from "@/app/components/addNewStudentForm";
import { useState } from "react";
import AddStudentFees from "@/app/components/addStudentFeesForm";

const Students = ({ children }) => {
  const { openModal, handleModalClose, handleModalOpen, title } = useTheme();
  const [isStudentFeesOpen, setIsStudentFeesOpen] = useState(false);
  const handleStudentFeesOpen = () => {
    setIsStudentFeesOpen(true);
  };

  return (
    <>
      {/* <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewStudentForm handleModalClose={handleModalClose} title={title} />
      </Modal> */}
      <Modal
        open={isStudentFeesOpen}
        handleModalClose={() => setIsStudentFeesOpen(false)}
      >
        <AddStudentFees
          handleModalClose={() => setIsStudentFeesOpen(false)}
        ></AddStudentFees>
      </Modal>
      <List
        handleModalOpen={handleModalOpen}
        handleStudentFeesOpen={handleStudentFeesOpen}
      >
        {children}
      </List>
    </>
  );
};

export default Students;
