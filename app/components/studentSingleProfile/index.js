"use client";
import Image from "next/image";
import NoAvatar from "@/public/images/noavatar.png";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/themeContext";
import ProfileLoadingSkeleton from "../ui/profileLoadingSkeleton";

const StudentSingleProfile = ({ studentData }) => {
  const { isLoading, setIsLoading } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!studentData) {
    return <p className="text-center text-gray-600">Student data not found.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-sm:text-center mb-10">
          <Link href={`/dashboard/students`}>
            <button
              type="button"
              className="block rounded-xl bg-indigo-600 px-4 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              &larr; Back
            </button>
          </Link>
        </div>
        <div className="px-4 sm:px-0 flex justify-between max-sm:flex-col-reverse max-sm:gap-12 max-sm:items-center">
          <div className="max-sm:text-center">
            <h3 className="text-3xl font-semibold leading-7 text-gray-900 dark:text-[--text]">
              {studentData?.studentName || "N/A"}
            </h3>
            <button className="block mt-10 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 tracking-wide">
              View Attendance
            </button>
          </div>
          <div>
            <Image
              src={studentData?.urlDP ? studentData?.urlDP : NoAvatar}
              alt="No Avatar"
              className="rounded-xl"
              height={150}
              width={150}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100 dark:border-[--bg]">
        <dl className="divide-y divide-gray-100 dark:divide-[--bg]">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Student Name
            </dt>
            <dd className="mt-1 capitalize text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {studentData?.studentName || "N/A"}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              GR No
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {studentData?.grNo || "N/A"}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Email
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {studentData?.email || "N/A"}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Class
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {studentData?.std || "N/A"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default StudentSingleProfile;
