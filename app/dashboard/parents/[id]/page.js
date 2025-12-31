"use client";
import ParentSingleProfile from "@/app/components/parentSingleProfile";
import NoAvatar from "@/public/images/noavatar.png";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SingleParentProfile() {
  const params = useParams();
  const [parentData, setParentData] = useState(null);

  useEffect(() => {
    const result = JSON.parse(localStorage.getItem("parent"));

    async function fetchParents() {
      if (result) {
        setParentData({
          ...result,
          parentID: params?.id || result?.parentID,
          type: "parent"
        });
      }
    }

    fetchParents();
  }, []);

  return (
    <div className="px-4 py-2 sm:px-6 lg:px-8">
      <ParentSingleProfile parentData={parentData} />;
    </div>
  );
}
