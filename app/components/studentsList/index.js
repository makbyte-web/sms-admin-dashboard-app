"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Header from "../ui/header";
import Link from "next/link";
import { Students } from "@/firestore/documents/student";
import DeleteModal from "../ui/deleteModal";
import Alert from "../ui/alert";
import { useTheme } from "@/context/themeContext";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import FilteredSearch from "../ui/filterSeach";
import LoadingSpinner from "../ui/loadingSpinner";
import { useUserContext } from "@/context/UserContext";
import Modal from "../ui/modal";
import AddNewStudentForm from "../addNewStudentForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StudentList({
  // handleModalOpen,
  handleStudentFeesOpen,
}) {
  const {
    alert,
    setAlert,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    setIsDeleteModalOpen,
    students,
    setStudents,
    studentsFilteredData,
    handleSearchInput,
    userType,
    setUserType,
    openModal,
    handleModalClose,
    handleModalOpen,
    title,
    schoolID,
    setSchoolID,
    loggedInUserID,
    setLoggedInUserID,
  } = useTheme();
  const checkbox = useRef();
  const { user } = useUserContext();

  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);

  const [deleteItems, setDeleteItems] = useState([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserID = JSON.parse(localStorage.getItem("userID")) || "NA";
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      setSchoolID(schoolID);
      setUserType(userType);
      setLoggedInUserID(loggedInUserID);
    }
  }, []);

  const deleteOperation = async (id) => {
    await Students.deleteStudent(id);
  };

  const handleDelete = async (id) => {
    setDeleteItems([id]);
    setIsDeleteModalOpen(true);
    setIsBulkDelete(false);
  };

  const handleBulkDelete = () => {
    setDeleteItems(selectedPeople.map((person) => person.studentID));
    setIsDeleteModalOpen(true);
    setIsBulkDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      for (const id of deleteItems) {
        await deleteOperation(id);
      }
      setSelectedPeople([]);
    } else {
      await deleteOperation(deleteItems[0]);
    }
    setIsDeleteModalOpen(false);
    setDeleteItems([]);
    fetchStudents();
  };

  const fetchStudents = async () => {
    if (!schoolID || !userType) {
      console.warn("Skipping fetch: schoolID or userType is missing.");
      return;
    }
    let studentsRes = [];

    if (userType === "superadmin") {
      studentsRes = await Students.getStudentsBySchool(schoolID);
    } else if (userType === "schooladmin") {
      studentsRes = await Students.getStudentsCreatedByUser(loggedInUserID);
    } else {
      console.warn("Unauthorized userType:", userType);
      return;
    }

    if (studentsRes?.length > 0) {
      const stdResult = await Standards.getStandardsBySchool(schoolID);
      const divResult = await Divisions.getDivisionsBySchool(schoolID);

      const standardMap = stdResult.reduce((acc, std) => {
        acc[std.stdID] = std.stdName;
        return acc;
      }, {});

      const divisionMap = divResult.reduce((acc, div) => {
        acc[div.divID] = div.divName;
        return acc;
      }, {});

      const studentsWithStdDiv = studentsRes.map((student) => ({
        ...student,
        stdName: standardMap[student.stdID] || "Unknown",
        divName: divisionMap[student.divID] || "Unknown",
      }));

      setStudents(studentsWithStdDiv);
    } else {
      console.warn("No students found.");
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [schoolID, userType, user?.uid]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < students.length;
    setChecked(selectedPeople.length === students.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedPeople, students.length]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : students);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }
  useEffect(() => {
    if (students?.length === 0) setTimeout(() => setAlert(true), 2000);
    setAlert(false);
  }, [setAlert, students?.length]);

  return (
    <>
      <Header buttonText={"Add Student"} currentPage={"Students"} handleModalOpen={() => handleModalOpen("Add")} />
      <div className="-my-8">
        <FilteredSearch
          placeholder="Search By Student Name or Gr. No."
          onChange={(e) => handleSearchInput(e, "studentName", "grNo", students)}
        />
      </div>
      <div className="mt-4 flow-root">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {selectedPeople.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white dark:bg-[--bgSoft] sm:left-12">
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table
                className="min-w-full table-fixed divide-y divide-gray-300 dark:divide-[--bg]"
                style={{
                  display: students?.length === 0 ? "block" : "",
                }}
              >
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="dark:text-[--text] px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Gr. No.
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
                      Class
                    </th>
                    <th
                      scope="col"
                      className="dark:text-[--text] px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                {students?.length > 0 ? (
                  <tbody className="divide-y divide-gray-200 dark:divide-[--bg] bg-white dark:bg-[--bgSoft]">
                    {studentsFilteredData === null ||
                      studentsFilteredData === undefined ? (
                      <p>Loading...</p> // Show a loading message while fetching data
                    ) : Array.isArray(studentsFilteredData) &&
                      studentsFilteredData.length > 0 ? (
                      studentsFilteredData.map((person) => (
                        <tr
                          key={person?.studentID}
                          className={
                            selectedPeople.includes(person)
                              ? "bg-gray-50 dark:bg-[--bg]"
                              : undefined
                          }
                        >
                          <td className="relative px-7 sm:w-12 sm:px-6">
                            {selectedPeople.includes(person) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              value={person.studentID}
                              checked={selectedPeople.includes(person)}
                              onChange={(e) =>
                                setSelectedPeople(
                                  e.target.checked
                                    ? [...selectedPeople, person]
                                    : selectedPeople.filter((p) => p !== person)
                                )
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                            {person?.grNo}
                          </td>
                          <td
                            className={classNames(
                              "whitespace-nowrap py-4 pr-3 text-sm font-medium dark:text-[--text]",
                              selectedPeople.includes(person)
                                ? "text-indigo-600"
                                : "text-gray-900"
                            )}
                          >
                            <Link
                              onClick={() => {
                                if (person)
                                  localStorage.setItem(
                                    "student",
                                    JSON.stringify(person)
                                  );
                              }}
                              href={`/dashboard/students/${person.studentID}`}
                            >
                              {person?.studentName}
                            </Link>
                          </td>

                          <td className="whitespace-nowrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                            {person?.stdName} {person?.divName}
                          </td>
                          <td className="whitespace-nowrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                            {person?.email}
                          </td>


                          <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => handleModalOpen("Edit", person)}
                            >
                              Edit
                            </button>
                          </td>
                          <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <button
                              className="bg-red-600 px-2 py-1 rounded-lg text-white"
                              onClick={() => handleDelete(person?.studentID)}
                            >
                              Delete
                            </button>
                          </td>
                          <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-normal sm:pr-3">
                            <button
                              className="bg-green-600 px-2 py-1 rounded-lg text-white"
                              onClick={() => handleStudentFeesOpen()}
                            >
                              Issue Fee
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <p>No data available</p>
                    )}
                  </tbody>
                ) : (
                  alert && <Alert handleModalOpen={handleModalOpen} />
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewStudentForm
          handleModalClose={handleModalClose}
          fetchStudents={fetchStudents}
        />
      </Modal>
      <DeleteModal
        modalType={isBulkDelete ? "Students Data" : "Student"}
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
