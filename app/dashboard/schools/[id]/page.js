"use client";
import SchoolSingleProfile from "@/app/components/schoolSingleProfile";
import Avatar from "@/public/images/avatar.jpg";
import React, { useEffect, useState } from "react";

const SingleSchoolProfile = () => {
  const [schoolData, setSchoolData] = useState(null);

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("school"));

    async function fetchSchool() {
      if (result) {
        setSchoolData({
          ...result,
          type: "school",
        });
      }
    }
    fetchSchool();
  }, []);

  return <SchoolSingleProfile schoolData={schoolData} />;
};

export default SingleSchoolProfile;
