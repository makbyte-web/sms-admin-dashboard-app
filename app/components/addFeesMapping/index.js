"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { FeesStructure } from "@/firestore/documents/feesStructure";
import { FeesMapping } from "@/firestore/documents/feesMapping";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import { Students } from "@/firestore/documents/student";

const AddFeesMapping = ({
  handleModalClose,
  title,
  fetchSchoolFeesMappingList,
}) => {
  const academicYearRef = useRef();
  const assignToRef = useRef();
  const assigneeIDRef = useRef();

  const [standard, setStandard] = useState([]);
  const [students, setStudents] = useState([]);

  const [selStudent, setSelStudent] = useState(false);

  const [feesStructure, setFeesStructure] = useState([]);
  const {
    isEditing,
    schoolID,
    setSchoolID,
    handleAddModalOpen,
    handleAddModalClose,
    isAddModalOpen,
    userType,
    setUserType,
  } = useTheme();

  const { user } = useUserContext();
  const [schoolName, setSchoolName] = useState(null);
  let retval;

  const [listOfAssignedGroups, setListOfAssignedGroups] = useState([]);

  const loggedInUserID = user && user?.uid;

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

  const [feesMapFormData, setFeesMapFormData] = useState({
    academicYear: isEditing?.academicYear || "",
    assignTo: isEditing?.assignTo || "",
    assigneeID: isEditing?.assigneeID || "",
    assignedGroups:
      isEditing?.assignedGroups?.map((feesStructureID) => feesStructureID) ||
      [],
  });

  useEffect(() => {
    setFeesMapFormData({
      academicYear: isEditing?.academicYear || "",
      assignTo: isEditing?.assignTo || "",
      assigneeID: isEditing?.assigneeID || "",
      assignedGroups:
        isEditing?.assignedGroups?.map((feesStructureID) => feesStructureID) ||
        [],
    });
    setListOfAssignedGroups(
      isEditing?.assignedGroups?.map((feesStructureID) => feesStructureID) || []
    );
    setSelStudent(isEditing?.assignTo === "Student" ? true : false);
  }, [isEditing]);

  useEffect(() => {
    let result;
    async function fetchStdDivStudents() {
      const stdResult = await Standards.getStandardsBySchool(schoolID);

      const divResult = await Divisions.getDivisionsBySchool(schoolID);
      const studentsRes = await Students.getStudentsBySchool(schoolID);
      stdResult?.sort((std1, std2) =>
        std1?.stdName?.localeCompare(std2?.stdName)
      );
      divResult?.sort((div1, div2) =>
        div1?.divName?.localeCompare(div2?.divName)
      );
      if (studentsRes?.length > 0) {
        const standardMap = stdResult?.reduce((acc, std) => {
          acc[std?.stdID] = std?.stdName;
          return acc;
        }, {});
        const divisionMap = divResult?.reduce((acc, div) => {
          acc[div?.divID] = div?.divName;
          return acc;
        }, {});
        const studentsWithStdDiv = studentsRes?.map((student) => {
          return {
            ...student,
            stdName: standardMap[student?.stdID],
            divName: divisionMap[student?.divID],
          };
        });
        result = studentsWithStdDiv;
      }

      if (stdResult) setStandard(stdResult);
      // if (divResult) setDivision(divResult);

      if (result) setStudents(result);
    }
    fetchStdDivStudents();
  }, []);

  useEffect(() => {
    async function fetchFeesStructure() {
      let result = [];

      console.log(
        "helllo",
        userType === "schooladmin",
        userType,
        "schooladmin"
      );

      if (userType === "superadmin") {
        result = await FeesStructure.getFeesStructureBySchool(schoolID);
      } else if (userType === "schooladmin") {
        console.log("result fees structure");
        result = await FeesStructure.getFeesStructureCreatedByUser(
          loggedInUserID
        );
      }
      result?.sort((group1, group2) =>
        group1?.groupName?.localeCompare(group2?.groupName)
      );

      if (result) setFeesStructure(result);
    }
    fetchFeesStructure();
  }, [loggedInUserID]);

  const handleFeesGroupVal = (e) => {
    const selectedValue = e.target.value;
    setListOfAssignedGroups((prev) => {
      if (prev.includes(selectedValue)) {
        return prev.filter((item) => item !== selectedValue);
      } else {
        return [...prev, selectedValue];
      }
    });
  };

  const handleAssignToSelection = (event) => {
    const assignToValue = event.target.value;
    const assigneeIDLabelFeild = document.getElementById("assigneeIDLabel");
    assigneeIDLabelFeild.innerText = assignToValue;
    if (assignToValue === "Class") {
      setSelStudent(false);
    } else {
      setSelStudent(true);
    }
  };

  const handleFormSubmit = async () => {
    if (title === "Add Fees Mapping") {
      const newFeesMapping = new FeesMapping(
        schoolID,
        academicYearRef?.current.value,
        assignToRef?.current.value,
        assigneeIDRef?.current.value,
        listOfAssignedGroups,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA"
      );
      retval = await newFeesMapping.addFeesMapping();
    } else if (title === "Edit Fees Mapping") {
      const existsingFeesMapping = new FeesMapping(
        schoolID,
        academicYearRef.current.value,
        assignToRef.current.value,
        assigneeIDRef.current.value,
        listOfAssignedGroups,
        isEditing.createdDate,
        isEditing.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing.feesMapID
      );
      retval = await existsingFeesMapping.updateFeesMapping();
    }

    handleModalClose();
    fetchSchoolFeesMappingList();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit Fees Mapping"
              ? "Edit Fees Mapping Details"
              : "Add Fees Mapping Details"}
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
                  defaultValue={feesMapFormData?.academicYear}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="assignTo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Fees Assigned To
              </label>
              <div className="mt-2">
                <select
                  id="assignTo"
                  name="assignTo"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  onChange={handleAssignToSelection}
                  ref={assignToRef}
                  required
                >
                  {title === "Edit Fees Mapping" &&
                  isEditing?.assignTo === "Student" ? (
                    <>
                      <option value="Class">Class</option>
                      <option value="Student" selected>
                        Student
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="Class" selected>
                        Class
                      </option>
                      <option value="Student">Student</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="assigneeIDLabel"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                id="assigneeIDLabel"
              >
                Class
              </label>
              <div className="mt-2">
                <select
                  id="assigneeID"
                  name="assigneeID"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  ref={assigneeIDRef}
                  required
                >
                  {!selStudent ? (
                    <>
                      <option value="Select">Select Standard</option>
                      {title === "Edit Fees Mapping"
                        ? standard &&
                          standard?.length &&
                          standard?.map((item) => {
                            return (
                              <option
                                key={item?.stdID}
                                value={item?.stdID}
                                selected={
                                  isEditing?.assigneeID === item?.stdID
                                    ? true
                                    : false
                                }
                              >
                                {item?.stdName}
                              </option>
                            );
                          })
                        : standard &&
                          standard.length &&
                          standard.map((item) => {
                            return (
                              <option key={item?.stdID} value={item?.stdID}>
                                {item?.stdName}
                              </option>
                            );
                          })}
                    </>
                  ) : (
                    <>
                      <option value="Select">Select Student</option>
                      {title === "Edit Fees Mapping"
                        ? students &&
                          students?.length &&
                          students?.map((item) => {
                            return (
                              <option
                                key={item?.studentID}
                                value={item?.studentID}
                                selected={
                                  isEditing.assigneeID === item?.studentID
                                    ? true
                                    : false
                                }
                              >
                                {item?.studentName} ({item?.stdName}
                                {item?.divName})
                              </option>
                            );
                          })
                        : students &&
                          students?.length &&
                          students.map((item) => {
                            return (
                              <option
                                key={item?.studentID}
                                value={item?.studentID}
                              >
                                {item?.studentName} ({item?.stdName}
                                {item?.divName})
                              </option>
                            );
                          })}
                    </>
                  )}
                </select>
              </div>
            </div>

            <fieldset onChange={handleFeesGroupVal}>
              <legend className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                Fees Group
              </legend>
              <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-600 border-b border-t border-gray-200 dark:border-gray-600 h-40 overflow-y-auto custom-scrollbar">
                {feesStructure?.map((option, idx) => (
                  <div
                    key={option?.feesStructureID}
                    className="relative flex items-start py-4 pr-3"
                  >
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label
                        htmlFor={`option-${option?.feesStructureID}`}
                        className="select-none font-medium text-gray-900 dark:text-gray-100"
                      >
                        {option?.groupName}
                      </label>
                    </div>
                    <div className="ml-3 flex h-6 items-center">
                      <input
                        id={`option-${option?.feesStructureID}`}
                        name={`option-${option?.feesStructureID}`}
                        type="checkbox"
                        value={option?.feesStructureID}
                        defaultChecked={listOfAssignedGroups?.includes(
                          option?.feesStructureID
                        )}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit Fees Mapping"
                  ? "Update Fees Mapping"
                  : "Add Fees Mapping"}
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

export default AddFeesMapping;
