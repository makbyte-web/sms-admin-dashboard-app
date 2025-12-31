"use client";
import SchoolSingleProfile from "@/app/components/schoolSingleProfile";
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

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <SchoolSingleProfile schoolData={schoolData} />
    </div>
  );
};

export default SingleSchoolProfile;
