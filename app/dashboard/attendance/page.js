"use client";
import AttendaceTable from "@/app/components/ui/attendanceTable";
import { useTheme } from "@/context/themeContext";
import { useUserContext } from "@/context/UserContext";
import { Attendance } from "@/firestore/documents/attendance";
import { Holiday } from "@/firestore/documents/holiday";
import { Divisions } from "@/firestore/documents/division";
import { Standards } from "@/firestore/documents/standard";
import { Students } from "@/firestore/documents/student";
import React, { useEffect, useRef, useState } from "react";
import Loader from "@/app/components/ui/loader";
import AttendanceSkeletonLoader from "@/app/components/ui/attendanceSkeletonLoader";
import { academicYears } from "@/defaults";
import CustomSelectForm from "@/app/components/customSelectForm";

const Attendace = () => {
  const { user } = useUserContext();

  const { schoolID, userType, setUserType, setSchoolID } = useTheme();

  const [studentsAttendanceList, setStudentsAttendanceList] = useState(null);
  const [holidayList, setHolidayList] = useState(null);
  const [storedAcademicYear, setStoredAcademicYear] = useState("");
  const loggedInUserID = user?.uid ? user?.uid : "NA";

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

  const fetchHoliday = async () => {
    if (!schoolID || !userType) {
      console.warn("Skipping fetch: schoolID or userType is missing.");
      return;
    }

    if (userType === "superadmin" || userType === "schooladmin") {
      const holidayRes = await Holiday.getHolidayBySchool(
        schoolID,
        storedAcademicYear
      );
      if (holidayRes) {
        setHolidayList(holidayRes);
      } else {
        console.warn("No holidays found.");
        return;
      }
    } else {
      console.warn("Unauthorized userType:", userType);
      return;
    }
  };

  useEffect(() => {
    // fetchSchoolStandardList();
    // fetchSchoolDivisionsList();
    // fetchStudents();
    fetchHoliday();
  }, [loggedInUserID, schoolID, userType, storedAcademicYear]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <CustomSelectForm
        title={"Students Attendance"}
        storedAcademicYear={storedAcademicYear}
        setStoredAcademicYear={setStoredAcademicYear}
        studentsAttendanceList={studentsAttendanceList}
        setStudentsAttendanceList={setStudentsAttendanceList}
        setLoading={setLoading}
      />
      {!loading && (
        <AttendaceTable
          studentsAttendanceList={studentsAttendanceList}
          holidayList={holidayList}
        />
      )}
    </>
  );
};

export default Attendace;
