"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import LogoutButton from "../components/LogoutButton";
import List from "../components/List";
import Board from "../components/Board";
import { FaListUl } from "react-icons/fa";
import { PiSquaresFourBold } from "react-icons/pi";
import Lottie from "react-lottie-player";
import loaderAnimation from "../../public/Loader/Progress-Bar-(Donut)-[remix].json"; // Ensure the loader.json file exists
import useIsMobile from "../hooks/useIsMobile";
import HeaderMob from "../components/HeaderMob";
import MobileTaskList from "../components/MobileTaskList";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000); // Simulate loading delay

    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie
          loop
          animationData={loaderAnimation}
          play
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
  }

  return (
    <div>
      {isMobile ? <HeaderMob /> : <Header />}

      {isMobile ? <MobileTaskList /> : <main className="pt-16 px-6">
        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-6">
            <button
              className={`flex items-center gap-2 px-3 py-1 text-lg font-semibold transition-all ${activeTab === "list" ? "text-black border-b-2 border-black" : "text-gray-400"
                }`}
              onClick={() => setActiveTab("list")}
            >
              <FaListUl className="text-xl" />
              List
            </button>

            <button
              className={`flex items-center gap-2 px-3 py-1 text-lg font-semibold transition-all ${activeTab === "board" ? "text-black border-b-2 border-black" : "text-gray-400"
                }`}
              onClick={() => setActiveTab("board")}
            >
              <PiSquaresFourBold className="text-xl" />
              Board
            </button>
          </div>
          <LogoutButton />
        </div>

        {activeTab === "list" ? <List /> : <Board />}
      </main>}
    </div>
  );
};

export default Page;
