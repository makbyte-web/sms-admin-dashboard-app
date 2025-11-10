"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { Standards } from "@/firestore/documents/standard";
import { standards } from "@/defaults";

const AddStandard = ({ handleModalClose, title, fetchSchoolStandardList }) => {
  const stdList = [];
  Object.keys(standards).forEach((standard) =>
    stdList.push(standards[standard])
  );

  const stdNameRef = useRef();

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
      setSchoolName(schoolName);
      setSchoolID(schoolID);
    }
  }, []);

  const [defaultStd, setDefaultStd] = useState();
  const [stdCount, setStdCount] = useState(0);

  const [standardFormData, setStandardFormData] = useState({
    stdID: isEditing?.stdID || "",
    schoolID: isEditing?.schoolID || "",
    stdName: isEditing?.stdName || "",
  });

  useEffect(() => {
    async function fetchStdCount() {
      const result = await Standards.getStandardCountForSchool(schoolID);
      if (result) setStdCount(result);
      if (result === 0) setDefaultStd("yes");
    }
    fetchStdCount();
  }, [schoolID]);

  useEffect(() => {
    setStandardFormData({
      stdID: isEditing?.stdID || "",
      schoolID: isEditing?.schoolID || "",
      stdName: isEditing?.stdName || "",
    });
  }, [isEditing]);

  const handleStandardSelection = (event) => {
    const optionSelected = event.target.value;
    const StandardField = document.getElementById("StandardField");
    if (optionSelected === "no") {
      StandardField.style.display = "block";
    } else {
      StandardField.style.display = "none";
    }
    setDefaultStd(optionSelected);
  };

  const handleFormSubmit = async () => {
    if (defaultStd === "yes") {
      let newDefaultStd;
      Object.keys(standards).forEach(async (standard) => {
        newDefaultStd = new Standards(
          schoolID,
          standards[standard],
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newDefaultStd.addStandard();
        newDefaultStd = null;
      });
    } else {
      if (title === "Add Standard") {
        const newStandard = new Standards(
          schoolID,
          stdNameRef.current.value,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newStandard.addStandard();
      } else if (title === "Edit Standard") {
        const existingStandard = new Standards(
          schoolID,
          stdNameRef.current.value,
          isEditing.createdDate,
          isEditing.createdBy,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          isEditing.stdID
        );
        retval = await existingStandard.updateStandard();
      }
    }

    setStandardFormData({
      stdName: stdNameRef.current.value || "",
    });
    handleModalClose();
    fetchSchoolStandardList();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit Standard"
              ? "Edit Standard Details"
              : "Add Standard Details"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddModalOpen();
            }}
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
                  required
                  disabled
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* Default Standard Field */}
            <div className="mb-6">
              {stdCount <= 0 ? (
                <>
                  {/* Default Division Field */}
                  <label
                    htmlFor="defaultStd"
                    className="block text-lg font-semibold leading-6 text-gray-900 dark:text-indigo-400"
                  >
                    Add Default Standard :{" "}
                    <span className="wrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      {stdList.join(", ")}
                    </span>
                  </label>
                  {/* Radio Button - Section */}
                  <div className="mt-3 flex items-center space-x-8">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="defaultStd"
                        value="yes"
                        defaultChecked
                        onChange={handleStandardSelection}
                        className="text-indigo-600 focus:ring-indigo-600 h-4 w-4 border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-full"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600">
                        Yes
                      </span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="defaultStd"
                        value="no"
                        onChange={handleStandardSelection}
                        className="text-indigo-600 focus:ring-indigo-600 h-4 w-4 border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-full"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600">
                        No
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div
                    id="StandardField"
                    className={stdCount <= 0 ? "hidden" : "visible"}
                  >
                    <label
                      htmlFor="Standard"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Standard
                    </label>
                    <div className="mt-2">
                      <input
                        id="stdName"
                        name="stdName"
                        defaultValue={standardFormData.stdName}
                        type="text"
                        ref={stdNameRef}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                        placeholder="e.g KG, JR KG, SR KG, I, II .... X"
                      />
                    </div>
                  </div>
                </>
              )}
              {/* end of div mb-6 */}
            </div>

            {/* Standard Field */}
            <div id="StandardField" className="hidden">
              <label
                htmlFor="Standard"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Standard
              </label>
              <div className="mt-2">
                <input
                  id="stdName"
                  name="stdName"
                  defaultValue={standardFormData.stdName}
                  type="text"
                  ref={stdNameRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  placeholder="e.g KG, JR KG, SR KG, I, II .... X"
                />
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit Standard" ? "Edit" : "Add"}
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

export default AddStandard;
