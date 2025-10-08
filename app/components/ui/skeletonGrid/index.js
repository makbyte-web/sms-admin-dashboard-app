export const SkeletonGrid = () => (
  <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-40 w-full p-4 flex items-center justify-between">
    <div className="space-y-4 w-full">
      <div className="h-6 w-24 skeleton rounded" />
      <div className="h-6 w-16 skeleton rounded" />
    </div>
    <div className="h-16 w-16 skeleton rounded-full" />
  </div>
);
