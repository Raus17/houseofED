"use client";
import React from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed  right-0 bg-[#FFF9F9] border border-gray-300 rounded-lg flex gap-2 py-2 px-4 mr-5 cursor-pointer hover:bg-gray-100 ">
      <Image src="/logout_icon.webp" alt="Logout" width={24} height={24} />
      <button onClick={logout} className="text-black font-medium">
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
