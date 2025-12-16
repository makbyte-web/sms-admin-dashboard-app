"use client";
import { useTheme } from "@/context/themeContext";
import React, { use, useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { ParentStudents } from "@/firestore/documents/parentStudents";
import { Parents } from "@/firestore/documents/parent";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import { Students } from "@/firestore/documents/student";

export default function AddLinkParentStudents({
  handleModalClose,
  title,
  fetchParentStudents,
}) {
  const academicYearRef = useRef();
  const parentIDRef = useRef();
  const stdRef = useRef();
  const divRef = useRef();

  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterStudents, setFilterStudents] = useState([]);
  const [standard, setStandard] = useState();
  const [division, setDivision] = useState();
  const [listOfChildren, setListOfChildren] = useState([]);

  const {
    isEditing,
    handleAddModalClose,
    isAddModalOpen,
    handleAddModalOpen,
    userType,
    setUserType,
    schoolName,
    setSchoolName,
    schoolID,
    setSchoolID,
  } = useTheme();
  const { user } = useUserContext();

  let retval;

  const loggedInUserID = Object.keys(user).length === 0 ? "NA" : user?.uid;
  // useEffect(()=>{if(typeof window !== 'undefined'){

  // }},[])
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

  const [linkParentStudentsData, setLinkParentStudentsData] = useState({
    academicYear: isEditing?.academicYear || "",
    children: isEditing?.children?.map((studentID) => studentID) || [],
  });

  const [selectedStdID, setSelectedStdID] = useState(null);
  const [selectedDivID, setSelectedDivID] = useState(null);

  useEffect(() => {
    setLinkParentStudentsData({
      academicYear: isEditing?.academicYear || "",
      children: isEditing?.children?.map((studentID) => studentID) || [],
    });
    setListOfChildren(isEditing?.children?.map((studentID) => studentID) || []);
  }, [isEditing]);

  useEffect(() => {
    async function fetchParents() {
      let result = [];
      if (userType === "superadmin") {
        result = await Parents.getParentsBySchool(schoolID);
      } else if (userType === "schooladmin") {
        result = await Parents.getParentsCreatedByUser(loggedInUserID);
      }
      result.sort((group1, group2) =>
        group1.parentName.localeCompare(group2.parentName)
      );
      if (result) setParents(result);
    }
    fetchParents();
  }, [loggedInUserID, schoolID, userType]);

  useEffect(() => {
    let result;
    async function fetchStdDivStudents() {
      const stdResult = await Standards.getStandardsBySchool(schoolID);
      const divResult = await Divisions.getDivisionsBySchool(schoolID);
      const studentsRes = await Students.getStudentsBySchool(schoolID);
      stdResult.sort((std1, std2) => std1.stdName.localeCompare(std2.stdName));
      divResult.sort((div1, div2) => div1.divName.localeCompare(div2.divName));

      if (stdResult) setStandard(stdResult);
      if (divResult) setDivision(divResult);

      if (studentsRes?.length > 0) {
        const standardMap = stdResult.reduce((acc, std) => {
          acc[std.stdID] = std.stdName;
          return acc;
        }, {});
        const divisionMap = divResult.reduce((acc, div) => {
          acc[div.divID] = div.divName;
          return acc;
        }, {});
        const studentsWithStdDiv = studentsRes.map((student) => {
          return {
            ...student,
            stdName: standardMap[student.stdID],
            divName: divisionMap[student.divID],
          };
        });
        result = studentsWithStdDiv;
      }
      if (result) setStudents(result);
    }
    fetchStdDivStudents();
  }, [schoolID]);

  useEffect(() => {
    if (students) setFilterStudents(students);
  }, [students]);

  const handleFeesGroupVal = (e) => {
    const selectedValue = e.target.value;
    setListOfChildren((prev) => {
      if (prev.includes(selectedValue)) {
        return prev.filter((item) => item !== selectedValue);
      } else {
        return [...prev, selectedValue];
      }
    });
  };

  const handleStdToSelection = (event) => {
    const filterStdID = event.target.value;
    setSelectedStdID(filterStdID !== "Select" ? filterStdID : null);
    filterStudentsList(
      filterStdID !== "Select" ? filterStdID : null,
      selectedDivID
    );
  };

  const handleDivToSelection = (event) => {
    const filterDivID = event.target.value;
    setSelectedDivID(filterDivID !== "Select" ? filterDivID : null);
    filterStudentsList(
      selectedStdID,
      filterDivID !== "Select" ? filterDivID : null
    );
  };

  const filterStudentsList = (stdID, divID) => {
    const filtered = students.filter((student) => {
      const stdMatch = stdID ? student.stdID === stdID : true;

      const divMatch = divID ? student.divID === divID : true;
      return stdMatch && divMatch;
    });
    setFilterStudents(filtered);
  };

  const handleFormSubmit = async () => {
    if (title === "Add Parent Students Link") {
      const newParentStudents = new ParentStudents(
        schoolID,
        academicYearRef.current.value,
        parentIDRef.current.value,
        listOfChildren,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA"
      );
      retval = await newParentStudents.addParentStudents();
    } else if (title === "Edit Parent Students Link") {
      const existsingParentStudents = new ParentStudents(
        schoolID,
        academicYearRef.current.value,
        parentIDRef.current.value,
        listOfChildren,
        isEditing.createdDate,
        isEditing.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing.psID
      );
      retval = await existsingParentStudents.updateParentStudents();
    }

    handleModalClose();
    setLinkParentStudentsData({
      academicYear: isEditing?.academicYear || "",
      children: isEditing?.children?.map((studentID) => studentID) || [],
    });
    fetchParentStudents();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit Parent Students Link"
              ? "Edit Parent Students Link"
              : "Add Parent Students Link"}
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
                  defaultValue={linkParentStudentsData.academicYear}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Parent Name
              </label>
              <div className="mt-2">
                <select
                  id="parentID"
                  name="parentID"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  ref={parentIDRef}
                  required
                >
                  <option value="Select">Select Parent</option>
                  {title === "Edit Parent Students Link"
                    ? parents &&
                      parents.length &&
                      parents.map((item) => {
                        return (
                          <option
                            key={item.parentID}
                            value={item.parentID}
                            selected={
                              isEditing.parentID === item.parentID
                                ? true
                                : false
                            }
                          >
                            {item.parentName}
                          </option>
                        );
                      })
                    : parents &&
                      parents.length &&
                      parents.map((item, i) => {
                        return  !isEditing.includes(item.parentID) ? (                          
                          <option key={item.parentID} value={item.parentID}>
                            {item.parentName}
                          </option>
                        ) : null;
                      })}
                </select>
              </div>
            </div>

            {/* stdID dropdown */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="stdID"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Standard
                </label>
              </div>
              <div className="mt-2">
                <select
                  id="stdID"
                  name="stdID"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  ref={stdRef}
                  onChange={handleStdToSelection}
                >
                  <option value="Select">Select Standard</option>
                  {title === "Edit Parent Students Link"
                    ? standard &&
                      standard.length &&
                      standard.map((item) => {
                        return (
                          <option
                            key={item.stdID}
                            value={item.stdID}
                            selected={
                              isEditing.stdID === item.stdID ? true : false
                            }
                          >
                            {item.stdName}
                          </option>
                        );
                      })
                    : standard &&
                      standard.length &&
                      standard.map((item) => {
                        return (
                          <option key={item.stdID} value={item.stdID}>
                            {item.stdName}
                          </option>
                        );
                      })}
                </select>
              </div>
            </div>

            {/* divID dropdown */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="divID"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Division
                </label>
              </div>
              <div className="mt-2">
                <select
                  id="divID"
                  name="divID"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  ref={divRef}
                  onChange={handleDivToSelection}
                >
                  <option value="Select">Select Division</option>
                  {title === "Edit Parent Students Link"
                    ? division &&
                      division.length &&
                      division.map((item, i) => {
                        return (
                          <option
                            key={item.divID}
                            value={item.divID}
                            selected={
                              isEditing.divID === item.divID ? true : false
                            }
                          >
                            {item.divName}
                          </option>
                        );
                      })
                    : division &&
                      division.length &&
                      division.map((item) => {
                        return (
                          <option key={item.divID} value={item.divID}>
                            {item.divName}
                          </option>
                        );
                      })}
                </select>
              </div>
            </div>

            {/* populate students based on std and div */}
            <fieldset onChange={handleFeesGroupVal}>
              <legend className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                Select Students
              </legend>
              <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-600 border-b border-t border-gray-200 dark:border-gray-600 h-40 overflow-y-auto custom-scrollbar">
                {filterStudents.map((option, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-start py-4 pr-3"
                  >
                    <div className="min-w-0 flex-1 text-sm leading-6">
                      <label
                        htmlFor={`option-${option.studentID}`}
                        className="select-none font-medium text-gray-900 dark:text-gray-100"
                      >
                        {`${option.studentName} ( ${option.stdName} ${option.divName} )`}
                      </label>
                    </div>
                    <div className="ml-3 flex h-6 items-center">
                      <input
                        id={`option-${option.studentID}`}
                        name={`option-${option.studentID}`}
                        type="checkbox"
                        value={option.studentID}
                        defaultChecked={listOfChildren.includes(
                          option.studentID
                        )}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* <div>
              <label
                htmlFor="children"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Children
              </label>
              <div className="mt-2">
                <input
                  id="children"
                  name="children"
                  defaultValue={linkParentStudentsData.children}
                  type="text"
                  placeholder="e.g array of children"
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div> */}

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 py-2 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-indigo-500 dark:ring-indigo-500 dark:hover:bg-indigo-600"
            >
              {title === "Edit Parent Students Link"
                ? "Update Parent Students Link"
                : "Add Parent Students Link"}
            </button>
          </form>
        </div>
      </div>

      {isAddModalOpen && (
        <AddModal
          modalType="Parent Students Link"
          open={isAddModalOpen}
          onClose={handleAddModalClose}
          onConfirm={handleFormSubmit}
          title={
            title === "Edit Parent Students Link"
              ? "Edit Parent Students Link Details"
              : "Add Parent Students Link"
          }
        />
      )}
    </>
  );
}
