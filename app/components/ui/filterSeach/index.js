"use client";
import { useTheme } from "@/context/themeContext";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";

const FilteredSearch = ({ onChange, placeholder }) => {
  const { searchInput } = useTheme();
  return (
    <div className="mt-8 relative flex flex-1 dark:py-2">
      <label htmlFor="search-field" className="sr-only">
        Search
      </label>
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-2 h-full w-5 dark:text-[--text]"
      />
      <input
        id="search-field"
        name="search"
        type="search"
        value={searchInput}
        placeholder={placeholder ? placeholder : "Search..."}
        onChange={onChange}
        className="p-4 pl-10 effect-1 focus:outline-none bg-gray-200 rounded-xl w-full border-b-2 border-transparent focus:border-transparent dark:bg-[--bg] dark:text-[--text] dark:rounded-xl"
      />
      <span className="focus-border absolute bottom-0 left-0 h-[2px] bg-blue-600 dark:bg-[--text] transition-all duration-400 w-0"></span>
    </div>
  );
};

export default FilteredSearch;
