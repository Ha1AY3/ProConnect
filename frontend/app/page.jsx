"use client";

import { useRouter } from "next/navigation";
import styles from './page.module.css';
import "./globals.css";
import UserLayout from "../src/layout/UserLayout/UserLayout.jsx";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
          <p>When real connection feel effortless</p>
          <p>Say it real. Share it real!</p>

          <div onClick={() => {
            router.push("/login");
          } }className={styles.buttonJoin}>
            <p>Join Now</p>
          </div>
        </div>
        <div className={styles.mainContainer_right}>
          <img src="images/connection.jpg" alt=""></img>
        </div>
      </div>
    </div>
    </UserLayout>
  )
}
