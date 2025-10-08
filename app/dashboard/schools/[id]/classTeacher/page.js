"use client";
import React from "react";
import { useTheme } from "@/context/themeContext";
import Modal from "@/app/components/ui/modal";
import AddClassTeacher from "@/app/components/addClassTeacher";
import ClassTeacherList from "@/app/components/classTeacherList";

const ClassTeacher = () => {
  return (
    <>
      <ClassTeacherList />
    </>
  );
};

export default ClassTeacher;
