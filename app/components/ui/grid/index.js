import React from "react";

const Grid = ({ title, count, icon }) => {
  return (
    <>
      <ul
        role="list"
        className="gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8 cursor-pointer w-full"
      >
        <li
          // key={person.email}
          className="bg-gradient-to-r from-indigo-800 via-indigo-600 to-indigo-400 col-span-1 divide-y divide-gray-200 rounded-xl py-4 shadow dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-700 transition-transform transform hover:scale-102 dark:hover:from-gray-800 dark:hover:to-gray-600 hover:from-indigo-700 hover:via-indigo-500 hover:to-indigo-300"
        >
          <div className="flex w-full items-center justify-between space-x-6 p-6 text-black">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="truncate text-3xl font-medium text-white">
                  {count}
                </h3>
              </div>
              <span className="mt-1 truncate text-2xl dark:text-gray-500 text-gray-200">
                Total {title}
              </span>
            </div>
            {icon}
          </div>
        </li>
      </ul>
    </>
  );
};

export default Grid;
