"use client";
import { useTheme } from "@/context/themeContext";
import { useEffect, useState } from "react";
import DeleteModal from "../ui/deleteModal";
import Link from "next/link";
import Modal from "../ui/modal";
import AddAcademicHoliday from "../addAcademicHoliday";
import { Holiday } from "@/firestore/documents/holiday";

export default function AcademicHolidayList() {
  const [holidayListData, setHolidayListData] = useState([]);
  const [selectedHolidayID, setSelectedHolidayID] = useState(null);
  const [academicYear, setAcademicYear] = useState("");

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
      const academicYear = JSON.parse(localStorage.getItem("academicYear")) || "NA";
      setSchoolID(schoolID);
      setUserType(userType);
      setLoggedInUserID(loggedInUserID);
      setAcademicYear(academicYear);
    }
  }, []);

  const handleDelete = (id) => {
    setSelectedHolidayID(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedHolidayID) {
      setHolidayListData(
        holidayListData?.filter(
          (item) => item?.feesTypeID !== selectedHolidayID
        )
      );

      await Holiday.deleteHoliday(selectedHolidayID);
      setIsDeleteModalOpen(false);
      setSelectedHolidayID(null);
    }
  };

  const fetchHolidayList = async () => {
    let result;
    if (userType === "superadmin") {
      result = await Holiday.getHolidayBySchool(schoolID, academicYear);
    } else if (userType === "schooladmin") {
      result = await Holiday.getHolidayCreatedByUser(loggedInUserID);
    } else {
      result = "You are not authorized to view Schools Academic Holiday data";
    }
    if (Array.isArray(result)) result?.sort((day1, day2) => day1?.occasion.localeCompare(day2?.occasion));
    if (result) setHolidayListData(result);
  };
  useEffect(() => {
    fetchHolidayList();
  }, [loggedInUserID, schoolID, userType, academicYear]);

  return (
    <>
      <div className="max-sm:text-center">
        <Link href={`/dashboard/schools/${schoolID}`}>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            &larr; Back
          </button>
        </Link>
      </div>
      <div className="flex justify-end w-full mb-2">
        <button
          onClick={() => handleModalOpen("Add Academic Holiday")}
          type="button"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition justify-end"
        >
          Add Academic Holiday
        </button>
      </div>
      <div className="mt-8 flow-root">
        <div className="text-center mb-2">
          <span className="text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
            Academic Holiday
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
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Occasion / Event
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Day of Week
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Holiday / Start Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      End Date
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
                  {holidayListData?.map((list, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.academicYear}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.occasion}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.dayOfWeek}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-white sm:pl-6">
                        {list?.holidayType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.holidayDate}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                        {list?.endDate}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          className="text-indigo-600 hover:dark:text-white"
                          onClick={() =>
                            handleModalOpen(
                              "Edit Academic Holiday",
                              list?.holidayID && list
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(list?.holidayID)}
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
        <AddAcademicHoliday
          handleModalClose={handleModalClose}
          title={title}
          fetchHolidayList={fetchHolidayList}
        />
      </Modal>
      <DeleteModal
        modalType="Academic Holiday Data"
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
