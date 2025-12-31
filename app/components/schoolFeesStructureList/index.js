"use client";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";
import DeleteModal from "../ui/deleteModal";
import { FeesStructure } from "@/firestore/documents/feesStructure";
import { FeesType } from "@/firestore/documents/feesType";
import Link from "next/link";
import Modal from "../ui/modal";
import AddFeesStructureType from "../addFeesStructureForm";

export default function SchoolFeesStructureList() {
  const [feesStructureListData, setFeesStructureListData] = useState([]);
  const [selectedFeesStructureID, setSelectedFeesStructureID] = useState(null);

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
      setSchoolID(schoolID);
      setUserType(userType);
      setLoggedInUserID(loggedInUserID);
    }
  }, []);

  const handleDelete = (id) => {
    setSelectedFeesStructureID(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFeesStructureID) {
      setFeesStructureListData(
        feesStructureListData.filter(
          (item) => item.feesStructureID !== selectedFeesStructureID
        )
      );
      await FeesStructure.deleteFeesStructure(selectedFeesStructureID);
      setSelectedFeesStructureID(null);
      setIsDeleteModalOpen(false);
    }
  };

  const fetchSchoolFeesStructureList = async () => {
    let result, feesStructureRes, feesTypeRes;
    if (userType === "superadmin") {
      feesStructureRes = await FeesStructure.getFeesStructureBySchool(schoolID);
    } else if (userType === "schooladmin") {
      feesStructureRes = await FeesStructure.getFeesStructureCreatedByUser(
        loggedInUserID
      );
    } else {
      result = "You are not authorized to see Schools Fees Type List data";
    }
    feesTypeRes = await FeesType.getFeesTypeBySchool(schoolID);
    if (feesStructureRes.length > 0 && feesTypeRes.length > 0) {
      const feesTypeMap = feesTypeRes.reduce((acc, fee) => {
        acc[fee.feesTypeID] = fee;
        return acc;
      }, {});
      const feesStructureWithFeesType = feesStructureRes.map(
        (feesStructure) => {
          const feesWithDetails = feesStructure.feesInStructure.map(
            (feesTypeID) => feesTypeMap[feesTypeID] || feesTypeID
          );
          const totalAmount = feesWithDetails.reduce((sum, fee) => {
            return typeof fee === "object" && fee.amount
              ? sum + fee.amount
              : sum;
          }, 0);
          return {
            ...feesStructure,
            feesInStructure: feesWithDetails,
            totalAmount,
          };
        }
      );
      result = feesStructureWithFeesType;
      result.sort((group1, group2) =>
        group1.groupName.localeCompare(group2.groupName)
      );
    }
    if (result) setFeesStructureListData(result);
  };
  useEffect(() => {
    fetchSchoolFeesStructureList();
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
          onClick={() => handleModalOpen("Add Fees Structure")}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition justify-end"
        >
          Add Fees Structure
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="text-center mb-2">
          <span className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
            Fees Structure List
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
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Amount
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
                  {feesStructureListData?.map((list, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.academicYear}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.groupName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.dueDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        &#8377;
                        {list && list?.totalAmount !== undefined
                          ? list?.totalAmount
                              .toString()
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                          : "0"}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-indigo-600 hover:dark:text-white"
                          onClick={() =>
                            handleModalOpen(
                              "Edit Fees Structure",
                              list?.feesStructureID && list
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(list?.feesStructureID)}
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
        <AddFeesStructureType
          handleModalClose={handleModalClose}
          title={title}
          fetchSchoolFeesStructureList={fetchSchoolFeesStructureList}
        />
      </Modal>
      <DeleteModal
        modalType="Fees Structure data"
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
