"use client";
import FeesList from "@/app/components/feesList";
import { useTheme } from "@/context/themeContext";

const Fees = ({ children }) => {
  const { openModal, handleModalClose, handleModalOpen } = useTheme();

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <FeesList handleModalOpen={handleModalOpen}>{children}</FeesList>
    </div>
  );
};

export default Fees;
