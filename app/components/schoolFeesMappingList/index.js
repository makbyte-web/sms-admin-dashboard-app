"use client";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";
import DeleteModal from "../ui/deleteModal";
import { FeesStructure } from "@/firestore/documents/feesStructure";
import { FeesMapping } from "@/firestore/documents/feesMapping";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import { Students } from "@/firestore/documents/student";
import Link from "next/link";
import Modal from "../ui/modal";
import AddFeesMapping from "../addFeesMapping";

export default function SchoolFeesMappingList() {
  const [feesMappingListData, setFeesMappingListData] = useState([]);
  const [selectedFeesMappingID, setSelectedFeesMappingID] = useState(null);
  const {
    isDeleteModalOpen,
    handleCloseDeleteModal,
    setIsDeleteModalOpen,
    handleModalOpen,
    userType,
    setUserType,
    schoolID,
    setSchoolID,
    loggedInUserID,
    setLoggedInUserID,
    openModal,
    handleModalClose,
    title,
  } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUserID = JSON.parse(localStorage.getItem("userID")) || "NA";
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      setUserType(userType);
      setSchoolID(schoolID);
      setLoggedInUserID(loggedInUserID);
    }
  }, []);

  const handleDelete = (id) => {
    setSelectedFeesMappingID(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFeesMappingID) {
      setFeesMappingListData(
        feesMappingListData.filter(
          (item) => item.feesMapID !== selectedFeesMappingID
        )
      );
      await FeesMapping.deleteFeesMapping(selectedFeesMappingID);
      setSelectedFeesMappingID(null);
      setIsDeleteModalOpen(false);
    }
  };

  const fetchSchoolFeesMappingList = async () => {
    if (!schoolID || schoolID === "NA" || !userType) {
      console.warn("Skipping fetch: Invalid schoolID or userType.");
      return;
    }

    try {
      let feesMappingRes = [];
      if (userType === "superadmin") {
        feesMappingRes = await FeesMapping.getFeesMappingBySchool(schoolID);
      } else if (userType === "schooladmin") {
        feesMappingRes = await FeesMapping.getFeesMappingCreatedByUser(
          loggedInUserID
        );
      } else {
        console.warn("Unauthorized userType:", userType);
        return;
      }

      // Fetch all required data in parallel
      const [feesStructureRes, stdResult, divResult, studentsRes] =
        await Promise.all([
          FeesStructure.getFeesStructureBySchool(schoolID),
          Standards.getStandardsBySchool(schoolID),
          Divisions.getDivisionsBySchool(schoolID),
          Students.getStudentsBySchool(schoolID),
        ]);

      if (!feesMappingRes.length || !feesStructureRes.length) {
        console.warn("No fees mapping or structure data found.");
        setFeesMappingListData([]);
        return;
      }

      const standardMap = stdResult.reduce((acc, std) => {
        acc[std.stdID] = std.stdName;
        return acc;
      }, {});

      const divisionMap = divResult.reduce((acc, div) => {
        acc[div.divID] = div.divName;
        return acc;
      }, {});

      const studentMap = studentsRes.reduce((acc, student) => {
        acc[student.studentID] = {
          ...student,
          stdName: standardMap[student.stdID] || "Unknown",
          divName: divisionMap[student.divID] || "Unknown",
        };
        return acc;
      }, {});

      const feesStructureMap = feesStructureRes.reduce((acc, feeStructure) => {
        acc[feeStructure.feesStructureID] = feeStructure.groupName;
        return acc;
      }, {});

      const feesMappingWithStdDivStudGroup = feesMappingRes.map(
        (feeMapped) => ({
          ...feeMapped,
          ...(feeMapped.assignTo === "Student"
            ? { student: studentMap[feeMapped.assigneeID] }
            : { standard: standardMap[feeMapped.assigneeID] }),
          assignedGroupsNames: feeMapped.assignedGroups.map(
            (groupID) => feesStructureMap[groupID] || "Unknown Group"
          ),
        })
      );

      setFeesMappingListData(feesMappingWithStdDivStudGroup);
    } catch (error) {
      console.error("Error fetching school fees mapping data:", error);
    }
  };

  useEffect(() => {
    fetchSchoolFeesMappingList();
  }, [loggedInUserID, schoolID, userType]);

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
          onClick={() => handleModalOpen("Add Fees Mapping")}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition justify-end"
        >
          Add Fees Mapping
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="text-center mb-2">
          <span className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
            Fees Mapping List
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
                      Academic Year
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Group Name
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Assigned To
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Assignee
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
                  {feesMappingListData?.map((list, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.academicYear}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.assignedGroupsNames?.map(
                          (group) => `${group}\n`
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.assignTo}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.assignTo === "Student"
                          ? `${list?.student?.studentName} ( ${list?.student?.stdName} ${list?.student?.divName} )`
                          : list?.standard}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.createdDate}
                      </td>

                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-indigo-600 hover:dark:text-white"
                          onClick={() =>
                            handleModalOpen(
                              "Edit Fees Mapping",
                              list?.feesMapID && list
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(list?.feesMapID)}
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
        <AddFeesMapping
          handleModalClose={handleModalClose}
          title={title}
          fetchSchoolFeesMappingList={fetchSchoolFeesMappingList}
        />
      </Modal>
      <DeleteModal
        modalType="Fees Mapping data"
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
