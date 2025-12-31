"use client";
import React, { useState } from "react";
import Header from "../ui/header";
import Loader from "../ui/loader";
import CustomSelectForm from "../customSelectForm";
import FeesListingTable from "../feesListingTable";

const FeesList = ({ handleModalOpen }) => {
  const [storedAcademicYear, setStoredAcademicYear] = useState("");
  const [studentsFeesList, setStudentsFeesList] = useState(null);
  const [loading, setLoading] = useState(true);
  
  return (
    <>
      <Header currentPage={"Fees"}></Header>
      <CustomSelectForm
        title={"Students Fees Table"}
        storedAcademicYear={storedAcademicYear}
        setStoredAcademicYear={setStoredAcademicYear}
        studentsFeesList={studentsFeesList}
        setStudentsFeesList={setStudentsFeesList}
        setLoading={setLoading}
      ></CustomSelectForm>
      {!loading && <FeesListingTable studentsFeesList={studentsFeesList} />}
    </>
  );
};

export default FeesList;
