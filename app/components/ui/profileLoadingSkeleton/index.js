// components/LoadingSkeleton.js
export default function ProfileLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-sm:text-center mb-10">
          <div className="h-10 w-32 skeleton rounded-xl mx-auto sm:mx-0"></div>
        </div>
        <div className="px-4 sm:px-0 flex justify-between max-sm:flex-col-reverse max-sm:gap-12 max-sm:items-center">
          <div className="max-sm:text-center">
            <div className="h-8 w-48 skeleton rounded mb-4"></div>
            <div className="h-6 w-24 skeleton rounded mb-8"></div>
            <div className="h-10 w-40 skeleton rounded-xl mx-auto sm:mx-0"></div>
          </div>
          <div className="h-36 w-36 skeleton rounded-xl"></div>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100 dark:border-gray-700">
        <dl className="divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            >
              <dt className="h-6 w-32 skeleton rounded"></dt>
              <dd className="mt-1 h-6 w-48 skeleton rounded sm:col-span-2 sm:mt-0"></dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
