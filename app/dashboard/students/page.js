"use client";
import List from "@/app/components/studentsList/index";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";
import { useState } from "react";
import AddStudentFees from "@/app/components/addStudentFeesForm";

const Students = ({ children }) => {
  const { handleModalOpen } = useTheme();
  const [isStudentFeesOpen, setIsStudentFeesOpen] = useState(false);

  const handleStudentFeesOpen = () => {
    setIsStudentFeesOpen(true);
  };

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
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
    </div>
  );
};

export default Students;
