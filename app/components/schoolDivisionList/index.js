"use client";
import React, { useState, useEffect } from "react";
import DeleteModal from "../ui/deleteModal";
import { useUserContext } from "@/context/UserContext";
import { Divisions } from "@/firestore/documents/division";
import Link from "next/link";
import { useTheme } from "@/context/themeContext";
import Modal from "../ui/modal";
import AddDivision from "../addDivision";

const SchoolDivisionList = () => {
  const [divisionListData, setDivisionListData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const { user } = useUserContext();
  const {
    userType,
    setUserType,
    schoolName,
    setSchoolName,
    schoolID,
    setSchoolID,
    openModal,
    handleModalClose,
    title,
    handleModalOpen,
  } = useTheme();
  const loggedInUserID = user?.uid ? user?.uid : "NA";
  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const schoolName = JSON.parse(localStorage.getItem("schoolName")) || "NA";
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      setSchoolID(schoolID);
      setSchoolName(schoolName);
      setUserType(userType);
    }
  }, []);

  const fetchSchoolDivisionsList = async () => {
    let result;
    if (userType === "superadmin") {
      result = await Divisions.getDivisionsBySchool(schoolID);
    } else if (userType === "schooladmin") {
      result = await Divisions.getDivisionsCreatedByUser(loggedInUserID);
    } else {
      result = "You are not authorized to see Schools Standards List data";
    }
    if (Array.isArray(result)) result.sort((div1, div2) => div1.divName.localeCompare(div2.divName));
    if (result) setDivisionListData(result);
  };
  useEffect(() => {
    fetchSchoolDivisionsList();
  }, [loggedInUserID, schoolID, userType]);

  // Handle delete functionality
  const handleDelete = (divID) => {
    setSelectedDivision(divID);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const updatedDivisionList = divisionListData.filter(
      (div) => div.divID !== selectedDivision
    );
    await Divisions.deleteDivision(selectedDivision);
    setDivisionListData(updatedDivisionList);
    setDeleteModalOpen(false);
    setSelectedDivision(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedDivision(null);
  };

  return (
    <div className="mb-10">
      <div className="max-sm:text-center mb-10">
        <Link href={`/dashboard/schools/${schoolID}`}>
          <button
            type="button"
            className="block rounded-xl bg-indigo-600 px-4 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            &larr; Back
          </button>
        </Link>
      </div>
      <div className="flex justify-end w-full mb-10">
        <button
          onClick={() => handleModalOpen("Add Division")}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition justify-end"
        >
          Add Division
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="text-center">
          <span className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
            Division List
          </span>
        </div>

        <div className="-mx-4 mt-2 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y">
                <thead className="dark:bg-[--bg] bg-[--bgBlue]">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      {" "}
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Division
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Created Date
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800 divide dark:bg-[#353e4b] bg-white">
                  {divisionListData?.map((list, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6"></td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.divName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.createdDate}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-indigo-600 hover:dark:text-white"
                          onClick={() =>
                            handleModalOpen(
                              "Edit Division",
                              list?.divID && list
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(list?.divID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddDivision
          handleModalClose={handleModalClose}
          title={title}
          fetchSchoolDivisionsList={fetchSchoolDivisionsList}
        />
      </Modal>
      {isDeleteModalOpen && (
        <DeleteModal
          modalType="Division"
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default SchoolDivisionList;
