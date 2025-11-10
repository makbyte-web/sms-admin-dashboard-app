"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import AddModal from "../ui/addModal";
import { useUserContext } from "@/context/UserContext";
import { Teachers } from "@/firestore/documents/teacher";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import { ClassTeacher } from "@/firestore/documents/classTeacher";
import { roles } from "@/defaults";
import { Subjects } from "@/firestore/documents/subject";

// After addition of subjects to app this form will be used as subject / class teacher assignment
export default function AddClassTeacher({
  handleModalClose,
  title,
  fetchClassTeacher,
}) {
  const academicYearRef = useRef();
  const teacherIDRef = useRef();
  const stdIDRef = useRef();
  const divIDRef = useRef();
  const subIDRef = useRef();
  const roleRef = useRef();
  
  const { user } = useUserContext();

  const {
    isEditing,
    isAddModalOpen,
    handleAddModalOpen,
    handleAddModalClose,
    userType,
    setUserType,
    schoolName,
    setSchoolName,
    schoolID,
    setSchoolID,
  } = useTheme();

  let retval;

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

  const loggedInUserID = user?.uid ? user?.uid : "NA";

  const [teachers, setTeachers] = useState([]);
  const [standard, setStandard] = useState();
  const [division, setDivision] = useState();
  const [subjects, setSubjects] = useState();

  useEffect(() => {
    async function fetchTeachers() {
      let result = [];
      if (userType === "superadmin") {
        result = await Teachers.getTeachersBySchool(schoolID);
      } else if (userType === "schooladmin") {
        result = await Teachers.getTeachersCreatedByUser(loggedInUserID);
      }
      if (Array.isArray(result)) result.sort((group1, group2) => group1.teacherName.localeCompare(group2.teacherName));
      if (result) setTeachers(result);
    }
    fetchTeachers();
  }, []);

  useEffect(() => {
    async function fetchStdDiv() {
      const result1 = await Standards.getStandardsBySchool(schoolID);
      const result2 = await Divisions.getDivisionsBySchool(schoolID);
      if (Array.isArray(result1)) result1.sort((std1, std2) => std1.stdName.localeCompare(std2.stdName));
      if (Array.isArray(result2)) result2.sort((div1, div2) => div1.divName.localeCompare(div2.divName));
      if (result1) setStandard(result1);
      if (result2) setDivision(result2);
    }
    fetchStdDiv();
  }, []);

  useEffect(() => {
    async function fetchSubjects() {
      const result = await Subjects.getSubjectsBySchool(schoolID);
      if (Array.isArray(result)) result.sort((sub1, sub2) => sub1.subName.localeCompare(sub2.subName));
      if (result) setSubjects(result);
    }
    fetchSubjects();
  }, []);

  const [classTeacherData, setClassTeacherData] = useState({
    academicYear: isEditing?.academicYear || "",
    teacherID: isEditing?.teacherID || "",
    stdID: isEditing?.stdID || "",
    divID: isEditing?.divID || "",
  });

  useEffect(() => {
    setClassTeacherData({
      academicYear: isEditing?.academicYear || "",
      teacherID: isEditing?.teacherID || "",
      stdID: isEditing?.stdID || "",
      divID: isEditing?.divID || "",
    });
  }, [isEditing]);

  const handleFormSubmit = async () => {
    if (title === "Add Class Teacher") {
      const newClassTeacher = new ClassTeacher(
        schoolID,
        academicYearRef.current.value,
        teacherIDRef.current.value,
        stdIDRef.current.value,
        divIDRef.current.value,
        subIDRef.current.value,
        roleRef.current.value,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA"
      );
      retval = await newClassTeacher.addClassTeacher();
      // if (retval) alert("ClassTeacher added", retval);
    } else if (title === "Edit Class Teacher") {
      const existsingClassTeacher = new ClassTeacher(
        schoolID,
        academicYearRef.current.value,
        teacherIDRef.current.value,
        stdIDRef.current.value,
        divIDRef.current.value,
        subIDRef.current.value,
        roleRef.current.value,
        isEditing.createdDate,
        isEditing.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing.ctID
      );
      retval = await existsingClassTeacher.updateClassTeacher();
      // alert("Class Teacher updated", retval);
    }
    handleModalClose();
    setClassTeacherData({
      academicYear: academicYearRef.current.value,
      teacherID: teacherIDRef.current.value,
      stdID: stdIDRef.current.value,
      divID: divIDRef.current.value,
      subID: subIDRef.current.value,
      role: roleRef.current.value
    });
    fetchClassTeacher();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-[--text] capitalize">
            {title === "Edit Class Teacher"
              ? "Edit Roles & Subject"
              : "Add Roles & Subject"}
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
                  defaultValue={classTeacherData?.academicYear}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Teacher Name
              </label>
              <select
                id="teacherID"
                name="teacherID"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                ref={teacherIDRef}
                required
              >
                <option value="Select">Select Teacher</option>
                {title === "Edit Class Teacher"
                  ? teachers &&
                    teachers?.length &&
                    teachers?.map((item, i) => {
                      return (
                        <option
                          key={item?.teacherID}
                          value={item?.teacherID}
                          selected={
                            isEditing.teacherID === item?.teacherID
                              ? true
                              : false
                          }
                        >
                          {item?.teacherName}
                        </option>
                      );
                    })
                  : teachers &&
                    teachers?.length &&
                    teachers?.map((item) => {
                      return (
                        <option key={item?.teacherID} value={item?.teacherID}>
                          {item?.teacherName}
                        </option>
                      );
                    })}
              </select>
            </div>
            {/* roles dropdown  */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Role
              </label>
              <select
                id="teacherID"
                name="teacherID"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                ref={roleRef}
                required
              >
                <option value="Select">Select Role</option>
                {title === "Edit Class Teacher"
                  ? roles &&
                    roles?.length &&
                    roles?.map((item, i) => {
                      return (
                        <option
                          key={`role${i}`}
                          value={item}
                          selected={
                            isEditing.role === item
                              ? true
                              : false
                          }
                        >
                          {item}
                        </option>
                      );
                    })
                  : roles &&
                    roles?.length &&
                    roles?.map((item,idx) => {
                      return (
                        <option key={`role${idx}`} value={item}>
                          {item}
                        </option>
                      );
                    })}
              </select>
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
                  ref={stdIDRef}
                  required
                >
                  <option value="Select">Select Standard</option>
                  {title === "Edit Class Teacher"
                    ? standard &&
                      standard?.length &&
                      standard?.map((item, i) => {
                        return (
                          <option
                            key={item?.stdID}
                            value={item?.stdID}
                            selected={
                              isEditing.stdID === item?.stdID ? true : false
                            }
                          >
                            {item?.stdName}
                          </option>
                        );
                      })
                    : standard &&
                      standard?.length &&
                      standard?.map((item, i) => {
                        return (
                          <option key={item?.stdID} value={item?.stdID}>
                            {item?.stdName}
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
                  ref={divIDRef}
                  required
                >
                  <option value="Select">Select Division</option>
                  {title === "Edit Class Teacher"
                    ? division &&
                      division?.length &&
                      division?.map((item) => {
                        return (
                          <option
                            key={item?.divID}
                            value={item?.divID}
                            selected={
                              isEditing.divID === item?.divID ? true : false
                            }
                          >
                            {item?.divName}
                          </option>
                        );
                      })
                    : division &&
                      division?.length &&
                      division?.map((item, i) => {
                        return (
                          <option key={item?.divID} value={item?.divID}>
                            {item?.divName}
                          </option>
                        );
                      })}
                </select>
              </div>
            </div>
            {/* subID dropdown */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Subject
              </label>
              <select
                id="teacherID"
                name="teacherID"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                ref={subIDRef}
                required
              >
                <option value="Select">Select Subject</option>
                {title === "Edit Class Teacher"
                  ? subjects &&
                    subjects?.length &&
                    subjects?.map((item, i) => {
                      return (
                        <option
                          key={item?.subID}
                          value={item?.subID}
                          selected={
                            isEditing.subID === item?.subID
                              ? true
                              : false
                          }
                        >
                          {item?.subName}
                        </option>
                      );
                    })
                  : subjects &&
                    subjects?.length &&
                    subjects?.map((item) => {
                      return (
                        <option key={item?.subID} value={item?.subID}>
                          {item?.subName}
                        </option>
                      );
                    })}
              </select>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit Class Teacher"
                  ? "Edit"
                  : "Add"}
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
}
