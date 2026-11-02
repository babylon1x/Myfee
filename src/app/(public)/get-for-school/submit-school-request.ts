import { getRequestErrors, type SchoolRequest, type SchoolRequestErrors } from "./school-request.ts";

export type SchoolRequestRecord = {
  schoolName: string;
  fullName: string;
  email: string;
  phone: string | null;
};

export type SubmitResult =
  | { status: "saved" }
  | { status: "invalid"; errors: SchoolRequestErrors }
  | { status: "failed" };

function readText(input: object, field: keyof SchoolRequest) {
  const value = (input as Record<string, unknown>)[field];
  return typeof value === "string" ? value.trim() : "";
}

// Anyone can post to a server action directly, so nothing from the browser is trusted here.
export async function submitRequest(
  input: unknown,
  save: (record: SchoolRequestRecord) => Promise<unknown>,
): Promise<SubmitResult> {
  const source = typeof input === "object" && input !== null ? input : {};
  const request: SchoolRequest = {
    schoolName: readText(source, "schoolName"),
    fullName: readText(source, "fullName"),
    email: readText(source, "email"),
    phone: readText(source, "phone"),
  };

  const errors = getRequestErrors(request);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  try {
    await save({ ...request, phone: request.phone || null });
    return { status: "saved" };
  } catch (error) {
    // Only the error's name: the full message can contain the person's details.
    console.error("School request not saved:", error instanceof Error ? error.name : "unknown");
    return { status: "failed" };
  }
}
