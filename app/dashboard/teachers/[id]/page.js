"use client";
import TeacherSingleProfile from "@/app/components/teacherSingleProfile";
import Avatar from "@/public/images/avatar.jpg";

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
    <TeacherSingleProfile teacherData={teacherData}></TeacherSingleProfile>
  );
}
