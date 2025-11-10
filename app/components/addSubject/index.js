"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { Subjects } from "@/firestore/documents/subject";
import { subjects } from "@/defaults";

const AddSubject = ({ handleModalClose, title, fetchSchoolSubjectList }) => {
  const subNameRef = useRef();
  
  const [defaultSub, setDefaultSub] = useState();
  const [subCount, setSubCount] = useState(0);
  
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
  
  let retval;
  const { user } = useUserContext();
  const loggedInUserID = user?.uid ? user?.uid : "NA";
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const schoolName = JSON.parse(localStorage.getItem("schoolName")) || "NA";
      setSchoolName(schoolName);
      setSchoolID(schoolID);
    }
  }, []);


  const [subjectFormData, setSubjectFormData] = useState({
    subID: isEditing?.subID || "",
    schoolID: isEditing?.schoolID || "",
    subName: isEditing?.subName || "",
  });

  useEffect(() => {
    async function fetchSubCount() {
      const result = await Subjects.getSubjectCountForSchool(schoolID);
      if (result) setSubCount(result);
      if (result === 0) setDefaultSub("yes");
    }
    fetchSubCount();
  }, [schoolID]);

  useEffect(() => {
    setSubjectFormData({
      subID: isEditing?.subID || "",
      schoolID: isEditing?.schoolID || "",
      subName: isEditing?.subName || "",
    });
  }, [isEditing]);

  const handleSubjectSelection = (event) => {
    const optionSelected = event.target.value;
    const SubjectField = document.getElementById("SubjectField");
    if (optionSelected === "no") {
      SubjectField.style.display = "block";
    } else {
      SubjectField.style.display = "none";
    }
    setDefaultSub(optionSelected);
  };

  const handleFormSubmit = async () => {
    if (defaultSub === "yes") {
      let newDefaultSubs;
      subjects.forEach(async (subject) => {
        newDefaultSubs = new Subjects(
          schoolID,
          subject,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newDefaultSubs.addSubject();
        newDefaultSubs = null;
      });
    } else {
      if (title === "Add Subject") {
        const newSubject = new Subjects(
          schoolID,
          subNameRef.current.value,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await newSubject.addSubject();
      } else if (title === "Edit Subject") {
        const existingSubject = new Subjects(
          schoolID,
          subNameRef.current.value,
          isEditing.createdDate,
          isEditing.createdBy,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          isEditing.subID
        );
        retval = await existingSubject.updateSubject();
      }
    }

    setSubjectFormData({
      subName: subNameRef.current.value || "",
    });

    handleModalClose();
    fetchSchoolSubjectList();
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
              {subCount <= 0 ? (
                <>
                  <label
                    htmlFor="defaultSub"
                    className="block text-lg font-semibold leading-6 text-gray-900 dark:text-indigo-400"
                  >
                    Add Default Subject :{" "}
                    <span className="wrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      {subjects.join(", ")}
                    </span>
                  </label>
                  {/* Radio Button - Section */}
                  <div className="mt-3 flex items-center space-x-8">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="defaultSub"
                        value="yes"
                        defaultChecked
                        onChange={handleSubjectSelection}
                        className="text-indigo-600 focus:ring-indigo-600 h-4 w-4 border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-full"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600">
                        Yes
                      </span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="defaultSub"
                        value="no"
                        onChange={handleSubjectSelection}
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
                    id="SubjectField"
                    className={subCount <= 0 ? "hidden" : "visible"}
                  >
                    <label
                      htmlFor="Subject"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Subject
                    </label>
                    <div className="mt-2">
                      <input
                        id="subName"
                        name="subName"
                        defaultValue={subjectFormData.subName}
                        type="text"
                        ref={subNameRef}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                        placeholder="e.g English, Hindi, Marathi ...."
                      />
                    </div>
                  </div>
                </>
              )}
              {/* end of div mb-6 */}
            </div>

            {/* Subject Field */}
            <div id="SubjectField" className="hidden">
              <label
                htmlFor="Subject"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Subject
              </label>
              <div className="mt-2">
                <input
                  id="subName"
                  name="subName"
                  defaultValue={subjectFormData.subName}
                  type="text"
                  ref={subNameRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  placeholder="e.g English, Hindi, Marathi ...."
                />
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit Subject" ? "Edit" : "Add"}
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

export default AddSubject;
