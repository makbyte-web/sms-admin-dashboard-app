"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import noProfilePhotoURL from "@/public/images/noavatar.png";
import { useUserContext } from "@/context/UserContext";
import { CompanyName } from "@/defaults";
import Header from "@/app/components/ui/header";

const Profile = () => {
  const { user, isSuperAdmin, logOut } = useUserContext();

  const { displayName, email, photoURL } = user;

  const profileStatus = isSuperAdmin ? "Super Admin" : "School Admin";

  const altPlaceholder = isSuperAdmin ? CompanyName : displayName ? displayName : email;
  const srcPlaceholder = photoURL ? photoURL : noProfilePhotoURL;

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <Header currentPage={"Profile"}></Header>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {/* <div className="flex justify-between ">
          <div className="mb-10 max-sm:text-center">
            <Link href="/dashboard">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                &larr; Back
              </button>
            </Link>
          </div>
          <div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              onClick={() => logOut()}
            >
              Logout
            </button>
          </div>
        </div> */}
        <div className="flex justify-between items-center flex-col-reverse sm:flex-row text-center sm:text-left">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {altPlaceholder}
            </h3>
            <p className="text-xl mt-2 capitalize text-gray-500">
              {profileStatus}
            </p>
          </div>
          <div className="mb-6 sm:mb-0">
            <Image
              src={srcPlaceholder}
              alt={altPlaceholder || "admin profile"}
              className="rounded-full shadow-md"
              height={150}
              width={150}
            />
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
          <dl className="space-y-6">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">
                Administartor
              </dt>
              <dd className="mt-1 text-lg text-gray-700 dark:text-gray-300 sm:col-span-2">
                {displayName ? displayName : ""}
              </dd>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">
                Email
              </dt>
              <dd className="mt-1 text-lg text-gray-700 dark:text-gray-300 sm:col-span-2">
                {email}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
