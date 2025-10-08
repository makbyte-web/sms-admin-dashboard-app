"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { FeesType } from "@/firestore/documents/feesType";
import { FeesStructure } from "@/firestore/documents/feesStructure";

const AddFeesStructureType = ({
  handleModalClose,
  title,
  fetchSchoolFeesStructureList,
}) => {
  const academicYearRef = useRef();
  const groupNameRef = useRef();
  const dueDateRef = useRef();

  const [feesType, setFeesType] = useState([]);
  const {
    isEditing,
    handleAddModalOpen,
    handleAddModalClose,
    isAddModalOpen,
    userType,
    setUserType,
    schoolName,
    setSchoolName,
    schoolID,
    setSchoolID,
  } = useTheme();
  const { user } = useUserContext();

  let retval;

  const [listOfFeesGroup, setListOfFeesGroup] = useState([]);

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

  const [feesStructureFormData, setFeesStructureFormData] = useState({
    academicYear: isEditing?.academicYear || "",
    groupName: isEditing?.groupName || "",
    feesInStructure:
      isEditing?.feesInStructure?.map((fee) => fee.feesTypeID) || [],
    dueDate: isEditing?.dueDate || "",
  });

  // Update form data when editing mode is enabled
  useEffect(() => {
    setFeesStructureFormData({
      academicYear: isEditing?.academicYear || "",
      groupName: isEditing?.groupName || "",
      feesInStructure:
        isEditing?.feesInStructure?.map((fee) => fee.feesTypeID) || [],
      dueDate: isEditing?.dueDate || "",
    });
    setListOfFeesGroup(
      isEditing?.feesInStructure?.map((fee) => fee.feesTypeID) || []
    );
  }, [isEditing]);

  useEffect(() => {
    async function fetchFeesType() {
      let result = [];
      if (userType === "superadmin") {
        result = await FeesType.getFeesTypeBySchool(schoolID);
      } else if (userType === "schooladmin") {
        result = await FeesType.getFeesTypeCreatedByUser(loggedInUserID);
      }
      result.sort((fee1, fee2) => fee1.feesType.localeCompare(fee2.feesType));
      if (result) setFeesType(result);
    }
    fetchFeesType();
  }, [loggedInUserID, schoolID, userType]);

  const handleFeesGroupVal = (e) => {
    const selectedValue = e.target.value;
    setListOfFeesGroup((prev) => {
      if (prev.includes(selectedValue)) {
        return prev.filter((item) => item !== selectedValue);
      } else {
        return [...prev, selectedValue];
      }
    });
  };

  const handleFormSubmit = async () => {
    if (title === "Add Fees Structure") {
      const newFeesStructure = new FeesStructure(
        schoolID,
        academicYearRef.current.value,
        groupNameRef.current.value,
        listOfFeesGroup,
        dueDateRef.current.value,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA"
      );
      retval = await newFeesStructure.addFeesStructure();
    } else if (title === "Edit Fees Structure") {
      const existsingFeesStructure = new FeesStructure(
        schoolID,
        academicYearRef.current.value,
        groupNameRef.current.value,
        listOfFeesGroup,
        dueDateRef.current.value,
        isEditing.createdDate,
        isEditing.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing.feesStructureID
      );
      retval = await existsingFeesStructure.updateFeesStructure();
    }

    handleModalClose();
    fetchSchoolFeesStructureList();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit Fees Structure"
              ? "Edit Fees Structure Details"
              : "Add Fees Structure Details"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddModalOpen();
            }}
            method="POST"
            className="space-y-6"
          >
            <div className="hidden">
              <label
                htmlFor="schoolName"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                School
              </label>
              <div className="mt-2">
                <input
                  id="schoolName"
                  name="schoolName"
                  defaultValue={schoolName}
                  type="text"
                  placeholder="e.g Banegar English High School"
                  required
                  disabled
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
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
                  defaultValue={feesStructureFormData?.academicYear}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="groupName"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Group Name
              </label>
              <div className="mt-2">
                <input
                  id="groupName"
                  name="groupName"
                  type="text"
                  placeholder="e.g Annual"
                  ref={groupNameRef}
                  defaultValue={feesStructureFormData?.groupName}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>

            <fieldset onChange={handleFeesGroupVal}>
              <legend className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                Fees in Group
              </legend>
              <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-600 border-b border-t border-gray-200 dark:border-gray-600 h-40 overflow-y-auto custom-scrollbar">
                {feesType?.map((option, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-start py-4 pr-3"
                  >
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label
                        htmlFor={`option-${option?.feesTypeID}`}
                        className="select-none font-medium text-gray-900 dark:text-gray-100"
                      >
                        {option?.feesType}
                      </label>
                    </div>
                    <div className="ml-3 flex h-6 items-center">
                      <input
                        id={`option-${option?.feesTypeID}`}
                        name={`option-${option?.feesTypeID}`}
                        type="checkbox"
                        value={option?.feesTypeID}
                        defaultChecked={listOfFeesGroup.includes(
                          option?.feesTypeID
                        )}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Due Date
              </label>
              <div className="mt-2">
                <input
                  id="dueDate"
                  name="dueDate"
                  type="text"
                  placeholder="e.g Date in MM/DD/YYYY"
                  required
                  ref={dueDateRef}
                  defaultValue={feesStructureFormData?.dueDate}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit Fees Structure"
                  ? "Update Fees Structure"
                  : "Add Fees Structure"}
              </button>
              <button
                onClick={handleModalClose}
                type="button"
                className=" inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      {isAddModalOpen && (
        <AddModal
          open={isAddModalOpen}
          onClose={() => handleAddModalClose()}
          title={title}
          onConfirm={handleFormSubmit}
        />
      )}
    </>
  );
};

export default AddFeesStructureType;
