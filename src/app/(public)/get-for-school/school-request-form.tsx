"use client";

import { type FormEvent, useState, useTransition } from "react";

import formStyles from "../form.module.css";
import publicStyles from "../public.module.css";
import { submitSchoolRequest } from "./actions";
import {
  CONTACT_EMAIL,
  getFieldError,
  getRequestErrors,
  MAX_LENGTH,
  type SchoolRequest,
  type SchoolRequestErrors,
  type SchoolRequestField,
} from "./school-request.ts";

const FIELDS: {
  name: SchoolRequestField;
  label: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
}[] = [
  { name: "schoolName", label: "School name", type: "text", autoComplete: "organization" },
  { name: "fullName", label: "Your name", type: "text", autoComplete: "name" },
  { name: "email", label: "Your email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number (optional)", type: "tel", autoComplete: "tel" },
];

export function SchoolRequestForm() {
  const [errors, setErrors] = useState<SchoolRequestErrors>({});
  const [outcome, setOutcome] = useState<"saved" | "failed" | null>(null);
  const [isSending, startSending] = useTransition();

  function checkField(field: SchoolRequestField, value: string) {
    setErrors((current) => ({ ...current, [field]: getFieldError(field, value) }));
  }

  function showErrors(nextErrors: SchoolRequestErrors) {
    setErrors(nextErrors);
    const firstInvalid = FIELDS.find(({ name }) => nextErrors[name]);
    if (firstInvalid) document.getElementById(firstInvalid.name)?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending) return;

    const data = new FormData(event.currentTarget);
    const request = Object.fromEntries(
      FIELDS.map(({ name }) => [name, String(data.get(name) ?? "")]),
    ) as SchoolRequest;

    const nextErrors = getRequestErrors(request);
    setOutcome(null);

    if (Object.keys(nextErrors).length > 0) {
      showErrors(nextErrors);
      return;
    }

    setErrors({});
    startSending(async () => {
      try {
        const result = await submitSchoolRequest(request);
        if (result.status === "invalid") {
          showErrors(result.errors);
        } else {
          setOutcome(result.status);
        }
      } catch {
        // The request never reached the server, for example on a lost connection.
        setOutcome("failed");
      }
    });
  }

  if (outcome === "saved") {
    return (
      <p role="status" className={`type-body-medium ${formStyles.alert} ${formStyles.alertSuccess}`}>
        Thank you. We’ve received your request and will contact you by email.
      </p>
    );
  }

  return (
    <form className={formStyles.form} method="post" noValidate onSubmit={handleSubmit}>
      {FIELDS.map(({ name, label, type, autoComplete }) => {
        const error = errors[name];
        const errorId = `${name}-error`;

        return (
          <div key={name} className={formStyles.field}>
            <label htmlFor={name} className="type-label-large">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              autoComplete={autoComplete}
              maxLength={MAX_LENGTH[name]}
              required={name !== "phone"}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={`type-body-large ${formStyles.input}`}
              onBlur={(event) => checkField(name, event.target.value)}
              onChange={(event) => checkField(name, event.target.value)}
            />
            {/* Always rendered: the space is reserved so an error never moves the page mid-click. */}
            <p id={errorId} role="alert" className={`type-body-medium ${formStyles.fieldError}`}>
              {error}
            </p>
          </div>
        );
      })}

      {outcome === "failed" && (
        <p role="status" className={`type-body-medium ${formStyles.alert} ${formStyles.alertError}`}>
          We couldn’t send your request. Please try again, or email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className={`type-label-large ${publicStyles.button} ${publicStyles.primary} ${formStyles.submit}`}
      >
        {isSending ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}
