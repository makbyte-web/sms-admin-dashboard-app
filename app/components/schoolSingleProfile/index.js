"use client";
import Image from "next/image";
import NoAvatar from "@/public/images/noavatar.png";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import ProfileLoadingSkeleton from "../ui/profileLoadingSkeleton";

const SchoolSingleProfile = ({ schoolData }) => {
  const {
    isLoading,
    setIsLoading,
    handleModalClose,
    openModal,
    userType,
    setUserType,
    schoolID,
    setSchoolID,
  } = useTheme();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      const schoolID = JSON.parse(localStorage.getItem("schoolID"));
      setSchoolID(schoolID);
      setUserType(userType);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (isLoading) return <ProfileLoadingSkeleton />;

  if (!schoolData)
    return <p className="text-center text-gray-600">School data not found.</p>;

  if (userType === "superadmin") {
    const { schoolID, schoolName } = schoolData;
    localStorage.setItem("schoolID", JSON.stringify(schoolID));
    localStorage.setItem("schoolName", JSON.stringify(schoolName));
  }

  // Button Data
  const buttonData = [
    {
      label: "Standard",
      route: `/dashboard/schools/${schoolID}/standard`,
    },
    {
      label: "Division",
      route: `/dashboard/schools/${schoolID}/division`,
    },
    {
      label: "Class Teacher",
      route: `/dashboard/schools/${schoolID}/classTeacher`,
    },
    {
      label: "Academic Holiday",
      route: `/dashboard/schools/${schoolID}/academicHoliday`,
    },
    {
      label: "Parent Student Link",
      route: `/dashboard/schools/${schoolID}/parentStudentLink`,
    },
    {
      label: "Fees Type",
      route: `/dashboard/schools/${schoolID}/feesType`,
    },
    {
      label: "Fees Structure",
      route: `/dashboard/schools/${schoolID}/feesStructure`,
    },
    {
      label: "Fees Mapping",
      route: `/dashboard/schools/${schoolID}/feesMapping`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-sm:text-center mb-10">
          <Link href={`/dashboard/schools`}>
            <button
              type="button"
              className="block rounded-xl bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
            >
              &larr; Back
            </button>
          </Link>
        </div>

        <div className="px-4 sm:px-0 flex justify-between max-sm:flex-col-reverse max-sm:gap-12 max-sm:items-center">
          <div className="max-sm:text-center">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-[--text]">
              {schoolData?.schoolName || "N/A"}
            </h3>
            <p className="text-xl capitalize mt-1 text-gray-500">
              {schoolData?.medium}
            </p>
          </div>
          <div>
            <Image
              src={schoolData?.urlDP ? schoolData?.urlDP : NoAvatar}
              alt={schoolData?.urlDP ? schoolData?.schoolName : "No Avatar"}
              className="rounded-xl"
              height={150}
              width={150}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {buttonData?.map((button, index) => (
            <Link key={index} href={button?.route}>
              <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none">
                {button?.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 dark:border-[--bg]">
        <dl className="divide-y divide-gray-100 dark:divide-[--bg]">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium text-gray-900 dark:text-[--text]">
              Index No.
            </dt>
            <dd className="mt-1 text-lg text-gray-700 dark:text-[--textSoft] sm:col-span-2">
              {schoolData?.indexNo || ""}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium text-gray-900 dark:text-[--text]">
              Location
            </dt>
            <dd className="mt-1 text-lg text-gray-700 dark:text-[--textSoft] sm:col-span-2">
              {schoolData?.location || ""}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium text-gray-900 dark:text-[--text]">
              Email
            </dt>
            <dd className="mt-1 text-lg text-gray-700 dark:text-[--textSoft] sm:col-span-2">
              {schoolData?.email || ""}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium text-gray-900 dark:text-[--text]">
              Contact No.
            </dt>
            <dd className="mt-1 text-lg text-gray-700 dark:text-[--textSoft] sm:col-span-2">
              {schoolData?.contactNo || ""}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SchoolSingleProfile;
