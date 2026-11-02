import { getEmailError } from "../email-rule.ts";

// The contact address for now.
export const CONTACT_EMAIL = "babylonstudios.1x@gmail.com";

export type SchoolRequest = {
  schoolName: string;
  fullName: string;
  email: string;
  phone: string;
};

export type SchoolRequestField = keyof SchoolRequest;
export type SchoolRequestErrors = Partial<Record<SchoolRequestField, string>>;

// Input limits only, so one request can't fill the table. Not product rules.
export const MAX_LENGTH: Record<SchoolRequestField, number> = {
  schoolName: 200,
  fullName: 200,
  email: 254,
  phone: 30,
};

const PHONE_CHARACTERS = /^\+?[\d\s()-]+$/;
const PHONE_MIN_DIGITS = 7;
const PHONE_MAX_DIGITS = 15;

function getPhoneError(value: string) {
  if (!value) return undefined; // Phone is optional.

  const digits = value.replace(/\D/g, "").length;
  const isValid =
    PHONE_CHARACTERS.test(value) && digits >= PHONE_MIN_DIGITS && digits <= PHONE_MAX_DIGITS;
  return isValid ? undefined : "Enter a proper phone number, like 0803 123 4567.";
}

export function getFieldError(field: SchoolRequestField, rawValue: string) {
  const value = rawValue.trim();

  if (value.length > MAX_LENGTH[field]) return "This is too long.";

  switch (field) {
    case "schoolName":
      return value ? undefined : "School name is required.";
    case "fullName":
      return value ? undefined : "Your name is required.";
    case "email":
      return getEmailError(value);
    case "phone":
      return getPhoneError(value);
  }
}

export function getRequestErrors(request: SchoolRequest): SchoolRequestErrors {
  const errors: SchoolRequestErrors = {};

  for (const field of Object.keys(request) as SchoolRequestField[]) {
    const error = getFieldError(field, request[field]);
    if (error) errors[field] = error;
  }

  return errors;
}
