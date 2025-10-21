"use client";
import { useTheme } from "@/context/themeContext";
import React, { useEffect, useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { Teachers } from "@/firestore/documents/teacher";
import { useUserContext } from "@/context/UserContext";

export default function AddNewTeacherForm({
  handleModalClose,
  title,
  fetchTeachers,
}) {
  const teacherNameRef = useRef();
  const subjectRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const sceretQtsRef = useRef();
  const sceretAnsRef = useRef();
  const qualificationRef = useRef();

  const [urlDP, setUrlDP] = useState("NA");

  const {
    isEditing,
    isAddModalOpen,
    handleAddModalOpen,
    handleAddModalClose,
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

  const [teacherFormData, setTeacherFormData] = useState({
    teacherName: isEditing?.teacherName || "",
    subject: isEditing?.subject || "",
    email: isEditing?.email || "",
    password: isEditing?.password || "",
    sceretQts: isEditing?.sceretQts || "",
    sceretAns: isEditing?.sceretAns || "",
    qualification: isEditing?.qualification || "",
    urlDP: isEditing?.urlDP || "",
  });

  useEffect(() => {
    setTeacherFormData({
      teacherName: isEditing?.teacherName || "",
      subject: isEditing?.subject || "",
      email: isEditing?.email || "",
      password: isEditing?.password || "",
      sceretQts: isEditing?.sceretQts || "",
      sceretAns: isEditing?.sceretAns || "",
      qualification: isEditing?.qualification || "",
      urlDP: isEditing?.urlDP || "",
    });
  }, [isEditing]);

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setTeacherFormData((prevData) => ({
  //     ...prevData,
  //     image: file,
  //   }));
  // };

  const handleFormSubmit = async () => {
    const finalUrlDP = urlDP !== undefined ? urlDP : "No URL";

    if (title === "Add") {
      const newTeacher = new Teachers(
        teacherNameRef.current.value,
        subjectRef.current.value,
        emailRef.current.value,
        passwordRef.current.value,
        sceretQtsRef.current.value,
        sceretAnsRef.current.value,
        qualificationRef.current.value,
        finalUrlDP,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA",
        schoolID
      );
      retval = await newTeacher.addTeacher();
    } else if (title === "Edit") {
      const existsingTeacher = new Teachers(
        teacherNameRef.current.value,
        subjectRef.current.value,
        emailRef.current.value,
        passwordRef.current.value,
        sceretQtsRef.current.value,
        sceretAnsRef.current.value,
        qualificationRef.current.value,
        isEditing?.urlDP,
        isEditing?.createdDate,
        isEditing?.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing?.schoolID,
        isEditing?.teacherID
      );
      retval = await existsingTeacher.updateTeacher();
    }

    handleModalClose();
    setTeacherFormData({
      teacherName: teacherNameRef.current.value,
      subject: subjectRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      sceretQts: sceretQtsRef.current.value,
      sceretAns: sceretAnsRef.current.value,
      qualification: qualificationRef.current.value,
    });
    fetchTeachers();
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-[--text] capitalize">
            {title === "Edit" ? "Edit Details" : "Add Teacher Details"}
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
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Teacher Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={teacherFormData?.teacherName}
                  placeholder="e.g John Doe"
                  required
                  ref={teacherNameRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Subject
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="subject"
                  name="subject"
                  defaultValue={teacherFormData?.subject}
                  type="text"
                  placeholder="e.g Mathematics"
                  required
                  ref={subjectRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Qualification
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="qualification"
                  name="qualification"
                  defaultValue={teacherFormData?.qualification}
                  type="text"
                  placeholder="e.g Primary"
                  required
                  ref={qualificationRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  defaultValue={teacherFormData?.email}
                  name="email"
                  type="email"
                  placeholder="e.g teacher@gmail.com"
                  required
                  ref={emailRef}
                  autoComplete="email"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
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
                    defaultValue={teacherFormData?.password}
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
                    defaultValue={teacherFormData?.password}
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
                  defaultValue={teacherFormData?.sceretQts}
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
                  defaultValue={teacherFormData?.sceretAns}
                  placeholder="e.g Coco"
                  required
                  ref={sceretAnsRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
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
                    id="photo"
                    required
                    name="teacher-profile"
                    type="file"
                    accept="image/*"
                    onChange={async (e) =>
                      setUrlDP(
                        await handleFileChange(
                          e,
                          "teacher-profile",
                          `ter-${emailRef.current.value}-dp`,
                          schoolID
                        )
                      )
                    }
                    className="block w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                  />
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {title === "Edit" ? "Update" : "Add"}
              </button>
              {isAddModalOpen && (
                <AddModal
                  isOpen={isAddModalOpen}
                  onClose={handleAddModalClose}
                  onConfirm={handleFormSubmit}
                  modalType="Teacher"
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
