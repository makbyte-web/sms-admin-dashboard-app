"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { Divisions } from "@/firestore/documents/division";
import { divisions } from "@/defaults";

const AddDivision = ({ handleModalClose, title, fetchSchoolDivisionsList }) => {
  const divList = [];
  Object.keys(divisions).forEach((division) =>
    divList.push(divisions[division])
  );

  const divNameRef = useRef();

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

  const [defaultDivVal, setDefaultDivVal] = useState();
  const [divCount, setDivCount] = useState(0);

  const [divisionFormData, setDivisionFormData] = useState({
    divID: isEditing?.divID || "",
    schoolID: isEditing?.schoolID || "",
    divName: isEditing?.divName || "",
  });

  useEffect(() => {
    async function fetchDivCount() {
      const result = await Divisions.getDivisionCountForSchool(schoolID);
      if (result) setDivCount(result);
      if (result === 0) setDefaultDivVal("yes");
    }
    fetchDivCount();
  }, []);

  useEffect(() => {
    setDivisionFormData({
      divID: isEditing?.divID || "",
      schoolID: isEditing?.schoolID || "",
      divName: isEditing?.divName || "",
    });
  }, [isEditing]);

  const handleDivisionSelection = (event) => {
    const optionSelected = event.target.value;
    const DivisionField = document.getElementById("DivisionField");
    if (optionSelected === "no") {
      DivisionField.style.display = "block";
    } else {
      DivisionField.style.display = "none";
    }
    setDefaultDivVal(optionSelected);
  };

  const handleFormSubmit = async () => {
    if (defaultDivVal === "yes") {
      let newDefaultDiv;
      Object.keys(divisions).forEach(async (division) => {
        newDefaultDiv = new Divisions(
          schoolID,
          divisions[division],
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newDefaultDiv.addDivision();
        newDefaultDiv = null;
      });
    } else {
      if (title === "Add Division") {
        const newDivision = new Divisions(
          schoolID,
          divNameRef.current.value,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newDivision.addDivision();
      } else if (title === "Edit Division") {
        const existingDivision = new Divisions(
          schoolID,
          divNameRef.current.value,
          isEditing.createdDate,
          isEditing.createdBy,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          isEditing.divID
        );
        retval = await existingDivision.updateDivision();
      }
    }

    setDivisionFormData({
      divName: divNameRef.current.value || "",
    });
    handleModalClose();
    fetchSchoolDivisionsList();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit Division"
              ? "Edit Division Details"
              : "Add Division Details"}
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

            <div className="mb-6">
              {divCount <= 0 ? (
                <>
                  {/* Default Division Field */}
                  <label
                    htmlFor="defaultDiv"
                    className="block text-lg font-semibold leading-6 text-gray-900 dark:text-indigo-400"
                  >
                    Add Default Division :{" "}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {divList.join(",")}
                    </span>
                  </label>
                  {/* Radio Button - Section */}
                  <div className="mt-3 flex items-center space-x-8">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="defaultDiv"
                        value="yes"
                        defaultChecked
                        onChange={handleDivisionSelection}
                        className="text-indigo-600 focus:ring-indigo-600 h-4 w-4 border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-full"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600">
                        Yes
                      </span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="defaultDiv"
                        value="no"
                        onChange={handleDivisionSelection}
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
                    id="DivisionField"
                    className={divCount <= 0 ? "hidden" : "visible"}
                  >
                    <label
                      htmlFor="Division"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Division
                    </label>
                    <div className="mt-2">
                      <input
                        id="divName"
                        defaultValue={divisionFormData?.divName}
                        name="divName"
                        type="text"
                        placeholder="e.g A, B, C, D .... "
                        ref={divNameRef}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                      />
                    </div>
                  </div>
                </>
              )}
              {/* end of div mb-6 */}
            </div>

            {/* Division Field */}
            <div id="DivisionField" className="hidden">
              <label
                htmlFor="Division"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Division
              </label>
              <div className="mt-2">
                <input
                  id="divName"
                  defaultValue={divisionFormData?.divName}
                  name="divName"
                  type="text"
                  placeholder="e.g A, B, C, D .... "
                  ref={divNameRef}
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
                {title === "Edit Division" ? "Edit" : "Add"}
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

export default AddDivision;
