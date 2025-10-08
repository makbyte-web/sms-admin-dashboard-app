import { usePathname } from "next/navigation";
import React from "react";

function LoadingSpinner() {
  let pathname = usePathname();
  pathname.split("/")[2];

  return (
    <div className="fixed inset-0 bg-white/75 flex items-center justify-center">
      <div className="relative w-20 h-12 border-l-4 border-b-4 border-gray-700">
        <span className="absolute bottom-1.5 right-2 w-2 h-3/4 bg-yellow-500 rounded-sm animate-chart"></span>
        <span className="absolute bottom-1.5 left-1.5 w-2 h-3/4 bg-green-700 rounded-sm animate-chart"></span>
        <span className="absolute bottom-0 left-4 w-2 h-4/5 bg-blue-800 rounded-sm animate-chart-before"></span>
        <span className="absolute bottom-0 left-8 w-2 h-[110%] bg-red-700 rounded-sm animate-chart-after"></span>
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-30px] whitespace-nowrap text-lg animate-text">
          Loading {pathname}
        </span>
      </div>
    </div>
    // <div className="flex justify-center items-center h-full">
    //   <div className="flex space-x-2">
    //     <div className="square bg-blue-500 animate-square1"></div>
    //     <div className="square bg-blue-400 animate-square2"></div>
    //     <div className="square bg-blue-300 animate-square3"></div>
    //   </div>
    // </div>
  );
}

export default LoadingSpinner;
