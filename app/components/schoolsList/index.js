"use client";

import { useState, useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import Header from "../ui/header";
import DeleteModal from "../ui/deleteModal";
import { useTheme } from "@/context/themeContext";
import { Schools } from "@/firestore/documents/school";
import Alert from "../ui/alert";
import FilteredSearch from "../ui/filterSeach";
// import LoadingSpinner from "../ui/loadingSpinner";
import { useUserContext } from "@/context/UserContext";
import Modal from "../ui/modal";
import AddNewSchoolForm from "../addNewSchoolForm";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

const SchoolsList = () => {
  const {
    handleModalOpen,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    setIsDeleteModalOpen,
    handleSearchInput,
    schools,
    setSchools,
    schoolsFilteredData,
    userType,
    setUserType,
    loggedInUserID,
    setLoggedInUserID,
    openModal,
    handleModalClose,
    title,
  } = useTheme();
  
  const { user } = useUserContext();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserID = JSON.parse(localStorage.getItem("userID")) || "NA";
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      setUserType(userType);
      setLoggedInUserID(loggedInUserID);
    }
  }, []);

  const handleToggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedSchools([]);
  };

  const handleSelectSchool = (id) => {
    setSelectedSchools((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((schoolID) => schoolID !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedSchools.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const deleteOperation = async (id) => {
    await Schools.deleteSchool(id);
  };

  const handleConfirmDelete = async () => {
    for (const id of selectedSchools) {
      await deleteOperation(id);
    }
    setIsDeleteModalOpen(false);
    setIsDeleteMode(false);
    setSelectedSchools([]);
  };
  const fetchSchool = async () => {
    let result;
    if (userType === "superadmin") {
      result = await Schools.getSchools();
    } else if (userType === "schooladmin") {
      result = await Schools.getSchoolsOwnedByUser(user?.uid);
    } else {
      result = [];
    }
    if (result) setSchools(result);
  };
  useEffect(() => {
    fetchSchool();
  }, [userType, user?.uid, setSchools]);

  return (
    <>
      {userType === "superadmin" ? (
        <Header buttonText={"Add School"} currentPage={"Schools"} handleModalOpen={() => handleModalOpen("Add")} />
      ) : (
        <Header currentPage={"Schools"} />
      )}

      {userType === "superadmin" ? (
        <div className="-my-8">
          <FilteredSearch
            placeholder="Search By School Name or Location"
            onChange={(e) =>
              handleSearchInput(e, "schoolName", "location", schools)
            }
          /></div>
      ) : <></>}

      {userType === "superadmin" ? (
        <div className="flex justify-end items-center gap-x-2 mx-2 mt-10">
          <button
            onClick={handleToggleDeleteMode}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
          >
            {!isDeleteMode ? <FaTrashAlt /> : ""}
            {isDeleteMode ? "Cancel" : "Delete"}
          </button>
          <Link
            href="/dashboard/schools/configuration"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
          >
            <Cog6ToothIcon
              aria-hidden="true"
              className="h-6 w-6 shrink-0"
            />
            Configuration
          </Link>
        </div>
      ) : (
        <></>
      )}

      {isDeleteMode && selectedSchools?.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
          >
            Confirm Delete
          </button>
        </div>
      )}

      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mt-4"
        style={{
          display: schoolsFilteredData?.length === 0 ? "block" : "",
        }}
      >
        {schoolsFilteredData?.length === 0 ? (
          <Alert
            handleModalOpen={() => handleModalOpen("Add")}
            page="Schools"
          />
        ) : (
          schoolsFilteredData?.map((school, i) => (
            <li
              key={school?.schoolID}
              className={`relative col-span-1 divide-y divide-gray-200 dark:divide-[--bgSoft] dark:bg-[--bg] bg-white overflow-hidden shadow-2xl dark:shadow-md rounded-xl transition-transform duration-300 ${selectedSchools.includes(school?.schoolID)
                ? "scale-105 border-[1px] dark:border-white border-indigo-400"
                : "scale-100"
                }`}
            >
              {isDeleteMode && (
                <input
                  type="checkbox"
                  checked={selectedSchools.includes(school?.schoolID)}
                  onChange={() => handleSelectSchool(school?.schoolID)}
                  className="absolute top-4 left-4 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
              )}
              <Link
                onClick={() => {
                  if (school)
                    localStorage.setItem("school", JSON.stringify(school));
                }}
                href={
                  !isDeleteMode ? `/dashboard/schools/${school?.schoolID}` : "#"
                }
              >
                <div
                  className={`flex w-full items-center justify-between space-x-6 p-6 ${isDeleteMode ? "pl-16" : ""
                    }`}
                >
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-semibold dark:text-white text-[--bg]">
                        {school?.schoolName} - {school?.indexNo}
                      </h3>
                    </div>
                    <p className="mt-1 truncate text-sm dark:text-gray-200 text-[--bgSoft]">
                      {school?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <Link
                    onClick={() => {
                      if (school)
                        localStorage.setItem("school", JSON.stringify(school));
                    }}
                    href={`/dashboard/schools/${school?.schoolID}`}
                    className="-ml-px flex w-0 flex-1 border-r-[1px] border-indigo-400"
                  >
                    <span className="relative inline-flex w-0 bg-indigo-600 hover:bg-indigo-700 flex-1 items-center justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-white">
                      <IoEyeOutline
                        aria-hidden="true"
                        className="h-6 w-6 text-white hover:text-black"
                      />
                      View Profile
                    </span>
                  </Link>
                  <button
                    className="-ml-px flex w-0 flex-1 cursor-pointer"
                    onClick={() => {
                      handleModalOpen("Edit", school?.schoolID && school)
                    }}
                  >
                    <span className="relative inline-flex w-0 bg-indigo-600 hover:bg-indigo-700 flex-1 items-center justify-center gap-x-3 border border-transparent py-4 text-sm font-semibold text-white">
                      <FaRegEdit
                        aria-hidden="true"
                        className="h-6 w-6 text-white hover:text-black"
                      />
                      Edit Profile
                    </span>
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewSchoolForm
          handleModalClose={handleModalClose}
          fetchSchool={fetchSchool}
        />
      </Modal>
      <DeleteModal
        modalType="Schools Data"
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default SchoolsList;
