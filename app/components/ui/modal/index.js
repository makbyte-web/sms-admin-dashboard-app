"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export default function Modal({ open, handleModalClose, children }) {
  return (
    <Dialog open={open} onClose={handleModalClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center max-sm:px-12 max-sm:py-6 max-sm:block max-sm:mt-12">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl dark:bg-gray-900 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:mt-16 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
