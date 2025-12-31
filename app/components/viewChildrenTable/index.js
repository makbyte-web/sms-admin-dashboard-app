import Image from "next/image";
import Link from "next/link";

const StudentsTable = ({ students }) => {
  return (
    <div className="overflow-x-auto rounded-xl mt-6 shadow-lg bg-white dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-xl">
        <thead className="bg-gray-100 dark:bg-gray-950">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Photo
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              GR No
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
              Academic Year
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {students?.map((student,idx) => (
            <tr
              key={`std-${idx}`}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <td className="px-4 py-3">
                <Image
                  src={student.urlDP}
                  alt={student.studentName}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover border border-gray-300 dark:border-gray-700"
                />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <Link
                  href={`/dashboard/students/${student.stdID}`}
                  onClick={() =>
                    localStorage.setItem("student", JSON.stringify(student))
                  }
                >
                  {student.studentName}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {student.grNo}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {student.email}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {student.academicYear}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
