"use client";
import { useEffect, useRef, useState } from "react";
import { academicYears } from "@/defaults";
import { useUserContext } from "@/context/UserContext";
import { SchoolSettings } from "@/firestore/documents/schoolSettings";
import { SuperAdminSettings } from "@/firestore/documents/superadminSettings";
import Header from "@/app/components/ui/header";

const Settings = () => {
  const currAcademicYearRef = useRef();

  const [schoolID, setSchoolID] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [exists, setExists] = useState(false);
  const [settings, setSettings] = useState(null);
  const [userType, setUserType] = useState(null);

  const { user } = useUserContext();

  let retval;
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

  useEffect(() => {
    async function fetchSchoolSettings() {
      const result = await SchoolSettings.getSchoolSettingsBySchool(schoolID);
      // const result = await SchoolSettings.getSchoolSettingsOwnedByUser(loggedInUserID)
      if (result && result.length) {
        setSettings(result[0]);
        setExists(true);
      }
    }

    async function fetchSuperAdminSettings() {
      const result = await SuperAdminSettings.getSuperAdminSettingsOwnedByUser(
        loggedInUserID
      );
      if (result && result.length) {
        setSettings(result[0]);
        setExists(true);
      }
    }

    if (userType === "schooladmin" && schoolID !== "") {
      fetchSchoolSettings();
    }

    if (userType === "superadmin" && loggedInUserID !== "NA") {
      fetchSuperAdminSettings();
    }
  }, [schoolID]);

  const handleSave = async (e) => {
    e.preventDefault();
    const academicYear = currAcademicYearRef.current.value;
    if (academicYear !== "Select Academic Year") {
      if (exists === true) {
        // update
        const updateNew = new SchoolSettings(
          schoolID,
          academicYear,
          settings?.createdDate,
          settings?.createdBy,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          settings?.schoolSettingsID
        );
        retval = await updateNew.updateSchoolSettings();
        if (retval) alert(`SchoolSettings updated with ID:${retval}`);
      } else {
        // add
        const addNew = new SchoolSettings(
          schoolID,
          academicYear,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await addNew.addSchoolSettings();
        if (retval) alert(`SchoolSettings added with ID:${retval}`);
      }
      // set localStorage
      localStorage.setItem(
        "academicYear",
        JSON.stringify(currAcademicYearRef.current.value)
      );
    } else {
      alert("Please Select Academic Year");
      return;
    }
  };

  const handleAdminSave = async (e) => {
    e.preventDefault();
    const academicYear = currAcademicYearRef.current.value;
    if (academicYear !== "Select Academic Year") {
      if (exists === true) {
        // update
        const updateNew = new SuperAdminSettings(
          academicYear,
          settings?.createdDate,
          settings?.createdBy,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          settings?.superadminSettingsID
        );
        retval = await updateNew.updateSuperAdminSettings();
        if (retval) alert(`SuperAdminSettings updated with ID:${retval}`);
      } else {
        // add
        const addNew = new SuperAdminSettings(
          academicYear,
          new Date().toLocaleDateString("en-IN"),
          loggedInUserID,
          "NA",
          "NA"
        );
        retval = await addNew.addSuperAdminSettings();
        if (retval) alert(`SuperAdminSettings added with ID:${retval}`);
      }
      // set localStorage
      localStorage.setItem("academicYear", JSON.stringify(currAcademicYearRef.current.value));
    } else {
      alert("Please Select Academic Year");
      return;
    }
  };

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <Header currentPage={"Settings"}></Header>
      {userType === "superadmin" ? (
        <div className="min-h-screen flex flex-col items-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Select and Save the Academic Year to view data of selected academic year for any school.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="group">
              <label
                htmlFor="currentAcademicYear"
                className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
              >
                Current Academic Year
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="currentAcademicYear"
                  name="currentAcademicYear"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer"
                  ref={currAcademicYearRef}
                  required
                >
                  <option value="Select Academic Year" disabled>
                    Select Academic Year
                  </option>
                  {exists === true
                    ? academicYears?.map((item, idx) => (
                      <option
                        key={`academic-opt-${idx}`}
                        value={item}
                        selected={settings?.currentAcademicYear === item}
                      >
                        {item}
                      </option>
                    ))
                    : academicYears?.map((item, idx) => (
                      <option key={`academic-opt-${idx}`} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={(event) => handleAdminSave(event)}
                type="button"
                className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      exists
                        ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                    }
                  />
                </svg>
                {exists ? "Update Academic Year" : "Add Academic Year"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-xl space-y-4">
          {/* School ID Field */}
          <div className="group">
            <label
              htmlFor="schoolID"
              className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
            >
              School ID
            </label>
            <div className="relative">
              <input
                id="schoolID"
                name="schoolID"
                type="text"
                defaultValue={schoolID}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 shadow-sm focus:outline-none sm:text-sm cursor-not-allowed opacity-60"
                disabled
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* School Name Field */}
          <div className="group">
            <label
              htmlFor="schoolName"
              className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
            >
              School Name
            </label>
            <div className="relative">
              <input
                id="schoolName"
                name="schoolName"
                type="text"
                defaultValue={schoolName}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 shadow-sm focus:outline-none sm:text-sm cursor-not-allowed opacity-60"
                disabled
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Academic Year Field */}
          <div className="group">
            <label
              htmlFor="currentAcademicYear"
              className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
            >
              Current Academic Year
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                id="currentAcademicYear"
                name="currentAcademicYear"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer"
                ref={currAcademicYearRef}
                required
              >
                <option value="Select Academic Year" disabled>
                  Select Academic Year
                </option>
                {exists === true
                  ? academicYears?.map((item, idx) => (
                    <option
                      key={`academic-opt-${idx}`}
                      value={item}
                      selected={settings?.currentAcademicYear === item}
                    >
                      {item}
                    </option>
                  ))
                  : academicYears?.map((item, idx) => (
                    <option key={`academic-opt-${idx}`} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={(event) => handleSave(event)}
              type="button"
              className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    exists
                      ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      : "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 0V4a2 2 0 00-6 0v3m-1 0h8m-8 0V4a2 2 0 016 0v3"
                  }
                />
              </svg>
              {exists ? "Update Settings" : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
