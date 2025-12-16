"use client";
import React, { useState, useEffect } from "react";
import DeleteModal from "../ui/deleteModal";
import { useUserContext } from "@/context/UserContext";

import { ParentStudents } from "@/firestore/documents/parentStudents";
import { Parents } from "@/firestore/documents/parent";
import { Students } from "@/firestore/documents/student";

import Link from "next/link";
import { useTheme } from "@/context/themeContext";
import Modal from "../ui/modal";
import AddLinkParentStudents from "../addLinkParentStudents";

const ParentStudentsList = ({ handleModalOpen }) => {

  const [parentStudentsData, setParentStudentsData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParentStudent, setSelectedParentStudent] = useState(null);
  const [parentsId, setParentsId] = useState("");

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

  const fetchParentStudents = async () => {
    let result = [],
      parentStudentsResult = [],
      parentsResult = [],
      studentsResult = [];

    if (!schoolID || !userType) {
      console.warn("Skipping fetch: schoolID or userType is missing.");
      return;
    }

    try {
      if (userType === "superadmin") {
        parentStudentsResult = await ParentStudents.getParentStudentsBySchool(
          schoolID
        );
      } else if (userType === "schooladmin") {
        parentStudentsResult =
          await ParentStudents.getParentStudentsCreatedByUser(loggedInUserID);
      } else {
        console.warn("Unauthorized userType:", userType);
        return;
      }

      if (parentStudentsResult?.length > 0) {
        [parentsResult, studentsResult] = await Promise.all([
          Parents.getParentsBySchool(schoolID),
          Students.getStudentsBySchool(schoolID),
        ]);

        const parentsMap = parentsResult.reduce((acc, parent) => {
          acc[parent.parentID] = parent.parentName;
          return acc;
        }, {});

        const studentsMap = studentsResult.reduce((acc, student) => {
          acc[student.studentID] = student.studentName;
          return acc;
        }, {});

        result = parentStudentsResult.map((parentStudent) => {
          const childrenNames = Array.isArray(parentStudent?.children)
            ? parentStudent.children.map(
                (item) => studentsMap[item] || "Unknown Student"
              )
            : [];

          return {
            ...parentStudent,
            parentName: parentsMap[parentStudent.parentID] || "Unknown Parent",
            childrenNames,
          };
        });
      } else {
        console.warn("No parent-student relationships found.");
      }

      // Ensure result is an array before sorting
      if (Array.isArray(result) && result.length > 0) {
        result.sort((data1, data2) =>
          data1.parentName.localeCompare(data2.parentName)
        );
      }
      const existingParentsId = result.map((item) => item.parentID);
      const strParentsId = existingParentsId.join(" ");  
      setParentsId(strParentsId);
      setParentStudentsData(result);
    } catch (error) {
      console.error("Error fetching parent-student data:", error);
    }
  };
 

  useEffect(() => {
    fetchParentStudents();
  }, [loggedInUserID, schoolID, userType]);

  // Handle delete functionality
  const handleDelete = (psID) => {
    setSelectedParentStudent(psID);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const updatedParentStudents = parentStudentsData.filter(
      (item) => item.psID !== selectedParentStudent
    );
    await ParentStudents.deleteParentStudents(selectedParentStudent);
    setParentStudentsData(updatedParentStudents);
    setDeleteModalOpen(false);
    setSelectedParentStudent(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedParentStudent(null);
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
          onClick={() => handleModalOpen("Add Parent Students Link", parentsId)}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition justify-end"
        >
          Add Parent Students Link
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="text-center">
          <span className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
            Parent Students Link List
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
                      Academic Year
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Parent Name
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Children Names
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
                  {parentStudentsData?.map((list, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.academicYear}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.parentName}
                      </td>
                      <td className="whitespace-nowrap whitespace-pre-wrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.childrenNames?.map((sName) => `${sName}\n`)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.createdDate}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-indigo-600 hover:dark:text-white"
                          onClick={() =>
                            handleModalOpen(
                              "Edit Parent Students Link",
                              list?.psID && list
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(list?.psID)}
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
        <AddLinkParentStudents
          handleModalClose={handleModalClose}
          title={title}
          fetchParentStudents={fetchParentStudents}
        />
      </Modal>
      {isDeleteModalOpen && (
        <DeleteModal
          modalType="ParentStudents"
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ParentStudentsList;
