"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { Parents } from "@/firestore/documents/parent";
import { useUserContext } from "@/context/UserContext";

export default function AddNewParentForm({
  handleModalClose,
  title,
  fetchParents,
}) {
  const parentNameRef = useRef();
  const qualificationRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const sceretQtsRef = useRef();
  const sceretAnsRef = useRef();
  const noOfChildrenRef = useRef();
  const addressRef = useRef();
  const contactRef = useRef();

  const [urlDP, setUrlDP] = useState("NA");

  const {
    isEditing,
    handleAddModalClose,
    isAddModalOpen,
    handleAddModalOpen,
    schoolID,
    setSchoolID,
    handleFileChange,
  } = useTheme();
  const { user } = useUserContext();

  let retval;

  const loggedInUserID = user?.uid ? user?.uid : "NA";
  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      setSchoolID(schoolID);
    }
  }, []);

  const [parentFormData, setParentFormData] = useState({
    parentName: isEditing?.parentName || "",
    qualification: isEditing?.qualification || "",
    email: isEditing?.email || "",
    password: isEditing?.password || "",
    sceretQts: isEditing?.sceretQts || "",
    sceretAns: isEditing?.sceretAns || "",
    noOfChildren: parseInt(isEditing?.noOfChildren) || "",
    address: isEditing?.address || "",
    contact: isEditing?.contact || "",
    urlDP: isEditing?.urlDP || "",
  });

  useEffect(() => {
    setParentFormData({
      parentName: isEditing?.parentName || "",
      qualification: isEditing?.qualification || "",
      email: isEditing?.email || "",
      password: isEditing?.password || "",
      sceretQts: isEditing?.sceretQts || "",
      sceretAns: isEditing?.sceretAns || "",
      noOfChildren: parseInt(isEditing?.noOfChildren) || "",
      address: isEditing?.address || "",
      contact: isEditing?.contact || "",
      urlDP: isEditing?.urlDP || "",
    });
  }, [isEditing]);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setParentFormData((prevData) => ({
  //     ...prevData,
  //     image: file,
  //   }));
  // };

  const handleFormSubmit = async () => {
    const finalUrlDP = urlDP !== undefined ? urlDP : "No URL";

    if (title === "Add") {
      const newParent = new Parents(
        parentNameRef.current.value,
        qualificationRef.current.value,
        emailRef.current.value,
        passwordRef.current.value,
        sceretQtsRef.current.value,
        sceretAnsRef.current.value,
        parseInt(noOfChildrenRef.current.value),
        addressRef.current.value,
        contactRef.current.value,
        finalUrlDP,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA",
        schoolID
      );
      retval = await newParent.addParent();
    } else if (title === "Edit") {
      const existsingParent = new Parents(
        parentNameRef.current.value,
        qualificationRef.current.value,
        emailRef.current.value,
        passwordRef.current.value,
        sceretQtsRef.current.value,
        sceretAnsRef.current.value,
        parseInt(noOfChildrenRef.current.value),
        addressRef.current.value,
        contactRef.current.value,
        isEditing?.urlDP,
        isEditing?.createdDate,
        isEditing?.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing?.schoolID,
        isEditing?.parentID
      );
      retval = await existsingParent.updateParent();
    }

    handleModalClose();
    setParentFormData({
      parentName: parentNameRef.current.value,
      qualification: qualificationRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      sceretQts: sceretQtsRef.current.value,
      sceretAns: sceretAnsRef.current.value,
      noOfChildren: noOfChildrenRef.current.value,
      address: addressRef.current.value,
      contact: contactRef.current.value,
    });
    fetchParents();
    console.log("working in parent");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-gray-100 capitalize">
            {title === "Edit" ? "Edit Details" : "Add Parent Details"}
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
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Parent Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={parentFormData?.parentName}
                  placeholder="e.g John Doe"
                  required
                  ref={parentNameRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="qualification"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Qualification
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="qualification"
                  name="qualification"
                  defaultValue={parentFormData?.qualification}
                  type="text"
                  placeholder="e.g MSc Computer Science"
                  required
                  ref={qualificationRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Email address
              </label>
              {title === "Edit" ? (
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={parentFormData?.email}
                    placeholder="e.g parent@gmail.com"
                    disabled
                    ref={emailRef}
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={parentFormData?.email}
                    placeholder="e.g parent@gmail.com"
                    required
                    ref={emailRef}
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Password
              </label>
              {title === "Edit" ? (
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    defaultValue={parentFormData?.password}
                    placeholder="e.g xxxxxxxx"
                    disabled
                    ref={passwordRef}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    defaultValue={parentFormData?.password}
                    placeholder="e.g xxxxxxxx"
                    required
                    ref={passwordRef}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                  />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="secretQts"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Secret Question
              </label>
              <div className="mt-2">
                <input
                  id="secretQts"
                  name="secretQts"
                  type="text"
                  defaultValue={parentFormData?.sceretQts}
                  placeholder="e.g Your pet's name?"
                  required
                  ref={sceretQtsRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="secretAns"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Secret Answer
              </label>
              <div className="mt-2">
                <input
                  id="secretAns"
                  name="secretAns"
                  type="text"
                  defaultValue={parentFormData?.sceretAns}
                  placeholder="e.g Fluffy"
                  required
                  ref={sceretAnsRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="noOfChildren"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Children
              </label>
              <div className="mt-2">
                <input
                  id="noOfChildren"
                  name="noOfChildren"
                  type="text"
                  defaultValue={parentFormData?.noOfChildren}
                  placeholder="e.g 2"
                  required
                  ref={noOfChildrenRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Address
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  defaultValue={parentFormData?.address}
                  placeholder="e.g 123 Street, City"
                  required
                  ref={addressRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Contact Number
              </label>
              <div className="mt-2">
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  pattern="[0-9]{10}"
                  defaultValue={parentFormData?.contact}
                  placeholder="e.g +1234567890"
                  required
                  ref={contactRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Upload Photo
              </label>
              <div className="mt-2">
                {title === "Edit" ? (
                  <>
                    <img src={isEditing?.urlDP} width="150px" />
                  </>
                ) : (
                  <input
                    id="image"
                    required
                    name="parent-profile"
                    type="file"
                    accept="image/*"
                    onChange={async (e) =>
                      setUrlDP(
                        await handleFileChange(
                          e,
                          "parent-profile",
                          `par-${contactRef.current.value}-dp`,
                          schoolID
                        )
                      )
                    }
                    className="block w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 py-2 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 sm:text-sm dark:bg-indigo-500 dark:ring-indigo-500 dark:hover:bg-indigo-600"
            >
              {title === "Edit" ? "Save Changes" : "Add Parent"}
            </button>
          </form>
        </div>
      </div>

      {isAddModalOpen && (
        <AddModal
          modalType="Parent"
          open={isAddModalOpen}
          onClose={handleAddModalClose}
          onConfirm={handleFormSubmit}
          title={title === "Edit" ? "Edit Parent Details" : "Add New Parent"}
        />
      )}
    </>
  );
}
