"use client";
import { useEffect, useState } from "react";
import { Schools } from "@/firestore/documents/school";
import Header from "@/app/components/ui/header";
import { parseDate } from "@/lib/utils";

const Configuration = () => {
  const tableHeaders = [
    { key: "schoolID", label: "SchoolID" },
    { key: "schoolName", label: "School Name" },
    { key: "email", label: "Email" },
    { key: "createdDate", label: "Created Date" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Action", srOnly: true },
  ];

  const [edited, setEdited] = useState(false);
  const [schools, setSchools] = useState([])
  // const [academicYear, setAcademicYear] = useState(null)
  const [loggedInUserID, setLoggedInUserID] = useState(null);
  const [userType, setUserType] = useState(null);

  let retval;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userID = JSON.parse(localStorage.getItem("userID")) || "NA";
      const userType = JSON.parse(localStorage.getItem("userType")) || "NA";
      // const academicYear = JSON.parse(localStorage.getItem("academicYear")) || "NA";
      setLoggedInUserID(userID);
      setUserType(userType);
      // setAcademicYear(academicYear);
    }
  }, []);

  useEffect(() => {
    async function fetchSchools() {
      if (userType === "superadmin") {
        const result = await Schools.getSchools()

        result && result?.sort((a, b) => {
          const dateA = parseDate(a.createdDate);
          const dateB = parseDate(b.createdDate);
          return dateB - dateA; // descending order
        });

        if (result) setSchools(result);
      } else {
        setSchools([])
      }
    }

    fetchSchools();
  }, [loggedInUserID, edited]);

  const handleEdit = async (school) => {
    try {
      const toogleActive = school.isActive ? false : true
      const existsingSchool = new Schools(
        school?.schoolName,
        school?.location,
        school?.medium,
        school?.indexNo,
        school?.email,
        school?.urlDP,
        school?.urlDPID,
        school?.urlAdminDPID,
        school?.createdDate,
        school?.createdBy,
        new Date().toLocaleDateString("en-IN"),
        loggedInUserID,
        "NA",
        "NA",
        school?.contactNo,
        toogleActive,
        school?.schoolID,
        school?.userID
      );

      retval = await existsingSchool.updateSchool();
      setEdited(retval)

      if (retval) {
        alert(`School ${school?.schoolName} status changed to ${toogleActive ? "Active" : "Inactive"}.`)
      }
    } catch (error) {
      console.log(`Error in updating status of school ${school?.schoolName} :`, error)
    }
  };

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <Header currentPage={"School Configuration"}></Header>
      <div className="min-h-screen flex flex-col items-center p-4">
        {userType === "superadmin" ? (
          <div className="min-h-screen flex flex-col items-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  Deselect the checkbox and Update to make School inactive which prevents School / Staff / Parents to use the SMS dashboard and mobile app.
                </p>
              </div>
            </div>
            {schools && schools.length ? (
              <>
                <div className="text-center my-4">
                  <span className="text-xl sm:text-2xl font-medium leading-6 text-gray-900 dark:text-gray-200">
                    Schools List
                  </span>
                </div>
                <div className="w-full min-h-screen">
                  <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                            {schools?.map((school, i) => (
                              <tr key={i}>
                                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium dark:text-gray-100">
                                  {school?.schoolID}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                                  {school?.schoolName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                                  {school?.email}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-200">
                                  {school?.createdDate}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${school?.isActive
                                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                                      }`}
                                  >
                                    {school?.isActive ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                                  <button
                                    className="text-indigo-600 px-2 py-1 hover:text-indigo-900 dark:hover:text-white"
                                    onClick={() => {
                                      setEdited(false);
                                      handleEdit(school);
                                    }}
                                  >
                                    Edit
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
              </>
            ) : (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                      No School found.
                    </p>
                  </div>
                </div>
              </>
            )}

          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Configuration can only be set by SuperAdmin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuration;
