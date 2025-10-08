import React from "react";

const AttendanceSkeletonLoader = () => {
  return (
    <>
      <div className="mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 items-end md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Standard Selector Skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="relative">
                <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Division Selector Skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="relative">
                <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Academic Year Selector Skeleton */}
            <div className="space-y-2">
              <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="relative">
                <div className="h-12 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="flex items-end">
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800">
        {/* Table Skeleton */}
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full">
            {/* Table Header Skeleton */}
            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left min-w-[120px]">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </th>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="p-4 text-center min-w-[60px]">
                    <div className="h-6 w-12 mx-auto bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body Skeleton */}
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  {/* Student Name Cell */}
                  <td className="p-4">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </td>

                  {/* Attendance Date Cells */}
                  {[...Array(5)].map((_, colIndex) => (
                    <td key={colIndex} className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

export default AttendanceSkeletonLoader;
