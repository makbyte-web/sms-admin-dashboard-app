"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../ui/header";
import DeleteModal from "../ui/deleteModal";
import { useTheme } from "@/context/themeContext";
import { Parents } from "@/firestore/documents/parent";
import ProfileLoadingSkeleton from "../ui/profileLoadingSkeleton";
import Alert from "../ui/alert";
import FilteredSearch from "../ui/filterSeach";
import Modal from "../ui/modal";
import AddNewParentForm from "../addNewParentForm";

const ParentList = () => {
  const {
    handleModalOpen,
    isLoading,
    setIsLoading,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    setIsDeleteModalOpen,
    setAlert,
    setParents,
    parents,
    handleSearchInput,
    parentsFilteredData,
    openModal,
    handleModalClose,
    title,
  } = useTheme();

  const [selectedParents, setSelectedParents] = useState([]);
  const [deleteItems, setDeleteItems] = useState([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [loggedInUserID, setLoggedInUserID] = useState("NA");
  const [schoolID, setSchoolID] = useState("NA");
  const [userType, setUserType] = useState("NA");

  useEffect(() => {
    const userID = JSON.parse(localStorage.getItem("userID")) || "NA";
    const school = JSON.parse(localStorage.getItem("schoolID")) || "NA";
    const type = JSON.parse(localStorage.getItem("userType")) || "NA";
    setLoggedInUserID(userID);
    setSchoolID(school);
    setUserType(type);
  }, []);

  const fetchParents = async () => {
    setIsLoading(true);
    try {
      const fetchedParents = await Parents.getParentsBySchool(schoolID);
      setParents(fetchedParents);
    } catch (error) {
      console.error("Error fetching parents:", error);
      setAlert({ type: "error", message: "Failed to load parents" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [schoolID]);

  const deleteOperation = async (id) => {
    try {
      await Parents.deleteParent(id);
    } catch (error) {
      console.error("Error deleting parent:", error);
      setAlert({ type: "error", message: "Failed to delete parent" });
    }
  };

  const handleDelete = (id) => {
    setDeleteItems([id]);
    setIsDeleteModalOpen(true);
    setIsBulkDelete(false);
  };

  const handleBulkDelete = () => {
    setDeleteItems(selectedParents.map((parent) => parent.parentID));
    setIsDeleteModalOpen(true);
    setIsBulkDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      await Promise.all(deleteItems.map((id) => deleteOperation(id)));
      setSelectedParents([]);
    } else {
      await deleteOperation(deleteItems[0]);
    }
    setIsDeleteModalOpen(false);
    setDeleteItems([]);
    fetchParents();
  };

  const toggleSelectParent = (parent) => {
    setSelectedParents((prev) =>
      prev.includes(parent)
        ? prev.filter((p) => p !== parent)
        : [...prev, parent]
    );
  };

  if (isLoading) return <ProfileLoadingSkeleton />;

  return (
    <>
      <Header buttonText={"Add Parent"} currentPage={"Parents"} handleModalOpen={() => handleModalOpen("Add")}/>
      <div className="-my-8">
        <FilteredSearch
          placeholder="Search By Parent Name or Contact"
          onChange={(e) => handleSearchInput(e, "parentName", "contact", parents)}
        />
      </div>
      <div className="mt-4 flow-root">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {selectedParents.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white dark:bg-[--bgSoft] sm:left-12">
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-700"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300 dark:divide-[--bg]">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={
                          selectedParents.length > 0 &&
                          selectedParents.length === parents.length
                        }
                        onChange={() =>
                          setSelectedParents(
                            selectedParents.length === parents.length
                              ? []
                              : parents
                          )
                        }
                      />
                    </th>
                    <th className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-[--text]">
                      Name
                    </th>
                    <th className="dark:text-[--text] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Qualification
                    </th>
                    <th className="dark:text-[--text] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="dark:text-[--text] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-[--bg] bg-white dark:bg-[--bgSoft]">
                  {parentsFilteredData?.map((parent) => (
                    <tr
                      key={parent.parentID}
                      className={
                        selectedParents.includes(parent)
                          ? "bg-gray-50 dark:bg-[--bg]"
                          : ""
                      }
                    >
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={selectedParents.includes(parent)}
                          onChange={() => toggleSelectParent(parent)}
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium dark:text-[--text]">
                        <Link onClick={() => { localStorage.setItem("parent", JSON.stringify(parent)) }} href={`/dashboard/parents/${parent.parentID}`}>
                          {parent.parentName}
                        </Link>
                      </td>
                      <td className="wrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                        {parent.qualification}
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                        {parent.email}
                      </td>
                      <td className="whitespace-nowrap dark:text-[--textSoft] px-3 py-4 text-sm text-gray-500">
                        {parent.contact}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() =>
                            handleModalOpen("Edit", parent.parentID && parent)
                          }
                        >
                          Edit
                        </button>
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button
                          className="bg-red-600 px-2 py-1 rounded-lg text-white"
                          onClick={() => handleDelete(parent.parentID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parents?.length === 0 && (
                <Alert handleModalOpen={handleModalOpen} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal open={openModal} handleModalClose={handleModalClose}>
        <AddNewParentForm
          handleModalClose={handleModalClose}
          title={title}
          fetchParents={fetchParents}
        />
      </Modal>
      <DeleteModal
        modalType={isBulkDelete ? "Parents Data" : "Parent"}
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ParentList;
