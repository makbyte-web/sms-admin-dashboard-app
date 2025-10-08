"use client";

import SchoolsList from "@/app/components/schoolsList";
import Modal from "@/app/components/ui/modal";
import withAdminAuth from "@/app/components/withAdminAuth";
import { useTheme } from "@/context/themeContext";
import AddStandard from "@/app/components/addStandard";
import AddDivision from "@/app/components/addDivision";
import AddFeesType from "@/app/components/addFeesTypeForm";
import AddNewSchoolForm from "@/app/components/addNewSchoolForm";
import AddFeesStructureType from "@/app/components/addFeesStructureForm";
import AddFeesMapping from "@/app/components/addFeesMapping";
import AddLinkParentStudents from "@/app/components/addLinkParentStudents";
import AddClassTeacher from "@/app/components/addClassTeacher";

const Schools = ({ children }) => {
  const { openModal, handleModalClose, title } = useTheme();

  return (
    <>
      <Modal open={openModal} handleModalClose={handleModalClose}>
        {(title === "Add" || title === "Edit") && (
          <AddNewSchoolForm handleModalClose={handleModalClose} />
        )}
        {title === "Add Standard" && (
          <AddStandard handleModalClose={handleModalClose} title={title} />
        )}
        {title === "Add Division" && (
          <AddDivision handleModalClose={handleModalClose} title={title} />
        )}
        {title === "Add Fees Type" && (
          <AddFeesType handleModalClose={handleModalClose} title={title} />
        )}
        {title === "Add Fees Structure" && (
          <AddFeesStructureType
            handleModalClose={handleModalClose}
            title={title}
          />
        )}
        {title === "Add Fees Mapping" && (
          <AddFeesMapping handleModalClose={handleModalClose} title={title} />
        )}
        {title === "Add Parent Students Link" && (
          <AddLinkParentStudents
            handleModalClose={handleModalClose}
            title={title}
          />
        )}
        {title === "Add Class Teacher" && (
          <AddClassTeacher handleModalClose={handleModalClose} title={title} />
        )}
      </Modal>
      <SchoolsList>{children}</SchoolsList>
    </>
  );
};

export default Schools;
