"use client";
import React from "react";
import { useTheme } from "@/context/themeContext";
import Modal from "@/app/components/ui/modal";
import AddClassTeacher from "@/app/components/addClassTeacher";
import ClassTeacherList from "@/app/components/classTeacherList";

const ClassTeacher = () => {
  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <ClassTeacherList />
    </div>
  );
};

export default ClassTeacher;
