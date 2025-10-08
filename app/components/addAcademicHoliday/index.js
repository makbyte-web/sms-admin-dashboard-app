"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { Holiday } from "@/firestore/documents/holiday";
import { daysOfWeek, holidaysType } from "@/defaults";
import { getFormatedDate } from "@/lib/utils";

const AddAcademicHoliday = ({ handleModalClose, title, fetchHolidayList }) => {
  const academicYearRef = useRef();
  const occasionRef = useRef();
  const dayOfWeekRef = useRef();
  const holidayTypeRef = useRef();
  const holidayDateRef = useRef();
  const endDateRef = useRef();

  const {
    isEditing,
    handleAddModalOpen,
    handleAddModalClose,
    isAddModalOpen,
    schoolName,
    setSchoolName,
    schoolID,
    setSchoolID,
  } = useTheme();
  const { user } = useUserContext();

  let retval;
  const loggedInUserID = user?.uid ? user?.uid : "NA";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const schoolName = JSON.parse(localStorage.getItem("schoolName")) || "NA";
      setSchoolID(schoolID);
      setSchoolName(schoolName);
    }
  }, []);

  const [academicHolidayData, setAcademicHolidayData] = useState({
    academicYear: isEditing?.academicYear || "",
    occasion: isEditing?.occasion || "",
    dayOfWeek: isEditing?.dayOfWeek || "",
    holidayType: isEditing?.holidayType || "",
    holidayDate: isEditing?.holidayDate || "",
    endDate: isEditing?.endDate || "",
  });

  useEffect(() => {
    setAcademicHolidayData({
      academicYear: isEditing?.academicYear || "",
      occasion: isEditing?.occasion || "",
      dayOfWeek: isEditing?.dayOfWeek || "",
      holidayType: isEditing?.holidayType || "",
      holidayDate: isEditing?.holidayDate || "",
      endDate: isEditing?.endDate || "",
    });
  }, [isEditing]);

  const handleFormSubmit = async () => {
    let valid = false;
    let msg = "";
    let start = holidayDateRef.current.value;
    let end = endDateRef.current.value;
    const startDt = getFormatedDate(start);
    const endDt = getFormatedDate(end);

    if (start === "NA" && end === "NA") {
      msg = "";
      valid = start === "NA" && end === "NA";
    } else if (start !== "NA" && startDt !== "Invalid Date" && end === "NA") {
      msg = `Holiday / Start date: ${start} should be in dd/mm/yyyy format or End date: ${endDt} is neither in valid dd/mm/yyyy format nor NA`;
      valid = start !== "NA" && startDt !== "Invalid Date" && end === "NA";
    } else if (
      start !== "NA" &&
      startDt !== "Invalid Date" &&
      end !== "NA" &&
      endDt !== "Invalid Date"
    ) {
      msg = `Holiday / Start date: ${startDt} should be less than End date: ${endDt}`;
      valid = startDt < endDt;
    } else {
      msg = `Holiday / Start date: ${start} or End date: ${end} should be a date in dd/mm/yyyy format or NA`;
      valid = false;
    }

    if (valid) {
      if (title === "Add Academic Holiday") {
        const newHoliday = new Holiday(
          schoolID,
          academicYearRef.current.value,
          occasionRef.current.value,
          dayOfWeekRef.current.value,
          holidayTypeRef.current.value,
          holidayDateRef.current.value,
          endDateRef.current.value,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newHoliday.addHoliday();
        // console.log(`Holiday added ${retval}`)
      } else if (title === "Edit Academic Holiday") {
        const existingHoliday = new Holiday(
          schoolID,
          academicYearRef.current.value,
          occasionRef.current.value,
          dayOfWeekRef.current.value,
          holidayTypeRef.current.value,
          holidayDateRef.current.value,
          endDateRef.current.value,
          isEditing.createdDate,
          isEditing.createdBy,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          isEditing.holidayID
        );
        retval = await existingHoliday.updateHoliday();
      }

      setAcademicHolidayData({
        academicYear: academicYearRef.current.value || "",
        occasion: occasionRef.current.value || "",
        dayOfWeek: dayOfWeekRef.current.value || "",
        holidayType: holidayTypeRef.current.value || "",
        holidayDate: holidayDateRef.current.value || "",
        endDate: endDateRef.current.value || "",
      });
      handleModalClose();
      fetchHolidayList();
    } else {
      alert(msg);
      return;
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit Academic Holiday"
              ? "Edit Academic Holiday"
              : "Add Academic Holiday"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddModalOpen();
            }}
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="academicYear"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Academic Year
              </label>
              <div className="mt-2">
                <input
                  id="academicYear"
                  name="academicYear"
                  type="text"
                  placeholder="e.g 2024-25"
                  ref={academicYearRef}
                  defaultValue={isEditing?.academicYear}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="occasion"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Occasion / Event
              </label>
              <div className="mt-2">
                <input
                  id="occasion"
                  name="occasion"
                  type="text"
                  placeholder="e.g Indepdence Day"
                  ref={occasionRef}
                  defaultValue={academicHolidayData?.occasion}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>
            {/* dayOfWeek dropdown */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="dayOfWeek"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Day of the Week (Select Duration for break and vacation)
                </label>
              </div>
              <div className="mt-2">
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  ref={dayOfWeekRef}
                  required
                >
                  <option value="Select">Select Day</option>
                  {title === "Edit Academic Holiday"
                    ? daysOfWeek.map((item, idx) => {
                        return (
                          <option
                            key={`day-opt-${idx}`}
                            value={item}
                            selected={
                              academicHolidayData.dayOfWeek === item
                                ? true
                                : false
                            }
                          >
                            {item}
                          </option>
                        );
                      })
                    : daysOfWeek.map((item, idx) => {
                        return (
                          <option key={`day-opt-${idx}`} value={item}>
                            {item}
                          </option>
                        );
                      })}
                </select>
              </div>
            </div>
            {/* holidayType dropdown */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="holidayType"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Type
                </label>
              </div>
              <div className="mt-2">
                <select
                  id="holidayType"
                  name="holidayType"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  ref={holidayTypeRef}
                  required
                >
                  <option value="Select">Select Holiday Type</option>
                  {title === "Edit Academic Holiday"
                    ? holidaysType.map((item, idx) => {
                        return (
                          <option
                            key={`type-opt-${idx}`}
                            value={item}
                            selected={
                              academicHolidayData.holidayType === item
                                ? true
                                : false
                            }
                          >
                            {item}
                          </option>
                        );
                      })
                    : holidaysType.map((item, idx) => {
                        return (
                          <option key={`type-opt-${idx}`} value={item}>
                            {item}
                          </option>
                        );
                      })}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="holidayDate"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Holiday / Start Date of vacation (If No date assgined then type
                NA, enter date without zeros Eg: 5/5/2025 indicates 5th May
                2025)
              </label>
              <div className="mt-2">
                <input
                  id="holidayDate"
                  name="holidayDate"
                  type="text"
                  placeholder="e.g dd/mm/yyyy | NA"
                  ref={holidayDateRef}
                  defaultValue={academicHolidayData?.holidayDate}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                End Date of vacation (If No date assgined then type NA, enter
                date without zeros Eg: 5/5/2025 indicates 5th May 2025)
              </label>
              <div className="mt-2">
                <input
                  id="endDate"
                  name="endDate"
                  type="text"
                  placeholder="e.g dd/mm/yyyy | NA"
                  ref={endDateRef}
                  defaultValue={academicHolidayData?.endDate}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit Academic Holiday" ? "Edit" : "Add"}
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isAddModalOpen && (
        <AddModal
          open={isAddModalOpen}
          onClose={handleAddModalClose}
          onConfirm={handleFormSubmit}
          mode="academicHoliday"
        />
      )}
    </>
  );
};

export default AddAcademicHoliday;
