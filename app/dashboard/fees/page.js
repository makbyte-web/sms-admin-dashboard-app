"use client";
import AddNewFeesForm from "@/app/components/addStudentFeesForm";
import FeesList from "@/app/components/feesList";
import Header from "@/app/components/ui/header";
import Modal from "@/app/components/ui/modal";
import { useTheme } from "@/context/themeContext";

const Fees = ({ children }) => {
  const { openModal, handleModalClose, handleModalOpen } = useTheme();

  return (
    <>
      {/* <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewFeesForm handleModalClose={handleModalClose}></AddNewFeesForm>
      </Modal> */}
      <FeesList handleModalOpen={handleModalOpen}>{children}</FeesList>
    </>
  );
};

export default Fees;
