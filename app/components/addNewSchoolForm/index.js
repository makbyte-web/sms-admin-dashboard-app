"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/themeContext";
import { Schools } from "@/firestore/documents/school";
import { useUserContext } from "@/context/UserContext";
import AddModal from "../ui/addModal";
import { defaultUrlDP, defaultSchoolDP } from "@/defaults";
import { deleteCloudinaryImage } from "@/actions/file";
import Image from "next/image";

export default function AddNewSchoolForm({ handleModalClose, fetchSchool }) {
  const schoolNameRef = useRef();
  const locationRef = useRef();
  const mediumRef = useRef();
  const emailRef = useRef();
  const indexNoRef = useRef();
  const displayNameRef = useRef();
  const contactNoRef = useRef();

  const {
    isEditing,
    title,
    handleAddModalClose,
    isAddModalOpen,
    handleAddModalOpen,
    handleFileChange,
    schoolID,
    setSchoolID,
    userType,
  } = useTheme();

  const { user } = useUserContext();

  // defaultPhotoURL - admin profile pic
  const defaultPhotoURL = (userType === "superadmin") ? defaultUrlDP : user?.photoURL || defaultUrlDP;

  // defaultURLDP - school profile pic
  const defaultURLDP = isEditing?.urlDP || defaultSchoolDP;

  const [urlDP, setUrlDP] = useState(defaultURLDP);
  const [urlDPID, setUrlDPID] = useState(isEditing?.urlDPID || "");
  const [urlAdminDP, setUrlAdminDP] = useState(defaultPhotoURL);
  const [urlAdminDPID, setUrlAdminDPID] = useState(isEditing?.urlAdminDPID || "");

  // File state management for school image
  const [selectedSchoolFile, setSelectedSchoolFile] = useState(null);
  const [selectedAdminFile, setSelectedAdminFile] = useState(null);

  // File state management for admin image
  const [isUploadingSchool, setIsUploadingSchool] = useState(false);
  const [isUploadingAdmin, setIsUploadingAdmin] = useState(false);

  let retval;

  const loggedInUserID = user?.uid ? user?.uid : "NA";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      setSchoolID(schoolID);
    }
  }, []);

  const handleFormSubmit = async () => {
    const finalURLDP = urlDP?.url || urlDP;
    const finalPhotoURL = urlAdminDP?.url || urlAdminDP;

    if (title === "Add") {
      const newSchool = new Schools(
        schoolNameRef.current.value,
        locationRef.current.value,
        mediumRef.current.value,
        indexNoRef.current.value,
        emailRef.current.value,
        finalURLDP,
        urlDPID,
        urlAdminDPID,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA",
        displayNameRef.current.value,
        finalPhotoURL,
        contactNoRef.current.value
      );

      retval = await newSchool.addSchool();
      // if (retval) alert("School added", retval);
    } else if (title === "Edit") {
      const existsingSchool = new Schools(
        schoolNameRef.current.value,
        locationRef.current.value,
        mediumRef.current.value,
        indexNoRef.current.value,
        emailRef.current.value,
        finalURLDP,
        urlDPID,
        urlAdminDPID,
        isEditing.createdDate,
        isEditing.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        displayNameRef.current.value,
        finalPhotoURL,
        contactNoRef.current.value,
        isEditing.isActive,
        isEditing.schoolID,
        isEditing.userID
      );

      retval = await existsingSchool.updateSchool();
    }
    handleModalClose();
    fetchSchool();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit" ? "Edit School" : "Add School"}
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
            {/* School Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                School Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={isEditing?.schoolName}
                  placeholder="e.g School Name"
                  required
                  ref={schoolNameRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* Medium Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="medium"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Medium
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="medium"
                  name="medium"
                  type="text"
                  placeholder="e.g English"
                  defaultValue={isEditing?.medium}
                  required
                  ref={mediumRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Email address
              </label>
              <div className="mt-2">
                {title === "Edit" ? (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={isEditing?.email}
                    placeholder="e.g school@gmail.com"
                    disabled
                    ref={emailRef}
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                ) : (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={isEditing?.email}
                    placeholder="e.g school@gmail.com"
                    required
                    ref={emailRef}
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="id"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  School Index No.
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="id"
                  name="id"
                  type="text"
                  placeholder="e.g 12345"
                  defaultValue={isEditing?.indexNo}
                  required
                  ref={indexNoRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Location
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g Mira road"
                  defaultValue={isEditing?.location}
                  required
                  ref={locationRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* Contact Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="contactNo"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Contact No.
                </label>
              </div>
              <div className="mt-2">
                <input
                  required
                  id="contactNo"
                  name="contactNo"
                  type="text"
                  placeholder="e.g +9198xxxxxx23"
                  defaultValue={isEditing?.contactNo}
                  ref={contactNoRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>

            {/* AdminName Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Administartor Name
                </label>
              </div>
              <div className="mt-2">
                {title === "Edit" ? (
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="e.g School Administartor Name"
                    defaultValue={user?.displayName}
                    ref={displayNameRef}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                ) : (
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="e.g School Administartor Name"
                    ref={displayNameRef}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                )}
              </div>
            </div>

            {/* Admin Profile Photo Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="photoURL"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Administartor Profile URL
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="photo"
                  name="administrator-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setSelectedAdminFile(file);
                    setUrlAdminDP(URL.createObjectURL(file));
                  }}
                  className="block w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                />
              </div>

              {urlAdminDP && urlAdminDP?.url ? (
                <Image
                  src={urlAdminDP?.url}
                  alt={"admin-profile-photo"}
                  width={150}
                  height={100}
                  className="mt-2 rounded-md shadow"
                />
              ) : (
                <Image
                  src={urlAdminDP}
                  alt={"admin-profile-photo"}
                  width={150}
                  height={100}
                  className="mt-2 rounded-md shadow"
                />
              )}

              {selectedAdminFile && (
                <button
                  type="button"
                  onClick={async () => {
                    setIsUploadingAdmin(true);
                    try {
                      const { url, public_id } = await handleFileChange(
                        { target: { files: [selectedAdminFile] } },
                        "administrator-photo",
                        `adm-${indexNoRef.current.value}-dp`,
                        schoolID
                      );

                      if (url) {
                        if (
                          isEditing?.urlAdminDPID &&
                          isEditing?.urlAdminDPID !== public_id &&
                          user?.photoURL !== defaultUrlDP
                        ) {
                          await deleteCloudinaryImage(isEditing.urlAdminDPID);
                        }

                        setUrlAdminDP(url);
                        setUrlAdminDPID(public_id);
                        setSelectedAdminFile(null);
                      }
                    } finally {
                      setIsUploadingAdmin(false);
                    }
                  }}
                  className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-500"
                >
                  {isUploadingAdmin ? (
                    <div className="flex flex-col items-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full  animate-spin"></div>
                      <span className="text-xs mt-1">Uploading...</span>
                    </div>
                  ) : (
                    "Upload Photo"
                  )}
                </button>
              )}
            </div>

            {/* Upload School Photo Field */}
            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Upload School Photo
              </label>
              <div className="mt-2">
                <input
                  id="photo"
                  name="school-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setSelectedSchoolFile(file);
                    setUrlDP(URL.createObjectURL(file));
                  }}
                  className="block w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                />
              </div>

              {urlDP && (
                <Image
                  src={urlDP}
                  alt={"school-profile-photo"}
                  width={250}
                  height={150}
                  className="mt-2 rounded-md shadow"
                />
              )}
            </div>

            {selectedSchoolFile && (
              <button
                type="button"
                onClick={async () => {
                  setIsUploadingSchool(true);
                  try {
                    const { url, public_id } = await handleFileChange(
                      { target: { files: [selectedSchoolFile] } },
                      "school-photo",
                      `sch-${indexNoRef.current.value}-dp`,
                      schoolID
                    );

                    if (url) {
                      if (
                        isEditing?.urlDPID &&
                        isEditing?.urlDPID !== public_id &&
                        isEditing?.urlDP !== defaultSchoolDP
                      ) {
                        await deleteCloudinaryImage(isEditing.urlDPID);
                      }

                      setUrlDP(url);
                      setUrlDPID(public_id);
                      setSelectedSchoolFile(null);
                    }
                  } finally {
                    setIsUploadingSchool(false);
                  }
                }}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-500"
              >
                {isUploadingSchool ? (
                  <div className="flex flex-col items-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full  animate-spin"></div>
                    <span className="text-xs mt-1">Uploading...</span>
                  </div>
                ) : (
                  "Upload Photo"
                )}
              </button>
            )}

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit" ? "Update" : "Add"}
              </button>
              {isAddModalOpen && (
                <AddModal
                  modalType="School"
                  open={isAddModalOpen}
                  onClose={handleAddModalClose}
                  onConfirm={handleFormSubmit}
                />
              )}
              <button
                onClick={handleModalClose}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
