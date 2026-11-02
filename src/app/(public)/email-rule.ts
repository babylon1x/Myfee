// Needs text@domain.tld. The browser's own email check would accept "ada@school".
const EMAIL_PATTERN = /^[^\s@]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

export function getEmailError(value: string) {
  if (!value) return "Email is required.";
  if (!EMAIL_PATTERN.test(value)) return "Enter a proper email, like name@domain.com.";
  return undefined;
}
