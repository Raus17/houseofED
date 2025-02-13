"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../components/css/LoginPage.module.css";
import Icon from "../components/Icon";
import GoogleButton from "../components/GoogleButton";
import { useAuth } from "../context/AuthContext";


const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Icon />
        <p className={styles.fontSmall}>
          Streamline your workflow and track progress effortlessly
        </p>
        <p className={styles.fontSmall}>
          with our all-in-one task management app.
        </p>


          <GoogleButton onClick={signInWithGoogle} />  

      </div>
    </div>
  );
};

export default LoginPage;
