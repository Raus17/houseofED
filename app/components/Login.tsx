"use client";

import { loginWithGoogle, logout } from "../lib/auth";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <button onClick={loginWithGoogle} className="px-4 py-2 bg-blue-500 text-white rounded">
          Login with Google
        </button>
      )}
    </div>
  );
}
