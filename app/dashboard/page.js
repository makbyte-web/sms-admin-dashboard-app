"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/components/ui/header/index";
import { IoPeopleSharp } from "react-icons/io5";
import { FaGoogleScholar } from "react-icons/fa6";
import Grid from "../components/ui/grid";
import { useUserContext } from "@/context/UserContext";
import { Students } from "@/firestore/documents/student";
import { Teachers } from "@/firestore/documents/teacher";
import { Schools } from "@/firestore/documents/school";
import { SkeletonGrid } from "../components/ui/skeletonGrid";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import Loader from "../components/ui/loader";
import { SchoolSettings } from "@/firestore/documents/schoolSettings";
import { SuperAdminSettings } from "@/firestore/documents/superadminSettings";

const Dashboard = () => {
  const { user } = useUserContext();
  const [schoolID, setSchoolID] = useState("");
  const [userType, setUserType] = useState("");
  const [totals, setTotals] = useState({
    students: null,
    teachers: null,
    schools: null,
  });

  const loggedInUserID = user?.uid ? user?.uid : "NA";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      setUserType(userType);
    }
  }, []);

  useEffect(() => {
    async function fetchSchoolID() {
      if (loggedInUserID === "NA") return;

      const result = await Schools.getSchoolByUserID(loggedInUserID);
      const { schoolID, schoolName } = result;
      if (result && result !== `No School created by ${loggedInUserID}!`) {
        setSchoolID(schoolID);
        localStorage.setItem("schoolID", JSON.stringify(schoolID));
        localStorage.setItem("schoolName", JSON.stringify(schoolName));
      }
    }
    fetchSchoolID();
  }, [loggedInUserID]);

  useEffect(() => {
    async function fetchSchoolSettings() {
      if (!schoolID) return;

      const schoolSettings = await SchoolSettings.getSchoolSettingsBySchool(schoolID);
      if (schoolSettings && schoolSettings.length) {
        const academicYear = schoolSettings[0]?.currentAcademicYear
        localStorage.setItem("academicYear", JSON.stringify(academicYear));
      } else{
        alert(`Kindly configure current Academic Year from Setting Menu`)
        return
      }
    }

    async function fetchSuperAdminSettings() {
      const superadminSettings = await SuperAdminSettings.getSuperAdminSettingsOwnedByUser(loggedInUserID);
      if (superadminSettings && superadminSettings.length) {
        const academicYear = superadminSettings[0]?.currentAcademicYear
        localStorage.setItem("academicYear", JSON.stringify(academicYear));
      } else{
        alert(`Kindly configure current Academic Year from Setting Menu`)
        return
      }
    }

    if (userType === "schooladmin") {
      fetchSchoolSettings()
    }

    if (userType === "superadmin") {
      fetchSuperAdminSettings()
    }
  }, [userType, schoolID])

  useEffect(() => {
    async function fetchTotalSchools() {
      const schoolData = await Schools.getSchools();
      if (schoolData) {
        setTotals((prev) => ({ ...prev, schools: schoolData.length }));
      }
    }

    if (userType === "superadmin") {
      fetchTotalSchools();
    }
  }, [userType]);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const [students, teachers] = await Promise.all([
          Students.getStudentsBySchool(schoolID),
          Teachers.getTeachersBySchool(schoolID),
        ]);

        setTotals((prev) => ({
          ...prev,
          students,
          teachers,
        }));
      } catch (error) {
        console.error("Error fetching school data:", error);
      }
    };

    if (schoolID) {
      fetchSchoolData();
    }
  }, [schoolID]);

  if (!user) {
    return <Loader />;
  }

  const { displayName, email } = user;
  const userPlaceholder = displayName || email;

  return (
    <div className="h-screen">
      <Header buttonText={"New Admission"} userPlaceholder={userPlaceholder} />
      <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
        {userType === "superadmin" ? (
          totals?.schools !== null ? (
            <Grid
              title="Schools"
              count={totals.schools}
              icon={
                <BuildingLibraryIcon className="h-full w-16 flex-shrink-0 dark:text-indigo-600 text-white" />
              }
            />
          ) : (
            <SkeletonGrid />
          )
        ) : (
          <>
            {totals?.students !== null ? (
              <Grid
                title="Students"
                count={totals?.students?.length}
                icon={
                  <IoPeopleSharp className="h-full w-16 flex-shrink-0 dark:text-indigo-600 text-white" />
                }
              />
            ) : (
              <SkeletonGrid />
            )}
            {totals?.teachers !== null ? (
              <Grid
                title="Teachers"
                count={totals?.teachers?.length}
                icon={
                  <FaGoogleScholar className="h-full w-16 flex-shrink-0 dark:text-indigo-600 text-white" />
                }
              />
            ) : (
              <SkeletonGrid />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
