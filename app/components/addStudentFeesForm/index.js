"use client";
import React, { useRef, useState } from "react";
import AddModal from "../ui/addModal";
import { useTheme } from "@/context/themeContext";

const AddStudentFees = ({ handleModalClose }) => {
  const studentIdRef = useRef();
  const feesStructureIdRef = useRef();
  const feesTypeIdRef = useRef();
  const amountPaidRef = useRef();
  const amountPayableRef = useRef();
  const { handleAddModalOpen, handleAddModalClose, isAddModalOpen } =
    useTheme();

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8 max-sm:px-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-wide text-gray-900 dark:text-[--text] capitalize">
            {/* {title === "Edit" ? "Edit Details" : "Add Teacher Details"} */}
            Add Student Fees Details
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddModalOpen();
            }}
            method="POST"
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="feesStructureId"
                className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
              >
                Fees Structure Id
              </label>
              <div className="mt-2">
                <input
                  id="id"
                  name="id"
                  type="text"
                  // defaultValue={teacherFormData.teacherName}
                  placeholder="e.g x32xx"
                  required
                  ref={feesStructureIdRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="feesTypeId"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Fees Type Id
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="id"
                  name="id"
                  // defaultValue={teacherFormData.subject}
                  type="text"
                  placeholder="e.g 1swd12"
                  required
                  ref={feesTypeIdRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Student Id
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="id"
                  name="studentId"
                  // defaultValue={teacherFormData.subject}
                  type="text"
                  placeholder="e.g 1swd12"
                  required
                  ref={studentIdRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="amountPayable"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Amount Payable
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="amount"
                  name="amount"
                  // defaultValue={teacherFormData.subject}
                  type="number"
                  placeholder="e.g 1500"
                  required
                  ref={amountPayableRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="amountPayable"
                  className="block text-sm font-medium leading-6 dark:text-[--text] text-gray-900"
                >
                  Amount Paid
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="amount"
                  name="amount"
                  // defaultValue={teacherFormData.subject}
                  type="number"
                  placeholder="e.g 1500"
                  required
                  ref={amountPaidRef}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:col-start-2"
              >
                {/* {title === "Edit" ? "Update" : "Add"} */}
                Add
              </button>
              {isAddModalOpen && (
                <AddModal
                  isOpen={isAddModalOpen}
                  onClose={handleAddModalClose}
                  onConfirm={handleFormSubmit}
                  modalType="Fees"
                />
              )}
              <button
                onClick={handleModalClose}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStudentFees;
