"use client";

import { acceptFileToUpload } from "@/actions/file";
import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [teachersFilteredData, setTeachersFilteredData] = useState([]);
  const [parentsFilteredData, setParentsFilteredData] = useState([]);
  const [studentsFilteredData, setStudentsFilteredData] = useState([]);
  const [schoolsFilteredData, setSchoolsFilteredData] = useState([]);
  const [schoolID, setSchoolID] = useState(null);
  const [loggedInUserID, setLoggedInUserID] = useState(null);
  const [schoolName, setSchoolName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [parents, setParents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setParentsFilteredData(parents);
    setTeachersFilteredData(teachers);
    setStudentsFilteredData(students);
    setSchoolsFilteredData(schools);
    setSearchInput("");
  }, [parents, teachers, students, schools]);

  const handleSearchInput = (e, key1, key2, data) => {
    // setTeachersFilteredData(data);
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    const filtered = data?.filter((obj) => {
      const field1 = obj[key1]?.toLowerCase() || "";
      const field2 = obj[key2]?.toLowerCase() || "";

      return field1.includes(value) || field2.includes(value);
    });

    if (key1 === "teacherName") {
      setTeachersFilteredData(filtered);
    } else if (key1 === "parentName") {
      setParentsFilteredData(filtered);
    } else if (key1 === "studentName") {
      setStudentsFilteredData(filtered);
    } else if (key1 === "schoolName") {
      setSchoolsFilteredData(filtered);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };
  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleModalOpen = (prevVal, editData) => {
    setTitle(prevVal);
    setIsEditing(editData);
    setOpenModal(true);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  const handleFileChange = async (e, name, id, folder) => {
    const file = await e.target.files[0];

    if (!file) {
      console.log("No file selected");
      return;
    }

    if (file?.size > 1024 * 1024) {
      window.alert("File size should be less than 1MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append(name, file);

    try {
      const res = await acceptFileToUpload(formData, name, id, folder);
      console.log("File uploaded successfully!");
      return res?.url;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        handleModalClose,
        handleModalOpen,
        openModal,
        title,
        isEditing,
        isLoading,
        setIsLoading,
        alert,
        setAlert,
        handleAddModalOpen,
        isAddModalOpen,
        handleAddModalClose,
        isDeleteModalOpen,
        handleCloseDeleteModal,
        setIsDeleteModalOpen,
        schools,
        setSchools,
        searchInput,
        setSearchInput,
        setParents,
        parents,
        parentsFilteredData,
        handleSearchInput,
        teachersFilteredData,
        teachers,
        setTeachers,
        students,
        setStudents,
        studentsFilteredData,
        schoolsFilteredData,
        userType,
        setUserType,
        schoolName,
        setSchoolName,
        schoolID,
        setSchoolID,
        loggedInUserID,
        setLoggedInUserID,
        handleFileChange,
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
