"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { FeesType } from "@/firestore/documents/feesType";

const AddFeesType = ({ handleModalClose, title, fetchSchoolsTypeList }) => {
  const feesTypeRef = useRef();
  const amountRef = useRef();

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

  const [feesTypeFormData, setFeesTypeFormData] = useState({
    feesTypeID: isEditing?.feesTypeID || "",
    feesType: isEditing?.feesType || "",
    amount: parseInt(isEditing?.amount) || "",
  });

  useEffect(() => {
    setFeesTypeFormData({
      feesTypeID: isEditing?.feesTypeID || "",
      feesType: isEditing?.feesType || "",
      amount: parseInt(isEditing?.amount) || "",
    });
  }, [isEditing]);

  const handleFeesSelection = (event) => {
    const feeValue = event.target.value;
    const confirmFeesTypeField = document.getElementById("confirmfeesType");
    if (feeValue === "Others") {
      confirmFeesTypeField.style.display = "block";
    } else {
      confirmFeesTypeField.style.display = "none";
    }
    feesTypeRef.current.value = feeValue;
  };

  const handleFormSubmit = async () => {
    if (title === "Add Fees Type") {
      const newFeesType = new FeesType(
        schoolID,
        feesTypeRef.current.value,
        parseInt(amountRef.current.value),
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA"
      );
      retval = await newFeesType.addFeesType();
    } else if (title === "Edit Fees Type") {
      const existingFeesType = new FeesType(
        schoolID,
        feesTypeRef.current.value,
        parseInt(amountRef.current.value),
        isEditing.createdDate,
        isEditing.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing.feesTypeID
      );
      retval = await existingFeesType.updateFeesType();
    }

    setFeesTypeFormData({
      feesType: feesTypeRef.current.value || "",
      amount: parseInt(amountRef.current.value) || "",
    });
    handleModalClose();
    fetchSchoolsTypeList();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit Fees Type"
              ? "Edit Fees Type Details"
              : "Add Fees Type Details"}
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
            {/* School ID Field */}
            <div className="hidden">
              <label
                htmlFor="schoolID"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                School ID
              </label>
              <div className="mt-2">
                <input
                  id="schoolID"
                  name="schoolID"
                  type="text"
                  defaultValue={schoolID}
                  placeholder="e.g x32xx"
                  required
                  disabled
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* School Name Field */}
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

            {/* Fees Type Field */}
            <div>
              <label
                htmlFor="feesType"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Fees Type
              </label>

              {title === "Edit Fees Type" ? (
                <>
                  <div className="mt-2">
                    <input
                      id="confirmfeesType"
                      name="confirmfeesType"
                      type="text"
                      defaultValue={feesTypeFormData?.feesType}
                      ref={feesTypeRef}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                      disabled
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-2">
                    <select
                      id="feesType"
                      name="feesType"
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                      onChange={handleFeesSelection}
                      ref={feesTypeRef}
                      required
                    >
                      <option value="Select">Select Fees Type</option>
                      <option value="Computer">Computer</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                      <option value="Picnic">Picnic</option>
                      <option value="Sports">Sports</option>
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Tuition Fee">Tuition Fee</option>
                      <option value="Uniform">Uniform</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Confirm Fees Type Field */}
                  <div className="mt-2">
                    <input
                      id="confirmfeesType"
                      name="confirmfeesType"
                      type="text"
                      placeholder="e.g Enter Specific Fee Type"
                      ref={feesTypeRef}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4 hidden"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Amount Field */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Amount
              </label>
              <div className="mt-2">
                <input
                  id="amount"
                  defaultValue={feesTypeFormData?.amount}
                  name="amount"
                  type="text"
                  placeholder="e.g 1200rs"
                  required
                  ref={amountRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit Fees Type" ? "Edit" : "Add"}
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
          mode="feesType"
        />
      )}
    </>
  );
};

export default AddFeesType;
