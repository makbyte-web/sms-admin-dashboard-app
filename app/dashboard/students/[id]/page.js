"use client";
import { useEffect, useState } from "react";
import StudentSingleProfile from "@/app/components/studentSingleProfile/index";
import Avatar from "@/public/images/avatar.jpg";
import Chart from "@/app/components/ui/charts";

export default function SingleStudentProfile() {
  // const pathname = usePathname();
  // const studentId = pathname.split("/").pop();
  // console.log(id, "id");

  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("student"));

    async function fetchStudents() {
      //   const result = await Students.getStudents();
      //   console.log("result", result);
      if (result) {
        // const student = result?.find((student) => student.studentID === id);
        //     console.log("student", student);
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
    <>
      <StudentSingleProfile studentData={studentData} />
      <Chart />
    </>
  );
}
