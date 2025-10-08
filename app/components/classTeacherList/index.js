"use client";
import React, { useState, useEffect } from "react";
import DeleteModal from "../ui/deleteModal";
import { useUserContext } from "@/context/UserContext";
import { ClassTeacher } from "@/firestore/documents/classTeacher";
import { Teachers } from "@/firestore/documents/teacher";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";

import Link from "next/link";
import { useTheme } from "@/context/themeContext";
import Modal from "../ui/modal";
import AddClassTeacher from "../addClassTeacher";

const ClassTeacherList = () => {
  const [classTeacherData, setClassTeacherData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClassTeacher, setSelectedClassTeacher] = useState(null);

  const { user } = useUserContext();
  const {
    userType,
    setUserType,
    schoolName,
    setSchoolName,
    schoolID,
    openModal,
    handleModalClose,
    title,
    handleModalOpen,
    setSchoolID,
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

  const fetchClassTeacher = async () => {
    let result, classTeacherResult, teachersResult, stdResult, divResult;
    if (userType === "superadmin") {
      classTeacherResult = await ClassTeacher.getClassTeachersBySchool(
        schoolID
      );
    } else if (userType === "schooladmin") {
      classTeacherResult = await ClassTeacher.getClassTeachersCreatedByUser(
        loggedInUserID
      );
    } else {
      result = "You are not authorized to see Class Teachers data";
    }
    if (classTeacherResult.length > 0) {
      teachersResult = await Teachers.getTeachersBySchool(schoolID);
      stdResult = await Standards.getStandardsBySchool(schoolID);
      divResult = await Divisions.getDivisionsBySchool(schoolID);
      const teacherMap = teachersResult.reduce((acc, teacher) => {
        acc[teacher.teacherID] = teacher.teacherName;
        return acc;
      }, {});
      const standardMap = stdResult.reduce((acc, std) => {
        acc[std.stdID] = std.stdName;
        return acc;
      }, {});
      const divisionMap = divResult.reduce((acc, div) => {
        acc[div.divID] = div.divName;
        return acc;
      }, {});
      const classTeacherWithNameStdDiv = classTeacherResult.map(
        (classTeacher) => {
          return {
            ...classTeacher,
            teacherName: teacherMap[classTeacher.teacherID],
            stdName: standardMap[classTeacher.stdID],
            divName: divisionMap[classTeacher.divID],
          };
        }
      );
      result = classTeacherWithNameStdDiv;
    }
    result.sort((data1, data2) =>
      data1.teacherName.localeCompare(data2.teacherName)
    );
    if (result) setClassTeacherData(result);
  };
  useEffect(() => {
    fetchClassTeacher();
  }, [userType, schoolID, loggedInUserID]);

  // Handle delete functionality
  const handleDelete = (ctID) => {
    setSelectedClassTeacher(ctID);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const updatedClassTeacher = classTeacherData.filter(
      (item) => item.ctID !== selectedClassTeacher
    );
    await ClassTeacher.deleteClassTeacher(selectedClassTeacher);
    setClassTeacherData(updatedClassTeacher);
    setDeleteModalOpen(false);
    setSelectedClassTeacher(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedClassTeacher(null);
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
          onClick={() => handleModalOpen("Add Class Teacher")}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition justify-end"
        >
          Add Class Teacher
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="text-center">
          <span className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
            Class Teachers List
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
                      Teacher Name
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Class
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
                  {classTeacherData?.map((list, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.academicYear}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.teacherName}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.stdName} {list?.divName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.createdDate}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-indigo-600 hover:dark:text-white"
                          onClick={() =>
                            handleModalOpen(
                              "Edit Class Teacher",
                              list?.ctID && list
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(list?.ctID)}
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
        <AddClassTeacher
          handleModalClose={handleModalClose}
          title={title}
          fetchClassTeacher={fetchClassTeacher}
        />
      </Modal>
      {isDeleteModalOpen && (
        <DeleteModal
          modalType="ClassTeacher"
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ClassTeacherList;
