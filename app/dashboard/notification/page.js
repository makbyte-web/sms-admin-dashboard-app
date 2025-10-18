"use client";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import Header from "@/app/components/ui/header";
import { Standards } from "@/firestore/documents/standard";
import { Divisions } from "@/firestore/documents/division";
import { Notifications } from "@/firestore/documents/notification";
import { Students } from "@/firestore/documents/student";
import { ParentStudents } from "@/firestore/documents/parentStudents";
import { ParentFCMToken } from "@/firestore/documents/parentFCMToken";

const Notification = () => {
  const senderOptions = [
    { value: "Select", label: "Select Sender" },
    { value: "Principal", label: "Principal" },
    { value: "Office", label: "Office" },
    { value: "Manager", label: "Manager" },
    { value: "Class Teacher", label: "Class Teacher" },
  ];

  const tableHeaders = [
    { key: "academicYear", label: "Academic Year" },
    { key: "heading", label: "Heading" },
    { key: "message", label: "Message" },
    { key: "sender", label: "Sender" },
    { key: "intendedFor", label: "Intended For" },
    { key: "status", label: "Status" },
    { key: "createdDate", label: "Created Date" },
    { key: "actions", label: "Actions", srOnly: true },
  ];

  const senderRef = useRef();
  const headingRef = useRef();
  const messageRef = useRef();
  const schoolRef = useRef();
  const standardRef = useRef();
  const sectionRef = useRef();
  const stdClassRef = useRef();
  const stdRef = useRef();
  const divRef = useRef();

  const [standard, setStandard] = useState();
  const [division, setDivision] = useState();
  const [parentsFCMData, setParentsFCMData] = useState();
  const [students, setStudents] = useState();
  const [parentStudents, setParentStudents] = useState();

  const [schoolID, setSchoolID] = useState(null);
  const [userType, setUserType] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);
  const [intendedFor, setIntendedFor] = useState("School");
  const [notification, setNotification] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editable, setEditable] = useState(false);
  const [editData, setEditData] = useState({});

  const { user } = useUserContext();

  let retval;
  const loggedInUserID = user?.uid ? user?.uid : "NA";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const schoolID = JSON.parse(localStorage.getItem("schoolID")) || "NA";
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      const academicYear =
        JSON.parse(localStorage.getItem("academicYear")) || "NA";
      setSchoolID(schoolID);
      setUserType(userType);
      setAcademicYear(academicYear);
    }
  }, []);

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
    async function fetchNotifications() {
      if (userType === "superadmin" || userType === "schooladmin") {
        const result = await Notifications.getNotificationsBySchool(schoolID);

        if (result) setNotification(result);
      }
    }
    fetchNotifications();
  }, [refresh, schoolID, userType]);

  useEffect(() => {
    async function fetchFCMData() {
      const result = await ParentFCMToken.getParentFCMTokensBySchool(schoolID);
      const result1 = await Students.getStudentsBySchool(schoolID);
      const result2 = await ParentStudents.getParentStudentsBySchool(schoolID);

      if (result) setParentsFCMData(result);
      if (result1) setStudents(result1);
      if (result2) setParentStudents(result2);
    }
    fetchFCMData();
  }, [schoolID]);

  const handleSave = async (e) => {
    e.preventDefault();
    const status = editable ? "Edited" : "Draft";
    let stdID, divID;
    if (sectionRef.current.checked) {
      stdID = stdRef.current.value;
      divID = divRef.current.value;
    } else if (standardRef.current.checked) {
      stdID = stdClassRef.current.value;
      divID = "NA";
    } else {
      stdID = "NA";
      divID = "NA";
    }

    if (
      senderRef.current.value !== "Select" &&
      headingRef.current.value !== "" &&
      messageRef.current.value !== ""
    ) {
      if (stdID !== "Select" && divID !== "Select") {
        if (editable) {
          const existingNotification = new Notifications(
            schoolID,
            academicYear,
            senderRef.current.value,
            headingRef.current.value,
            messageRef.current.value,
            intendedFor,
            stdID,
            divID,
            status,
            editData?.createdDate,
            editData?.createdBy,
            new Date().toLocaleDateString("en-IN"),
            loggedInUserID,
            editData?.notificationID
          );

          retval = await existingNotification.updateNotification();
          if (retval) setRefresh(true);
          setEditable(false);
          senderRef.current.value = "Select";
          headingRef.current.value = "";
          messageRef.current.value = "";
          stdClassRef.current.value = "Select";
          stdRef.current.value = "Select";
          divRef.current.value = "Select";
          alert(
            `Notification ${editData?.notificationID} updated successfully`
          );
        } else {
          const newNotification = new Notifications(
            schoolID,
            academicYear,
            senderRef.current.value,
            headingRef.current.value,
            messageRef.current.value,
            intendedFor,
            stdID,
            divID,
            status,
            new Date().toLocaleDateString("en-IN"),
            loggedInUserID,
            "NA",
            "NA"
          );
          retval = await newNotification.addNotification();
          if (retval) setRefresh(true);
          senderRef.current.value = "Select";
          headingRef.current.value = "";
          messageRef.current.value = "";
          alert(`New Notification saved with ${retval}`);
        }
      } else {
        alert("Standard or Division should be properly selected");
        return;
      }
    } else {
      alert("Sender, Heading and Message cannot be empty");
      return;
    }
  };

  const handleSelection = (event) => {
    const optionSelected = event.target.value;
    const StandardSelection = document.getElementById("StandardSelection");
    const DivisionSelection = document.getElementById("DivisionSelection");
    if (optionSelected === "Section") {
      sectionRef.current.checked = true;
      standardRef.current.checked = false;
      schoolRef.current.checked = false;
      StandardSelection.style.display = "none";
      DivisionSelection.style.display = "block";
    } else if (optionSelected === "Standard") {
      standardRef.current.checked = true;
      sectionRef.current.checked = false;
      schoolRef.current.checked = false;
      StandardSelection.style.display = "block";
      DivisionSelection.style.display = "none";
    } else {
      schoolRef.current.checked = true;
      standardRef.current.checked = false;
      sectionRef.current.checked = false;
      StandardSelection.style.display = "none";
      DivisionSelection.style.display = "none";
    }
    setIntendedFor(optionSelected);
  };

  const handleDelete = async (notificationID) => {
    setRefresh(false);
    if (notificationID) {
      const result = await Notifications.deleteNotification(notificationID);
      if (result) {
        setRefresh(true);
        alert(`Notification ${notificationID} deleted sucessfully`);
      } else {
        alert(`Issue in deleting Notification ${notificationID}`);
      }
    }
  };

  const handleEdit = async (notification) => {
    setIntendedFor(notification?.intendedFor);
    setEditData(notification);
    if (notification) {
      senderRef.current.value = notification?.sender;
      headingRef.current.value = notification?.heading;
      messageRef.current.value = notification?.message;
      const StandardSelection = document.getElementById("StandardSelection");
      const DivisionSelection = document.getElementById("DivisionSelection");
      if (notification?.intendedFor === "Section") {
        sectionRef.current.checked = true;
        standardRef.current.checked = false;
        schoolRef.current.checked = false;
        StandardSelection.style.display = "none";
        DivisionSelection.style.display = "block";
        stdRef.current.value = notification?.stdID;
        divRef.current.value = notification?.divID;
      } else if (notification?.intendedFor === "Standard") {
        standardRef.current.checked = true;
        sectionRef.current.checked = false;
        schoolRef.current.checked = false;
        StandardSelection.style.display = "block";
        DivisionSelection.style.display = "none";
        stdClassRef.current.value = notification?.stdID;
      } else {
        schoolRef.current.checked = true;
        standardRef.current.checked = false;
        sectionRef.current.checked = false;
        StandardSelection.style.display = "none";
        DivisionSelection.style.display = "none";
      }
    }
  };

  const formRef = useRef(null);
  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getFCMToken = async (students) => {
    const parentsData = [];
    students?.forEach(async (student) => {
      parentStudents?.forEach(async (parent) => {
        parent?.children?.forEach(async (childID) => {
          if (childID === student?.studentID) {
            parentsData.push(parent);
          }
        });
      });
    });

    const fcmTokenData = [];
    parentsData?.forEach(async (parent) => {
      parentsFCMData?.forEach(async (item) => {
        if (item?.parentID === parent?.parentID) {
          fcmTokenData.push(item?.fcmToken);
        }
      });
    });

    return fcmTokenData;
  };

  const handleSend = async (notification) => {
    const { intendedFor, stdID, divID } = notification;
    let fcmData = [];

    if (intendedFor === "Section") {
      const specificSectionStudents = students.filter(
        (student) => student?.stdID === stdID && student?.divID === divID
      );
      fcmData = await getFCMToken(specificSectionStudents);
    } else if (intendedFor === "Standard") {
      const specificStandardStudents = students.filter(
        (student) => student?.stdID === stdID
      );
      fcmData = await getFCMToken(specificStandardStudents);
    } else {
      // Entire School
      fcmData = parentsFCMData?.map((item) => item.fcmToken);
    }

    if (fcmData?.length) {
      fcmData?.forEach(async (token) => {
        await sendNotification(token, notification);
      });

      alert(`Notification Sent to ${notification?.intendedFor}.`);

      // updataion of Notiifcation status to "Dispatch"
      const existingNotification = new Notifications(
        notification?.schoolID,
        notification?.academicYear,
        notification?.sender,
        notification?.heading,
        notification?.message,
        notification?.intendedFor,
        notification?.stdID,
        notification?.divID,
        "Dispatch",
        notification?.createdDate,
        notification?.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        notification?.notificationID
      );

      retval = await existingNotification.updateNotification();
      if (retval) setRefresh(true);

      alert(
        `Notification ${notification?.notificationID} status updated successfully`
      );
    } else {
      alert(`No token found for ${notification?.intendedFor}.`);
      return;
    }
  };

  const sendNotification = async (token, notification) => {
    try {
      const response = await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pushToken: token,
          title: "Notification",
          subheading: notification?.heading,
          QRInfo: { ...notification },
        }),
      });

      const data = await response.json();
      console.log("Push notification response");
      // alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification.");
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden flex flex-col items-center p-4 sm:p-6"
      ref={formRef}
    >
      <Header currentPage={"Notifications"}></Header>

      {academicYear !== "NA" ? (
        <>
          {userType === "superadmin" ? (
            <p className="text-center text-gray-600 dark:text-gray-300 px-4">
              Notifications can only be sent by School Admin.
            </p>
          ) : (
            <>
              {/* Form Section */}
              <div className="mt-6 w-full max-w-2xl space-y-6">
                {/* Sender Selection */}
                <div className="group">
                  <label
                    htmlFor="sender"
                    className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
                  >
                    Sender
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="sender"
                      name="sender"
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer"
                      ref={senderRef}
                      required
                    >
                      {senderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Heading Input */}
                <div className="group">
                  <label
                    htmlFor="heading"
                    className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
                  >
                    Heading
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="heading"
                      name="heading"
                      type="text"
                      ref={headingRef}
                      placeholder="Reminder | Notice | Occasion etc"
                      required
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="group">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
                  >
                    Message
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Message associated with heading"
                      rows={4}
                      ref={messageRef}
                      required
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 resize-none sm:text-sm"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                      Press Enter for new line
                    </div>
                  </div>
                </div>

                {/* Intended For Radio Buttons */}
                <div className="group">
                  <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-3">
                    Intended For
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="intendedFor"
                        id="intendedForSchool"
                        value="School"
                        ref={schoolRef}
                        onChange={handleSelection}
                        defaultChecked
                        className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Entire School
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="intendedFor"
                        id="intendedForStandard"
                        value="Standard"
                        ref={standardRef}
                        onChange={handleSelection}
                        className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Specific Standard
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="intendedFor"
                        id="intendedForSection"
                        value="Section"
                        ref={sectionRef}
                        onChange={handleSelection}
                        className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                        Specific Section
                      </span>
                    </label>
                  </div>
                </div>

                {/* Standard Selection */}
                <div id="StandardSelection" className="hidden">
                  <label
                    htmlFor="stdID"
                    className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
                  >
                    Select Standard
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="stdID"
                      name="stdID"
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer"
                      ref={stdClassRef}
                      required
                    >
                      <option value="Select" disabled>
                        Choose a standard...
                      </option>
                      {standard?.map((item) => (
                        <option key={item.stdID} value={item.stdID}>
                          {item.stdName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Division Selection */}
                <div id="DivisionSelection" className="hidden space-y-4">
                  <div>
                    <label
                      htmlFor="stdID"
                      className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
                    >
                      Select Standard
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="stdID"
                        name="stdID"
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer"
                        ref={stdRef}
                        required
                      >
                        <option value="Select" disabled>
                          Choose a standard...
                        </option>
                        {standard?.map((item) => (
                          <option key={item.stdID} value={item.stdID}>
                            {item.stdName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="divID"
                      className="block text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2"
                    >
                      Select Division
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="divID"
                        name="divID"
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-3 px-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none cursor-pointer"
                        ref={divRef}
                        required
                      >
                        <option value="Select" disabled>
                          Choose a division...
                        </option>
                        {division?.map((item) => (
                          <option key={item.divID} value={item.divID}>
                            {item.divName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={(event) => handleSave(event)}
                    type="button"
                    className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    {editable ? "Update Message" : "Save Message"}
                  </button>
                </div>
              </div>

              <div className="w-full max-w-6xl mt-8">
                {notification && notification.length ? (
                  <div className="mb-10">
                    <div className="text-center mb-6">
                      <span className="text-xl sm:text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
                        Notifications List
                      </span>
                    </div>

                    <div className="w-full min-h-screen ">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full align-middle px-4 sm:px-6 lg:px-8">
                          <div className="shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-x-auto">
                            <table className="min-w-[700px] w-full divide-y divide-gray-300 dark:divide-[--bg]">
                              <thead className="bg-[--bgBlue] dark:bg-[--bg] sticky top-0 z-10">
                                <tr>
                                  {tableHeaders.map((header) => (
                                    <th
                                      key={header.key}
                                      scope="col"
                                      className="py-3.5 px-3 text-left text-sm font-semibold text-white"
                                    >
                                      {header.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-gray-200 dark:divide-[--bg] bg-white dark:bg-[#353e4b]">
                                {notification?.map((list, i) => (
                                  <tr key={i}>
                                    <td className="whitespace-nowrap py-4 px-4 text-sm font-medium dark:text-gray-100">
                                      {list?.academicYear}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                                      {list?.heading}
                                    </td>
                                    <td className="px-3 py-4 text-sm dark:text-gray-200">
                                      {list?.message}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                                      {list?.sender}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                                      {list?.intendedFor}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                          list?.status === "Dispatch"
                                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                            : list?.status === "Edited"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                                        }`}
                                      >
                                        {list?.status}
                                      </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                                      {list?.createdDate}
                                    </td>

                                    {/* Buttons section */}
                                    <td className="whitespace-nowrap px-3 py-4 text-sm flex flex-col sm:flex-row gap-2 justify-start sm:justify-end font-medium">
                                      <button
                                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-white"
                                        onClick={() => {
                                          setEditable(true);
                                          handleEdit(list);
                                          handleScrollToForm();
                                        }}
                                      >
                                        Edit
                                      </button>

                                      <button
                                        className="bg-red-600 px-2 py-1 rounded-lg text-white hover:bg-red-700"
                                        onClick={() =>
                                          handleDelete(list?.notificationID)
                                        }
                                      >
                                        Delete
                                      </button>

                                      <button
                                        className={`px-2 py-1 rounded-lg text-white ${
                                          list?.status === "Dispatch"
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                        }`}
                                        disabled={list?.status === "Dispatch"}
                                        onClick={() =>
                                          list?.status === "Dispatch"
                                            ? alert(
                                                `Notification ${list?.notificationID} is already dispatched`
                                              )
                                            : handleSend(list)
                                        }
                                      >
                                        {list?.status === "Dispatch"
                                          ? "Dispatched"
                                          : "Send"}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No notifications found
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300">
            Kindly Select and Save the Academic Year from Settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notification;
