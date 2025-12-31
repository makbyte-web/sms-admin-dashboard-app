"use client";
import React, { useState, useEffect } from "react";
import DeleteModal from "../ui/deleteModal";
import { Standards } from "@/firestore/documents/standard";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import { useTheme } from "@/context/themeContext";
import Modal from "../ui/modal";
import AddStandard from "../addStandard";

const SchoolStandardList = () => {
  const [standardListData, setStandardListData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState(null);

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

  const fetchSchoolStandardList = async () => {
    let result;
    if (userType === "superadmin") {
      result = await Standards.getStandardsBySchool(schoolID);
    } else if (userType === "schooladmin") {
      result = await Standards.getStandardsCreatedByUser(loggedInUserID);
    } else {
      result = "You are not authorized to see Schools Standards List data";
    }
    if (Array.isArray(result)) result.sort((std1, std2) => std1.stdName.localeCompare(std2.stdName));
    if (result) setStandardListData(result);
  };
  useEffect(() => {
    fetchSchoolStandardList();
  }, [loggedInUserID, schoolID, userType]);

  // Handle delete functionality
  const handleDelete = (stdID) => {
    setSelectedStandard(stdID);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    const updatedStandardList = standardListData.filter(
      (std) => std.stdID !== selectedStandard
    );
    setStandardListData(updatedStandardList);
    await Standards.deleteStandard(selectedStandard);
    setDeleteModalOpen(false);
    setSelectedStandard(null);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedStandard(null);
  };

  return (
    <>
      <div className="max-sm:text-center">
        <Link href={`/dashboard/schools/${schoolID}`}>
          <button
            type="button"
            className="block rounded-xl bg-indigo-600 px-4 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            &larr; Back
          </button>
        </Link>
      </div>
      <div className="flex justify-end w-full mb-2">
        <button
          onClick={() => handleModalOpen("Add Standard")}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition justify-end"
        >
          Add Standard
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="text-center mb-2">
          <span className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
            Standard List
          </span>
        </div>

        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y">
                <thead className="dark:bg-[--bg] bg-[--bgBlue]">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      &nbsp;
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Standard
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
                  {standardListData?.map((list, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {" "}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.stdName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.createdDate}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-indigo-600 hover:dark:text-white"
                          onClick={() =>
                            handleModalOpen(
                              "Edit Standard",
                              list?.stdID && list
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(list?.stdID)}
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
        {/* {title === "Add Standard" || title === "Edit Standard" ? ( */}
        <AddStandard
          handleModalClose={handleModalClose}
          title={title}
          fetchSchoolStandardList={fetchSchoolStandardList}
        />
        {/* ) : null} */}
      </Modal>
      {isDeleteModalOpen && (
        <DeleteModal
          modalType="Standard"
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default SchoolStandardList;
