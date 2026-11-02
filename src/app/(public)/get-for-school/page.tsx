import type { Metadata } from "next";
import Link from "next/link";

import styles from "../public.module.css";
import { CONTACT_EMAIL } from "./school-request.ts";
import { SchoolRequestForm } from "./school-request-form";

export const metadata: Metadata = { title: "Get for school | MyFee" };

export default function GetForSchoolPage() {
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
            <h1 className="type-headline-large">Contact us to get MyFee for your school</h1>
            <p className={`type-body-medium ${styles.supporting}`}>
              Fill in this form or email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
                {CONTACT_EMAIL}
              </a>
              , and the MyFee team will set up your school.
            </p>
            <SchoolRequestForm />
          </div>
        </div>
      </div>

      {/* Space for an image or animation. */}
      <div className={styles.panel} />
    </main>
  );
}
