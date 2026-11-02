import type { Metadata } from "next";
import Link from "next/link";

import styles from "../public.module.css";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in | MyFee" };

export default function LoginPage() {
  return (
    <main className={styles.split}>
      <div className={styles.splitSide}>
        <div className={styles.splitColumn}>
          <p className="type-headline-small">
            <Link href="/" className={styles.brand}>
              MyFee
            </Link>
          </p>

          <div className={`${styles.content} ${styles.splitContent}`}>
            <h1 className="type-headline-large">Log in</h1>
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Space for an image or animation. */}
      <div className={styles.panel}>
        <p className="type-display-medium"></p>
      </div>
    </main>
  );
}
