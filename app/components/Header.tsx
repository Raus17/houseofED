"use client";
import React from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Icon from "./Icon"; // Import the fixed icon component

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="w-full h-16 text-white flex items-center justify-between px-6 fixed top-0 left-0 z-50">
      {/* Left Side - Fixed Icon */}
      <Icon />

      {/* Right Side - User Info */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Image
              src={user.photoURL || "IMAGE"} // Fallback if no photo
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
            <span className="text-lg font-semibold text-black">{user ? user?.displayName : "USER"}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Not Found</span>
        )}
      </div>
    </header>
  );
};

export default Header;
