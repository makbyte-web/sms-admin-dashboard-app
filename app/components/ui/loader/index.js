"use client";

import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "@/public/loader.json";
import "@/app/globals.css";

const Loader = () => {
  return (
    <div className="w-full h-40 flex items-center justify-center">
      <div className="w-32 h-32">
        <Lottie animationData={loaderAnimation} loop={true} />
        <p className="text-4xl">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
