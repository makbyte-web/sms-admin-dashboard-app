"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import AddModal from "../ui/addModal";
import { Students } from "@/firestore/documents/student";
import { useUserContext } from "@/context/UserContext";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import QRCode from "qrcode";
import { defaultUrlDP } from "@/defaults";
import { deleteCloudinaryImage } from "@/actions/file";
import Image from "next/image";

export default function AddNewStudentForm({ handleModalClose, fetchStudents }) {
  const {
    isEditing,
    isAddModalOpen,
    handleAddModalOpen,
    handleAddModalClose,
    schoolID,
    setSchoolID,
    handleFileChange,
    title,
    selectedFile,
    setSelectedFile,
  } = useTheme();
  const nameRef = useRef();
  const stdRef = useRef();
  const divRef = useRef();
  const emailRef = useRef();
  const grNoRef = useRef();
  const [schoolFormData, setSchoolFormData] = useState({
    name: isEditing?.studentName || "",
    stdRef: isEditing?.stdID || "",
    divRef: isEditing?.divID || "",
    email: isEditing?.email || "",
    grno: isEditing?.grNo || "",
    urlDP: isEditing?.urlDP || "",
    urlQR: isEditing?.urlQR || "",
  });

  const [urlDP, setUrlDP] = useState(
    schoolFormData?.urlDP ? schoolFormData?.urlDP : defaultUrlDP
  );

  const [cloudinaryImageId, setCloudinaryImageId] = useState(
    isEditing?.cloudinaryImageId || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [academicYear, setAcademicYear] = useState("");

  const { user } = useUserContext();

  let retval;

  const loggedInUserID = user?.uid ? user?.uid : "NA";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const academicYear =
        JSON.parse(localStorage.getItem("academicYear")) || "NA";
      setSchoolID(schoolID);
      setAcademicYear(academicYear);
    }
  }, []);

  const [standard, setStandard] = useState();
  const [division, setDivision] = useState();

  const generateQR = async (data) => {
    try {
      const url = await QRCode.toDataURL(JSON.stringify(data));
      if (url) {
        return url;
      } else {
        return "No QR";
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchStdDiv() {
      const result1 = await Standards.getStandardsBySchool(schoolID);
      const result2 = await Divisions.getDivisionsBySchool(schoolID);
      result1.sort((std1, std2) => std1.stdName.localeCompare(std2.stdName));
      result2.sort((div1, div2) => div1.divName.localeCompare(div2.divName));
      if (result1) setStandard(result1);
      if (result2) setDivision(result2);
    }
    fetchStdDiv();
  }, [schoolID]);

  useEffect(() => {
    setSchoolFormData({
      name: isEditing?.studentName || "",
      stdRef: isEditing?.stdID || "",
      divRef: isEditing?.divID || "",
      email: isEditing?.email || "",
      grno: isEditing?.grno || "",
      urlDP: isEditing?.urlDP || "",
      urlQR: isEditing?.urlQR || "",
    });
  }, [isEditing]);

  const handleFormSubmit = async () => {
    let studentReturnID = "";
    const finalUrlDP = urlDP !== undefined ? urlDP : defaultUrlDP;

    if (title === "Add") {
      const newStudent = new Students(
        schoolID,
        nameRef.current.value,
        stdRef.current.value,
        divRef.current.value,
        emailRef.current.value,
        grNoRef.current.value,
        academicYear,
        finalUrlDP,
        "NA",
        cloudinaryImageId,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA"
      );
      studentReturnID = await newStudent.addStudent();
      // if (retval) alert(`Student added with ID:${studentReturnID}`);
      const finalUrlQR = await generateQR({
        schoolID: schoolID,
        studentName: nameRef.current.value,
        studentID: studentReturnID,
        academicYear: academicYear,
        stdID: stdRef.current.value,
        divID: divRef.current.value,
        grNO: grNoRef.current.value,
      });

      if (finalUrlQR) {
        // update student with QR code
        const studentWithQR = new Students(
          schoolID,
          newStudent.studentName,
          newStudent.stdID,
          newStudent.divID,
          newStudent.email,
          newStudent.grNo,
          newStudent.academicYear,
          newStudent.urlDP,
          finalUrlQR,
          cloudinaryImageId,
          newStudent.createdDate,
          newStudent.createdBy,
          newStudent.updatedDate,
          newStudent.updatedBy,
          studentReturnID
        );
        retval = await studentWithQR.updateStudent();
        // alert(`Student updated with QR Code ${retval}`);
      }
    } else if (title === "Edit") {
      const existsingStudent = new Students(
        schoolID,
        nameRef.current.value,
        stdRef.current.value,
        divRef.current.value,
        emailRef.current.value,
        grNoRef.current.value,
        academicYear,
        finalUrlDP,
        isEditing?.urlQR,
        cloudinaryImageId,
        isEditing?.createdDate,
        isEditing?.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        isEditing?.studentID
      );
      studentReturnID = await existsingStudent.updateStudent();
      // if (retval) alert(`Student updated with ID:${studentReturnID}`);

      // Update QR code if needed will uncomment below code
      const finalUrlQR = await generateQR({
        schoolID: schoolID,
        studentName: nameRef.current.value,
        studentID: studentReturnID,
        academicYear: academicYear,
        stdID: stdRef.current.value,
        divID: divRef.current.value,
        grNO: grNoRef.current.value,
      });

      if (finalUrlQR) {
        // update student with QR code
        const studentWithQR = new Students(
          schoolID,
          existsingStudent.studentName,
          existsingStudent.stdID,
          existsingStudent.divID,
          existsingStudent.email,
          existsingStudent.grNo,
          existsingStudent.academicYear,
          existsingStudent.urlDP,
          finalUrlQR,
          existsingStudent.cloudinaryImageId,
          existsingStudent.createdDate,
          existsingStudent.createdBy,
          existsingStudent.updatedDate,
          existsingStudent.updatedBy,
          studentReturnID
        );
        retval = await studentWithQR.updateStudent();
        // alert(`Student updated with QR Code ${retval}`);
      }
    }
    handleModalClose();
    setSchoolFormData({
      name: nameRef.current.value,
      stdRef: stdRef.current.value,
      divRef: divRef.current.value,
      email: emailRef.current.value,
      grno: grNoRef.current.value,
    });
    fetchStudents();
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-[--text] capitalize">
          {title === "Edit" ? "Edit Details" : "Add Student Details"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <form onSubmit={handleFormSubmit} method="POST" className="space-y-6"> */}
        <form
          // action={acceptFileToUpload}
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
              Student Name
            </label>
            <div className="mt-2">
              <input
                required
                id="name"
                name="name"
                type="text"
                placeholder="e.g Khan Aftab"
                defaultValue={schoolFormData.name}
                ref={nameRef}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>
          {/* stdID dropdown */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="stdID"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Standard
              </label>
            </div>
            <div className="mt-2">
              <select
                id="stdID"
                name="stdID"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                ref={stdRef}
                required
              >
                <option value="Select">Select Standard</option>
                {title === "Edit"
                  ? standard &&
                    standard.length &&
                    standard.map((item) => {
                      return (
                        <option
                          key={item.stdID}
                          value={item.stdID}
                          selected={
                            isEditing.stdID === item.stdID ? true : false
                          }
                        >
                          {item.stdName}
                        </option>
                      );
                    })
                  : standard &&
                    standard?.length &&
                    standard?.map((item) => {
                      return (
                        <option key={item.stdID} value={item.stdID}>
                          {item.stdName}
                        </option>
                      );
                    })}
              </select>
            </div>
          </div>
          {/* divID dropdown */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="divID"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Division
              </label>
            </div>
            <div className="mt-2">
              <select
                id="divID"
                name="divID"
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                ref={divRef}
                required
              >
                <option value="Select">Select Division</option>
                {title === "Edit"
                  ? division &&
                    division?.length &&
                    division?.map((item) => {
                      return (
                        <option
                          key={item.divID}
                          value={item.divID}
                          selected={
                            isEditing.divID === item.divID ? true : false
                          }
                        >
                          {item.divName}
                        </option>
                      );
                    })
                  : division &&
                    division?.length &&
                    division?.map((item) => {
                      return (
                        <option key={item.divID} value={item.divID}>
                          {item.divName}
                        </option>
                      );
                    })}
              </select>
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
                required
                id="email"
                name="email"
                type="email"
                placeholder="e.g student@gmail.com"
                defaultValue={schoolFormData.email}
                ref={emailRef}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="grno"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Gr.no
              </label>
            </div>
            <div className="mt-2">
              <input
                required
                id="grno"
                name="grno"
                type="text"
                placeholder="e.g 12345"
                defaultValue={schoolFormData.grno}
                ref={grNoRef}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
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
            {!isEditing?.urlDP && (
              <p className="text-sm">Please upload file maximum size of 1 MB</p>
            )}

            <div className="mt-2">
              <input
                id="photo"
                name="student-profile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setSelectedFile(file);
                  setUrlDP(URL.createObjectURL(file)); 
                }}
                className="block w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-4 text-gray-900 dark:text-gray-200 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
              />

              {(urlDP || isEditing?.urlDP) && (
                <Image
                  src={urlDP ? urlDP : isEditing?.urlDP}
                  alt={"student-profile-photo"}
                  width={150}
                  height={100}
                  className="mt-2 rounded-md shadow"
                />
              )}

              {selectedFile && (
                <button
                  type="button"
                  onClick={async () => {
                    setIsUploading(true);
                    try {
                      const { url: uploadedUrl, public_id: publicId } =
                        await handleFileChange(
                          { target: { files: [selectedFile] } },
                          "student-profile",
                          `std-${grNoRef.current.value}-dp`,
                          schoolID
                        );

                      if (uploadedUrl) {
                        if (
                          title === "Edit" &&
                          isEditing?.cloudinaryImageId &&
                          isEditing?.cloudinaryImageId !== publicId &&
                          isEditing?.urlDP !== defaultUrlDP
                        ) {
                          await deleteCloudinaryImage(
                            isEditing.cloudinaryImageId
                          );
                        }
                        setUrlDP(uploadedUrl);
                        setSelectedFile(null);
                        setCloudinaryImageId(publicId);
                      }
                    } catch (error) {
                      console.error("Error uploading file:", error);
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-500 transition disabled:opacity-50"
                >
                  {isUploading ? (
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
          </div>
          {title === "Edit" ? (
            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                QR Code
              </label>
              <div className="mt-2">
                <Image src={isEditing?.urlQR} width={100} height={100} alt={"student-QR-code"}/>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            >
              {title === "Edit" ? "Update" : "Add"}
            </button>
            {isAddModalOpen && (
              <AddModal
                isOpen={isAddModalOpen}
                onClose={handleAddModalClose}
                onConfirm={handleFormSubmit}
                modalType="Student"
              />
            )}
            <button
              onClick={handleModalClose}
              type="button"
              data-autofocus
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
