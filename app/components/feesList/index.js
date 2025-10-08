"use client";
import React, { useState } from "react";
import Header from "../ui/header";
import Loader from "../ui/loader";
import CustomSelectForm from "../customSelectForm";
import FeesListingTable from "../feesListingTable";

const FeesList = ({ handleModalOpen }) => {
  const [storedAcademicYear, setStoredAcademicYear] = useState("");
  const [studentsFeesList, setStudentsFeesList] = useState(null);
  // console.log(studentsFeesList, "studentsFeesList");
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <Header
        // buttonText={"Add Student Fee"}
        currentPage={"Fees"}
        // handleModalOpen={() => handleModalOpen("Add")}
      ></Header>
      <CustomSelectForm
        title={"Students Fees Table"}
        storedAcademicYear={storedAcademicYear}
        setStoredAcademicYear={setStoredAcademicYear}
        studentsFeesList={studentsFeesList}
        setStudentsFeesList={setStudentsFeesList}
        setLoading={setLoading}
      ></CustomSelectForm>
      {!loading && <FeesListingTable studentsFeesList={studentsFeesList} />}
    </div>
  );
};

export default FeesList;
