import React from "react";
import Image from "next/image";

const Icon = () => {
  return (
    <div className="flex items-center gap-2 pb-2 ">
      <Image src="/task.webp" alt="TaskBuddy Logo" width={30} height={30} />
      <h2 className="text-2xl font-semibold text-[#7B1984]">TaskBuddy</h2>
    </div>
  );
};

export default Icon;
