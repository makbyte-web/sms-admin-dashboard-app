"use client";
import TeacherSingleProfile from "@/app/components/teacherSingleProfile";
import { useEffect, useState } from "react";

export default function SingleTeacherProfile() {
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("teacher"));
    async function fetchTeachers() {
      if (result) {
        setTeacherData({
          ...result,
          type: "teacher",
        });
      }
    }
    fetchTeachers();
  }, []);

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <TeacherSingleProfile teacherData={teacherData} />
    </div>
  );
}
