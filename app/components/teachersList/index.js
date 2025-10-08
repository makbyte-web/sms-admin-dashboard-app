"use client";

import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import Header from "../ui/header";
import DeleteModal from "../ui/deleteModal";
import { useTheme } from "@/context/themeContext";
import { Teachers } from "@/firestore/documents/teacher";
import ProfileLoadingSkeleton from "../ui/profileLoadingSkeleton";
import Alert from "../ui/alert";
import FilteredSearch from "../ui/filterSeach";
import { useUserContext } from "@/context/UserContext";
import Modal from "../ui/modal";
import AddNewTeacherForm from "../addNewTeacherForm";

const TeacherList = () => {
  const {
    openModal,
    handleModalClose,
    title,
    handleModalOpen,
    isLoading,
    setIsLoading,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    setIsDeleteModalOpen,
    setAlert,
    handleSearchInput,
    teachersFilteredData,
    teachers,
    setTeachers,
    schoolID,
    setSchoolID,
    loggedInUserID,
    setLoggedInUserID,
  } = useTheme();
  const { user } = useUserContext();
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [deleteItems, setDeleteItems] = useState([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserID = JSON.parse(localStorage.getItem("userID")) || "NA";
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      setSchoolID(schoolID);
      setLoggedInUserID(loggedInUserID);
    }
  }, []);
  const fetchTeachers = async () => {
    if (!schoolID || schoolID === "NA") {
      console.warn("fetchTeachers skipped: schoolID is missing");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching teachers for schoolID:", schoolID);
      const fetchedTeachers = await Teachers.getTeachersBySchool(schoolID);
      setTeachers(fetchedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!schoolID || schoolID === "NA") {
      console.warn("Waiting for valid schoolID...");
      return;
    }

    fetchTeachers();
  }, [schoolID]);

  const deleteOperation = async (id) => {
    await Teachers.deleteTeacher(id);
  };

  const handleDelete = (id) => {
    setDeleteItems([id]);
    setIsDeleteModalOpen(true);
    setIsBulkDelete(false);
  };

  const handleBulkDelete = () => {
    setDeleteItems(selectedTeachers.map((teacher) => teacher.teacherID));
    setIsDeleteModalOpen(true);
    setIsBulkDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      for (const id of deleteItems) {
        await deleteOperation(id);
      }
      setSelectedTeachers([]);
    } else {
      await deleteOperation(deleteItems[0]);
    }
    setIsDeleteModalOpen(false);
    setDeleteItems([]);
    fetchTeachers();
  };

  const toggleSelectTeacher = (teacher) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacher)
        ? prev.filter((t) => t !== teacher)
        : [...prev, teacher]
    );
  };

  if (isLoading) return <ProfileLoadingSkeleton />;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Header
        buttonText={"Add Teacher"}
        currentPage={"Teachers"}
        handleModalOpen={() => handleModalOpen("Add")}
      />
      <FilteredSearch
        placeholder="Search By Teacher Name or Subject"
        onChange={(e) =>
          handleSearchInput(e, "teacherName", "subject", teachers)
        }
      />
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {selectedTeachers?.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white dark:bg-[--bgSoft] sm:left-12">
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-700"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300 dark:divide-[--bg]">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={selectedTeachers?.length === teachers?.length}
                        onChange={() =>
                          setSelectedTeachers(
                            selectedTeachers.length === teachers?.length
                              ? []
                              : teachers
                          )
                        }
                      />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-[--text]"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="dark:text-[--text] px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="dark:text-[--text] px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[--bg] bg-white dark:bg-[--bgSoft]">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 dark:text-[--textSoft]"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : teachersFilteredData?.length > 0 ? (
                    teachersFilteredData?.map((teacher) => (
                      <tr
                        key={teacher?.teacherID}
                        className={
                          selectedTeachers.includes(teacher)
                            ? "bg-gray-50 dark:bg-[--bg]"
                            : ""
                        }
                      >
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          <input
                            type="checkbox"
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={selectedTeachers.includes(teacher)}
                            onChange={() => toggleSelectTeacher(teacher)}
                          />
                        </td>
                        <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium dark:text-[--text]">
                          <Link
                            onClick={() => {
                              if (teacher)
                                localStorage.setItem(
                                  "teacher",
                                  JSON.stringify(teacher)
                                );
                            }}
                            href={`/dashboard/teachers/${teacher?.teacherID}`}
                          >
                            {teacher?.teacherName}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                          {teacher?.email}
                        </td>
                        <td className="whitespace-nowrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                          {teacher?.subject}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() =>
                              handleModalOpen(
                                "Edit",
                                teacher?.teacherID && teacher
                              )
                            }
                          >
                            Edit
                          </button>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                          <button
                            className="bg-red-600 px-2 py-1 rounded-lg text-white"
                            onClick={() => handleDelete(teacher?.teacherID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 dark:text-[--textSoft]"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {teachers?.length === 0 && (
                <Alert handleModalOpen={handleModalOpen} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewTeacherForm
          handleModalClose={handleModalClose}
          title={title}
          fetchTeachers={fetchTeachers}
        />
      </Modal>
      <DeleteModal
        modalType={isBulkDelete ? "Teachers Data" : "Teacher"}
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TeacherList;
