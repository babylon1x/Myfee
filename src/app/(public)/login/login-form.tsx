"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";

import { getEmailError } from "../email-rule.ts";
import formStyles from "../form.module.css";
import publicStyles from "../public.module.css";
import styles from "./login.module.css";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function checkEmail(value: string) {
    setErrors((current) => ({ ...current, email: getEmailError(value) }));
  }

  // Checks the fields only. Step 1.4 connects this to real login, so nothing is sent yet.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = emailRef.current;
    const password = passwordRef.current;
    if (!email || !password) return;

    const nextErrors: FieldErrors = {
      email: getEmailError(email.value),
      password: password.value ? undefined : "Password is required.",
    };

    setErrors(nextErrors);
    setNotice(null);

    if (nextErrors.email) {
      email.focus();
    } else if (nextErrors.password) {
      password.focus();
    } else {
      setShowPassword(false);
      setNotice("Login is not available yet.");
    }
  }

  return (
    <form className={formStyles.form} method="post" noValidate onSubmit={handleSubmit}>
      {notice && (
        <p role="status" className={`type-body-medium ${formStyles.alert} ${formStyles.alertInfo}`}>
          {notice}
        </p>
      )}

      <div className={formStyles.field}>
        <label htmlFor="email" className="type-label-large">
          Email
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`type-body-large ${formStyles.input}`}
          onBlur={(event) => checkEmail(event.target.value)}
          onChange={(event) => checkEmail(event.target.value)}
        />
        {/* Always rendered: the space is reserved so an error never moves the page mid-click. */}
        <p id="email-error" role="alert" className={`type-body-medium ${formStyles.fieldError}`}>
          {errors.email}
        </p>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="password" className="type-label-large">
          Password
        </label>
        <div className={styles.passwordWrap}>
          <input
            ref={passwordRef}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`type-body-large ${formStyles.input} ${styles.passwordInput}`}
            onChange={() => setErrors((current) => ({ ...current, password: undefined }))}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={styles.passwordToggle}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? (
              <EyeOff className={styles.icon} aria-hidden="true" />
            ) : (
              <Eye className={styles.icon} aria-hidden="true" />
            )}
          </button>
        </div>
        <p id="password-error" role="alert" className={`type-body-medium ${formStyles.fieldError}`}>
          {errors.password}
        </p>
      </div>

      <button
        type="submit"
        className={`type-label-large ${publicStyles.button} ${publicStyles.primary} ${formStyles.submit}`}
      >
        Log in
      </button>

      <p className={`type-body-large ${styles.forgot}`}>
        <Link href="/forgot-password" className={`${publicStyles.link} ${styles.forgotLink}`}>
          Forgot password
        </Link>
      </p>
    </form>
  );
}
