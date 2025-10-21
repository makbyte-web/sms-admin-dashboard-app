"use client";
import { useTheme } from "@/context/themeContext";
import { useUserContext } from "@/context/UserContext";
import { academicYears } from "@/defaults";
import { Attendance } from "@/firestore/documents/attendance";
import { Divisions } from "@/firestore/documents/division";
import { Standards } from "@/firestore/documents/standard";
import { Students } from "@/firestore/documents/student";
import React, { useEffect, useRef, useState } from "react";
import AttendanceSkeletonLoader from "../ui/attendanceSkeletonLoader";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FeesMapping } from "@/firestore/documents/feesMapping";
import { FeesStructure } from "@/firestore/documents/feesStructure";
import { FeesType } from "@/firestore/documents/feesType";

const CustomSelectForm = ({
  storedAcademicYear,
  title,
  setStoredAcademicYear,
  setStudentsAttendanceList,
  studentsFeesList,
  feesStructureListData,
  setStudentsFeesList,
  setFeesStructureListData,
  setLoading,
}) => {
  const { schoolID, userType, setUserType, setSchoolID } = useTheme();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      const storedAcademicYear =
        JSON.parse(localStorage.getItem("academicYear")) || "NA";
      setSchoolID(schoolID);
      setUserType(userType);
      setStoredAcademicYear(storedAcademicYear);
    }
  }, []);
  const [students, setStudents] = useState(null);
  const { user } = useUserContext();
  const divisionRef = useRef();
  const standardRef = useRef();
  const academicYearRef = useRef();
  const [standardList, setStandardList] = useState(null);
  const [divisionList, setDivisionList] = useState(null);
  const loggedInUserID = user?.uid ? user?.uid : "NA";
  const [feesData, setFeesData] = useState([]);

  const fetchStudents = async () => {
    if (!schoolID || !userType) {
      console.warn("Skipping fetch: schoolID or userType is missing.");
      return;
    }
    let studentsRes = [];

    if (userType === "superadmin") {
      studentsRes = await Students.getStudentsBySchool(schoolID);
    } else if (userType === "schooladmin") {
      studentsRes = await Students.getStudentsCreatedByUser(user?.uid);
    } else {
      console.warn(`Unauthorized userType: ${userType}`);
      return;
    }

    if (studentsRes?.length > 0) {
      const stdResult = await Standards.getStandardsBySchool(schoolID);
      const divResult = await Divisions.getDivisionsBySchool(schoolID);

      const standardMap = stdResult?.reduce((acc, std) => {
        acc[std?.stdID] = std?.stdName;
        return acc;
      }, {});

      const divisionMap = divResult?.reduce((acc, div) => {
        acc[div?.divID] = div?.divName;
        return acc;
      }, {});

      const studentsWithStdDiv = studentsRes?.map((student) => ({
        ...student,
        stdName: standardMap[student?.stdID] || "Unknown",
        divName: divisionMap[student?.divID] || "Unknown",
      }));

      setStudents(studentsWithStdDiv);
    } else {
      console.warn("No students found.");
    }
  };

  const fetchSchoolStandardList = async () => {
    let result;
    if (userType === "superadmin") {
      result = await Standards.getStandardsBySchool(schoolID);
    } else if (userType === "schooladmin") {
      result = await Standards.getStandardsCreatedByUser(loggedInUserID);
    } else {
      console.error("Unauthorized to fetch standards");
      return;
    }

    if (Array.isArray(result)) {
      result?.sort((std1, std2) => std1?.stdName?.localeCompare(std2?.stdName));
      setStandardList(result);
      setLoading(false);
    } else {
      console.error(`Expected an array from API but got: ${result}`);
    }
  };
  const handleAttendanceForm = async (e) => {
    e.preventDefault();

    try {
      const filteredStudentsByDivAndStd = students?.filter((item) => {
        return (
          item?.divID === divisionRef.current.value &&
          item?.stdID === standardRef.current.value
        );
      });

      const academicYear = academicYearRef?.current.value;

      if (title === "Students Attendance") {
        const attendanceList = [];

        for (const student of filteredStudentsByDivAndStd || []) {
          try {
            const res = await Attendance.getAttendanceByStudent(
              schoolID,
              academicYear,
              student?.studentID
            );
            attendanceList?.push({ student, attendance: res });
          } catch (error) {
            console.error(
              `Error fetching attendance for student ${student?.studentID}: ${error}`
            );
          }
        }

        setStudentsAttendanceList(attendanceList);
      } else if (title === "Students Fees Table") {
        const data = await FeesMapping.getFeesMappingBySchool(schoolID);

        // Get fresh fees data - either from state or by fetching
        let currentFeesData = feesData;
        if (!currentFeesData || currentFeesData.length === 0) {
          currentFeesData = await fetchSchoolFeesStructureList();
          // Small delay to ensure state update propagates
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // console.log("Using fees data:", currentFeesData); // Debug log

        const filteredByStudents = students
          ?.filter((student) =>
            data?.some(
              (fees) =>
                (student?.studentID === fees?.assigneeID &&
                  student?.stdID === standardRef.current.value &&
                  student?.divID === divisionRef.current.value) ||
                (standardRef.current.value === fees?.assigneeID &&
                  student?.stdID === standardRef.current.value &&
                  student?.divID === divisionRef.current.value)
            )
          )
          ?.map((student) => {
            const matchedFees = data?.find(
              (fees) =>
                (student?.studentID === fees?.assigneeID &&
                  student?.stdID === standardRef.current.value &&
                  student?.divID === divisionRef.current.value) ||
                (standardRef.current.value === fees?.assigneeID &&
                  student?.stdID === standardRef.current.value &&
                  student?.divID === divisionRef.current.value)
            );
            return {
              ...student,
              ...matchedFees,
            };
          });

        const uniqueData = [];
        const seen = {};

        for (let i = 0; i < filteredByStudents?.length; i++) {
          const student = filteredByStudents[i];
          if (!seen[student?.studentID]) {
            uniqueData?.push(student);
            seen[student?.studentID] = true;
          }
        }

        const enrichedStudents = uniqueData?.map((student) => {
          const matchedGroups = student?.assignedGroups
            ?.map((groupID) =>
              currentFeesData?.find((fee) => fee?.feesStructureID === groupID)
            )
            ?.filter(Boolean);

          const assignedFees = matchedGroups?.flatMap(
            (group) => group?.feesInStructure || []
          );

          return {
            ...student,
            feeDetails: assignedFees || [],
            matchedGroups: matchedGroups || [],
          };
        });

        setStudentsFeesList(enrichedStudents);
      }
    } catch (error) {
      console.error("Error in handleAttendanceForm:", error);
      // Handle error state if needed
    }
  };

  const fetchSchoolDivisionsList = async () => {
    let result;
    if (userType === "superadmin") {
      result = await Divisions.getDivisionsBySchool(schoolID);
    } else if (userType === "schooladmin") {
      result = await Divisions.getDivisionsCreatedByUser(loggedInUserID);
    } else {
      console.error("Unauthorized to fetch divisions");
      return;
    }

    if (Array.isArray(result)) {
      result?.sort((div1, div2) => div1?.divName?.localeCompare(div2?.divName));
      setDivisionList(result);
    } else {
      console.error(`Expected an array from API but got: ${result}`);
    }
  };
  const fetchSchoolFeesStructureList = async () => {
    try {
      let feesStructureRes = [];
      let feesTypeRes = [];

      if (userType === "superadmin") {
        feesStructureRes = await FeesStructure.getFeesStructureBySchool(
          schoolID
        );
      } else if (userType === "schooladmin") {
        feesStructureRes = await FeesStructure.getFeesStructureCreatedByUser(
          loggedInUserID
        );
      } else {
        console.warn("Unauthorized access to fees structure data.");
        return []; // Return empty array if unauthorized
      }

      feesTypeRes = await FeesType.getFeesTypeBySchool(schoolID);

      if (feesStructureRes.length > 0 && feesTypeRes.length > 0) {
        const feesTypeMap = feesTypeRes.reduce((acc, fee) => {
          acc[fee.feesTypeID] = fee;
          return acc;
        }, {});

        const feesStructureWithDetails = feesStructureRes.map((structure) => {
          const feesWithDetails = structure.feesInStructure.map(
            (feesTypeID) => feesTypeMap[feesTypeID] || feesTypeID
          );

          const totalAmount = feesWithDetails.reduce((sum, fee) => {
            return typeof fee === "object" && fee.amount
              ? sum + fee.amount
              : sum;
          }, 0);

          return {
            ...structure,
            feesInStructure: feesWithDetails,
            totalAmount,
          };
        });

        feesStructureWithDetails?.sort((a, b) =>
          a?.groupName.localeCompare(b.groupName)
        );

        // Update state
        setFeesData(feesStructureWithDetails);
        // Also return the data directly
        return feesStructureWithDetails;
      } else {
        console.info("No fees structure or fees types found.");
        setFeesData([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching school fees structure list:", error);
      return [];
    }
  };

  useEffect(() => {
    if (schoolID && userType) {
      fetchSchoolStandardList();
      fetchSchoolDivisionsList();
      fetchStudents();
    }
  }, [schoolID, userType, storedAcademicYear]);

  return (
    <>
      {standardList === null || divisionList === null ? (
        <AttendanceSkeletonLoader />
      ) : (
        <div className=" mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {title}
          </h2>
          <form className="space-y-6 " onSubmit={handleAttendanceForm}>
            <div className="grid grid-cols-2 items-end md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="standard"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Standard
                </label>
                <div className="relative">
                  <select
                    id="standard"
                    name="standard"
                    ref={standardRef}
                    className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out hover:border-indigo-400 cursor-pointer"
                    required
                  >
                    <option
                      value="Select"
                      disabled
                      className="text-gray-400 dark:text-gray-500 italic"
                    >
                      Select Standard
                    </option>
                    {standardList?.map((item, i) => (
                      <option
                        value={item?.stdID}
                        key={item?.stdID}
                        className="py-2 px-3 my-1 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-200 transition-colors duration-200 ease-in-out"
                      >
                        {item?.stdName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="division"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Division
                </label>
                <div className="relative">
                  <select
                    id="division"
                    name="division"
                    ref={divisionRef}
                    className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out hover:border-indigo-400 cursor-pointer"
                    required
                  >
                    <option
                      value="Select"
                      disabled
                      className="text-gray-400 dark:text-gray-500 italic"
                    >
                      Select Division
                    </option>
                    {divisionList?.map((item, i) => (
                      <option
                        value={item?.divID}
                        key={item?.divID}
                        className="py-2 px-3 my-1 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-200 transition-colors duration-200 ease-in-out"
                      >
                        {item?.divName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="academicYear"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Academic Year
                </label>
                <div className="relative">
                  <select
                    id="academicYear"
                    name="academicYear"
                    ref={academicYearRef}
                    className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out hover:border-indigo-400 cursor-pointer"
                    required
                  >
                    <option value="Select" className="text-gray-400">
                      Select Academic Year
                    </option>
                    {academicYears &&
                      academicYears?.map((item, i) => (
                        <option
                          value={item}
                          key={i}
                          className="text-gray-900 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                        >
                          {item}
                        </option>
                      ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="">
                <button
                  type="submit"
                  className="px-5 lg:px-2 lg:py-3 py-3 text-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {title === "Students Fees Table" ? "View Assigned Fees" : "View Attendance"} 
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CustomSelectForm;
