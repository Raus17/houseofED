"use client";
import React from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

const HeaderMob = () => {
  const { user } = useAuth();

  return (
    <header className="w-full h-16 bg-[#F8EBF2] flex items-center justify-between px-4 fixed top-0 left-0 z-50 shadow-md mb-4">
      {/* Left Side - App Name */}
      <h2 className="text-lg font-semibold text-[#333]">TaskBuddy</h2>

      {/* Right Side - User Profile */}
      <div className="flex items-center">
        {user ? (
          <Image
            src={user.photoURL || "/default-profile.png"} // Fallback image
            alt="Profile"
            width={36}
            height={36}
            className="rounded-full border-2 border-gray-300"
          />
        ) : (
          <span className="text-sm text-gray-500">Not Found</span>
        )}
      </div>
    </header>
  );
};

export default HeaderMob;
