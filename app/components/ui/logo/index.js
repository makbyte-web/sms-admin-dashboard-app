import React from "react";
import Image from "next/image";
import { CompanyName } from "@/defaults";

const Logo = ({ position }) => {
  return (
    <div
      className={`flex w-full items-center cursor-default ${
        position ? position : "justify-center"
      }`}
    >
      <Image
        alt="MAK Byte Logo"
        src="/logo/mkLogoDark.png"
        width={40}
        height={40}
      />
     {CompanyName}
    </div>
  );
};

export default Logo;
