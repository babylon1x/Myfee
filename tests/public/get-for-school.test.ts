import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getFieldError,
  getRequestErrors,
  MAX_LENGTH,
} from "../../src/app/(public)/get-for-school/school-request.ts";
import {
  type SchoolRequestRecord,
  submitRequest,
} from "../../src/app/(public)/get-for-school/submit-school-request.ts";

const VALID_REQUEST = {
  schoolName: "Bright Future School",
  fullName: "Ọlá Adébáyọ̀",
  email: "ola@brightfuture.edu.ng",
  phone: "0803 123 4567",
};

const EMAIL_FORMAT_ERROR = "Enter a proper email, like name@domain.com.";
const PHONE_FORMAT_ERROR = "Enter a proper phone number, like 0803 123 4567.";

describe("get for school request", () => {
  it("accepts a complete request", () => {
    assert.deepEqual(getRequestErrors(VALID_REQUEST), {});
  });

  it("accepts a request with no phone number", () => {
    assert.deepEqual(getRequestErrors({ ...VALID_REQUEST, phone: "" }), {});
  });

  it("reports every missing required field", () => {
    assert.deepEqual(getRequestErrors({ schoolName: "", fullName: "", email: "", phone: "" }), {
      schoolName: "School name is required.",
      fullName: "Your name is required.",
      email: "Email is required.",
    });
  });

  it("treats spaces alone as empty", () => {
    assert.equal(getFieldError("schoolName", "   "), "School name is required.");
    assert.equal(getFieldError("fullName", "   "), "Your name is required.");
    assert.equal(getFieldError("email", "   "), "Email is required.");
    assert.equal(getFieldError("phone", "   "), undefined);
  });

  for (const email of ["ola", "ola@", "ola@school", "ola@school.", "ola@school.n", "o la@school.ng", "ola@@school.ng", "ola@school..ng", "@school.ng"]) {
    it(`rejects the email "${email}"`, () => {
      assert.equal(getFieldError("email", email), EMAIL_FORMAT_ERROR);
    });
  }

  for (const email of ["ola@school.ng", "ola.a+fees@mail.school.edu.ng", "OLA@SCHOOL.COM"]) {
    it(`accepts the email "${email}"`, () => {
      assert.equal(getFieldError("email", email), undefined);
    });
  }

  for (const phone of ["0803 123 4567", "+234 803 123 4567", "(0803) 123-4567", "0123456"]) {
    it(`accepts the phone number "${phone}"`, () => {
      assert.equal(getFieldError("phone", phone), undefined);
    });
  }

  for (const phone of ["123456", "1234567890123456", "call me", "0803x1234567", "++2348031234567"]) {
    it(`rejects the phone number "${phone}"`, () => {
      assert.equal(getFieldError("phone", phone), PHONE_FORMAT_ERROR);
    });
  }

  it("rejects text over the length limit", () => {
    assert.equal(getFieldError("schoolName", "a".repeat(MAX_LENGTH.schoolName + 1)), "This is too long.");
    assert.equal(getFieldError("schoolName", "a".repeat(MAX_LENGTH.schoolName)), undefined);
  });
});

describe("saving a school request", () => {
  function fakeStore() {
    const saved: SchoolRequestRecord[] = [];
    return {
      saved,
      save: async (record: SchoolRequestRecord) => {
        saved.push(record);
      },
    };
  }

  it("saves a valid request once, with spaces trimmed", async () => {
    const store = fakeStore();
    const result = await submitRequest(
      { schoolName: "  Bright Future School ", fullName: VALID_REQUEST.fullName, email: " ola@school.ng ", phone: "0803 123 4567" },
      store.save,
    );

    assert.deepEqual(result, { status: "saved" });
    assert.deepEqual(store.saved, [
      { schoolName: "Bright Future School", fullName: VALID_REQUEST.fullName, email: "ola@school.ng", phone: "0803 123 4567" },
    ]);
  });

  it("saves an empty phone number as null", async () => {
    const store = fakeStore();
    await submitRequest({ ...VALID_REQUEST, phone: "" }, store.save);
    assert.equal(store.saved[0]?.phone, null);
  });

  it("saves nothing when a field is invalid", async () => {
    const store = fakeStore();
    const result = await submitRequest({ ...VALID_REQUEST, email: "ola@school" }, store.save);

    assert.deepEqual(result, { status: "invalid", errors: { email: EMAIL_FORMAT_ERROR } });
    assert.equal(store.saved.length, 0);
  });

  for (const input of [null, undefined, "text", 42, [], { schoolName: 1, fullName: {}, email: [] }]) {
    it(`saves nothing for the input ${JSON.stringify(input)}`, async () => {
      const store = fakeStore();
      const result = await submitRequest(input, store.save);

      assert.equal(result.status, "invalid");
      assert.equal(store.saved.length, 0);
    });
  }

  it("ignores extra fields sent to the server", async () => {
    const store = fakeStore();
    await submitRequest({ ...VALID_REQUEST, id: "chosen-by-sender", createdAt: "2000-01-01" }, store.save);
    assert.deepEqual(Object.keys(store.saved[0] ?? {}).sort(), ["email", "fullName", "phone", "schoolName"]);
  });

  it("reports a failure when the database save fails, without logging the details", async (t) => {
    const logged = t.mock.method(console, "error", () => {});
    const result = await submitRequest(VALID_REQUEST, async () => {
      throw new Error(`could not save ${VALID_REQUEST.email}`);
    });

    assert.deepEqual(result, { status: "failed" });
    assert.ok(!JSON.stringify(logged.mock.calls.map((call) => call.arguments)).includes(VALID_REQUEST.email));
  });
});
