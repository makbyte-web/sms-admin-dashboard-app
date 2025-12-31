"use client";
import Image from "next/image";
import NoAvatar from "@/public/images/noavatar.png";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/themeContext";
import ProfileLoadingSkeleton from "../ui/profileLoadingSkeleton";
import ViewChildrenTable from "../viewChildrenTable";
import { ParentStudents } from "@/firestore/documents/parentStudents";
import { Students } from "@/firestore/documents/student";

const ParentSingleProfile = ({ parentData }) => {
  const { isLoading, setIsLoading } = useTheme();
  const [childrenData, setChildrenData] = useState([]);
  const childrenTableRef = useRef(null);
  const handleScroll = () => {
    if (childrenTableRef.current) {
      childrenTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Hook 1
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  // Hook 2
  useEffect(() => {
    if (!parentData?.parentID) return;
    const fetchParentStudent = async () => {
      try {
        const parentStudentData =
          await ParentStudents.getParentStudentsBySchool(parentData?.schoolID);

        const currentParentData = parentStudentData.find(
          (item) => item.parentID === parentData?.parentID
        );

        if (!currentParentData?.children) return;

        const studentsData = await Promise.all(
          currentParentData.children.map((child) => Students.getStudent(child))
        );

        setChildrenData(studentsData);
      } catch (error) {
        console.log("Error at Parent Student : ", error);
      }
    };
    fetchParentStudent();
  }, [parentData?.parentID]);

  if (isLoading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!parentData) {
    return <p className="text-center text-gray-600">Parent data not found.</p>;
  }
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-sm:text-center mb-10">
          <Link href={`/dashboard/parents`}>
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
              {parentData.parentName}
            </h3>
            <p className="text-xl capitalize mt-1 max-w-2xl leading-6 text-gray-500">
              {parentData.qualification}
            </p>
            <button
              onClick={handleScroll}
              className="block mt-10 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 tracking-wide"
            >
              View {Number(parentData?.noOfChildren) > 1 ? "Children" : "Child"}
            </button>
          </div>

          <div>
            <Image
              src={parentData?.urlDP ? parentData?.urlDP : NoAvatar}
              alt="parent-profile-photo"
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
              {parentData.parentName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Address
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {parentData.address}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Email address
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {parentData.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Contact No.
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {parentData.contact}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Secret Question
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {parentData.sceretQts}
            </dd>
          </div>
          {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-xl font-medium leading-6 text-gray-900 dark:text-[--text]">
              Secret Answer
            </dt>
            <dd className="mt-1 text-lg leading-6 text-gray-700 dark:text-[--textSoft] sm:col-span-2 sm:mt-0">
              {parentData.sceretAns}
            </dd>
          </div> */}
        </dl>
      </div>
      <div ref={childrenTableRef}>
        <ViewChildrenTable students={childrenData} />
      </div>
    </div>
  );
};

export default ParentSingleProfile;
