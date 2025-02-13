"use client"
import useIsMobile from "./hooks/useIsMobile";
import LoginPage from "./components/LoginPage";
import LoginPageMob from "./components/LoginPageMob";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <LoginPageMob /> : <LoginPage />}
    </div>
  );
}
