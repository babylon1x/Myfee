import Link from "next/link";

import styles from "./public.module.css";

export default function HomePage() {
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
            <h1 className="type-display-large">See and pay your children’s fees, in one place.</h1>
            <p className={`type-body-medium ${styles.supporting}`}>
              Parents see what is paid, what is still owed and when it is due, for each child.
              Schools keep one trusted record of every payment.
            </p>

            <div className={styles.actions}>
              <Link href="/login" className={`type-label-large ${styles.button} ${styles.primary}`}>
                Log in
              </Link>
              <Link
                href="/get-for-school"
                className={`type-label-large ${styles.button} ${styles.secondary}`}
              >
                Get for school
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Space for an image or animation. */}
      <div className={styles.panel} />
    </main>
  );
}
