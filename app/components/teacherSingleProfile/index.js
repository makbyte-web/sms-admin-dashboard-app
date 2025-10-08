"use client";
import Image from "next/image";
import NoAvatar from "@/public/images/noavatar.png";
import Link from "next/link";
import React, { useEffect } from "react";
import ProfileLoadingSkeleton from "../ui/profileLoadingSkeleton";
import { useTheme } from "@/context/themeContext";

const TeacherSingleProfile = ({ teacherData }) => {
  const { isLoading, setIsLoading } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!teacherData) {
    return <p className="text-center text-gray-600">Teacher data not found.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-sm:text-center mb-10">
          <Link
            href={`/dashboard/${
              teacherData.type ? teacherData.type + "s" : ""
            }`}
          />
          <Link href={`/dashboard/teachers`}>
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
              {teacherData?.teacherName || "N/A"}
              <span className="text-xl ml-4 capitalize bg-[--bg] max-w-2xl leading-6 text-white p-2 rounded-xl">
                {teacherData?.type || "N/A"}
              </span>
            </h3>

            <p className="text-xl capitalize mt-1 max-w-2xl leading-6 text-gray-500">
              {teacherData?.qualification}
            </p>
            <button className="block mt-10 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 tracking-wide">
              View Attendance
            </button>
          </div>
          <div>
            <Image
              src={teacherData?.imgSrc ? teacherData?.imgSrc : NoAvatar}
              alt="Teacher Avatar"
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
              Full name
            </dt>
            <dd className="mt-1 capitalize text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {teacherData?.teacherName || "N/A"}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl capitalize font-medium leading-6 text-gray-900 dark:text-[--text]">
              {teacherData?.type || "Teacher"} Id
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {teacherData?.teacherID || "N/A"}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Role
            </dt>

            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {teacherData?.qualification || "N/A"}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Email address
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {teacherData?.email || "N/A"}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Subject
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {teacherData?.subject || "N/A"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default TeacherSingleProfile;
