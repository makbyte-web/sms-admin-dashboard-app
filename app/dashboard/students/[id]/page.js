"use client";
import { useEffect, useState } from "react";
import StudentSingleProfile from "@/app/components/studentSingleProfile/index";
import Chart from "@/app/components/ui/charts";

export default function SingleStudentProfile() {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("student"));

    async function fetchStudents() {
      if (result) {
        if (result) {
          setStudentData({
            ...result,
            type: "student",
          });
        }
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <StudentSingleProfile studentData={studentData} />
      <Chart />
    </div>
  );
}
