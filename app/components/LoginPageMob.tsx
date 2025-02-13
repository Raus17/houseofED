"use client";
import React, { useEffect } from "react";
import GoogleButton from "./GoogleButton";
import Icon from "./Icon";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "../components/css/LoginPageMob.module.css";

const LoginPageMob = () => {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <Icon />
      <p className={styles.fontSmall}>
        Streamline your workflow and track progress effortlessly
      </p>
      <p className={styles.fontSmall}>
        with our all-in-one task management app.
      </p>
      <GoogleButton onClick={signInWithGoogle} />
    </div>
  );
};

export default LoginPageMob;
