"use server";

import { db } from "@/lib/db";

import { submitRequest } from "./submit-school-request.ts";

// Public on purpose: a school asking to join has no account, so there is no session to check.
export async function submitSchoolRequest(input: unknown) {
  return submitRequest(input, (record) => db.schoolRequest.create({ data: record }));
}
