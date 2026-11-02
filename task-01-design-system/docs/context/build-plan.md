# build-plan.md: MyFee

This file says what to build and in what order. `docs/context/AGENTS.md` says how to build it. The PRD (`docs/context/MyFee-PRD-v1.1.md`) holds every requirement this file names.

## How to use this file

- Work on one step per session. The current step is the one I name in my prompt.
- Before coding, read the PRD requirements listed for the step. Say which IDs you will build.
- If the step lists open questions, check that each has an answer in the PRD or decision log. If not, stop and ask.
- Build only what the step lists. If a requirement needs something from a later step, stop and ask.
- A step is done when every item under "Done when" is true and every listed requirement's Given, When, Then tests pass.
- After a step, report: the IDs you built, the tests that pass, and anything you could not finish.
- Do not start the next phase until I confirm the current phase is accepted (PRD 5.4).

## Phase 1: Foundation

Before Phase 1, the PRD validation gate (PRD 2.4) needs answers to OQ-1 (fees) and OQ-6 (admission number format). PRD 14.1 also marks OQ-5 (principal's powers) as needed by Phase 1.

### Step 1.1 Project setup
- Build: a Next.js App Router project in TypeScript strict mode, with Prisma and PostgreSQL. Use the folder structure in PRD 8.3.
- Needs: my approval for any library in PRD 8.2, which are all marked [ASSUMPTION].
- Done when: the app starts, connects to the database, and the folders in PRD 8.3 exist.

### Step 1.2 Schema and database rules
- Build: `prisma/schema.prisma` from PRD 8.7. Migration `0001_init` from that schema. Migration `0002_vector_and_constraints` with the raw SQL in PRD 8.9 and PRD 10.2.
- The PRD puts every table in the first migrations, including money and assistant tables (PRD 5.4). Do not build features for those tables yet.
- Needs: the embedding size for Gemini, because the PRD's `vector(1536)` assumes another model. Ask.
- Done when: both migrations apply to an empty database, and each blocked case listed at the end of PRD 8.9 fails as stated, while each allowed case passes.

### Step 1.3 Shared server helpers
- Build: sessions, role and permission guards, and tenancy-scoped query helpers (PRD 8.4). The audit log helper that writes in the same transaction as the change (FR-AUD-04 rule). The email outbox, with codes and alerts sent immediately (PRD 8.6).
- Requirements: FR-AUTH-08, FR-AUTH-09, FR-AUTH-10.
- Needs: OQ-9 (session lifetime). The email provider is an [ASSUMPTION] in PRD 8.2: ask.
- Done when: a request with no session reaches no protected page; a wrong role gets HTTP 403; every helper takes `schoolId` from the session only.

### Step 1.4 Login, codes and lockouts
- Build: login, password reset, new-device codes for staff and Owner, lockouts, failed-attempt records, lockout alerts.
- Requirements: FR-AUTH-01 to FR-AUTH-07, FR-AUD-01, FR-AUD-02.
- Needs: OQ-10 (how long a device stays known) and OQ-27 (password length). All limits come from the decision log numbers table.
- Done when: every number used matches the decision log numbers table, and a reset ends an active login lockout.

### Step 1.5 School setup and staff
- Build: the platform admin script, classes, terms, staff accounts, the approve permission, disabling staff, the last-approver guard, the Owner's security log.
- Requirements: FR-SET-01 to FR-SET-06, FR-AUD-03.
- Done when: a school exists with an Owner, classes, one current term and staff; the last approver cannot be disabled.

### Step 1.6 Fees
- Build: create, change and remove fees per class per term.
- Requirements: FR-FEE-01, FR-FEE-02, FR-FEE-03, FR-FEE-06.
- Needs: OQ-11 (changing a fee amount after payment). FR-FEE-02 blocks it under an [ASSUMPTION]: confirm.
- Done when: creating a fee creates a child fee row for every active child in that class and term.

### Step 1.7 Admission and invites
- Build: the seven-field admission form, sibling linking with the confirm step, second parents, invites, resend, setting a password, email correction.
- Requirements: FR-ADM-01 to FR-ADM-09, FR-FEE-04.
- Done when: an admitted child gets the class fees; a matching email always shows the confirm step; an invite works once and expires as the numbers table says.

### Step 1.8 Class changes
- Build: moving a child to another class mid-term, and the Owner's "Fee changes to review" list.
- Requirements: FR-FEE-05.
- Needs: OQ-12 (paid fees on a class change) and OQ-30 (review or approval). FR-FEE-05 uses an [ASSUMPTION]: confirm.
- Done when: a change that lowers the unpaid Required total appears on the Owner's list.

### Step 1.9 Parent dashboard (no payments)
- Build: child tabs, still owed, due date, Required and Optional lists. Show the unpaid status only. No Pay buttons.
- Requirements: FR-DASH-01, FR-DASH-02, FR-DASH-05.
- Done when: still owed equals the sum of unpaid Required fees and leaves out Optional fees (FR-FEE-03), and the page passes the FR-DASH-05 slow-connection test.

### Phase 1 exit
- Isolation tests in `tests/isolation/` pass: two schools, two families each, no cross access (PRD G-3).

## Phase 2: Money

Before Phase 2, the validation gate needs OQ-4, OQ-4b and OQ-24 (PRD 2.4).

### Step 2.1 Paystack initialise and attempts
- Build: the Paystack client, the Pay button, checkout start, and payment attempts with their state machine.
- Requirements: FR-PAY-01, FR-PAY-02, FR-PAY-07, FR-PAY-09.
- Needs: Paystack test keys from me. Every Paystack detail in PRD 8.5 is marked [VERIFY]: check it against Paystack's documentation.
- Done when: Pay creates one attempt with the amount read from the stored fee, and the database rejects every attempt status change not allowed in FR-PAY-07.

### Step 2.2 Confirm, webhook and receipts
- Build: `confirmPayment`, the webhook route with the school slug in its path, signature checks, receipts and receipt numbers.
- Requirements: FR-PAY-03, FR-PAY-05, FR-PAY-06, FR-RCP-01 to FR-RCP-04.
- Needs: OQ-16 (receipt number format).
- Done when: Paystack verify runs before any database transaction; three deliveries of one webhook create one payment; a bad signature gets HTTP 401.

### Step 2.3 Callback page and payment states
- Build: the callback page that polls and calls verify after waiting, and the dashboard fee states including "Payment started".
- Requirements: FR-PAY-04, FR-DASH-03.
- Done when: the callback page never writes payment state, and Pay asks before a second attempt while one has started.

### Step 2.4 Duplicates and reconciliation
- Build: refund flags for duplicate payments, the "Refunds to handle" list, and the reconciliation cron.
- Requirements: FR-PAY-08, reconciliation in PRD 8.5.
- Needs: OQ-15 (who refunds and how it is recorded).
- Done when: a second successful payment for a paid fee is flagged and never counted, and no code calls a refund API.

### Step 2.5 Offline payments
- Build: recording, approving, rejecting and reversing offline payments.
- Requirements: FR-OFF-01 to FR-OFF-08.
- Needs: OQ-13 (who reverses), OQ-14 (rejection), OQ-23 (Owner recording) and OQ-29 (Owner fallback). FR-OFF-04 and FR-OFF-06 use [ASSUMPTION] items: confirm.
- Done when: nobody can approve their own recording; the bursar's recordings go to the Owner; one reference backs only one live payment.

### Step 2.6 Money audit and nightly checks
- Build: the full FR-AUD-04 event list and the nightly invariants job (PRD 8.9).
- Requirements: FR-AUD-04.
- Done when: every money event writes one audit row in the same transaction, and the nightly job reports any failed invariant.

### Phase 2 exit
- Tests in `tests/payments/` pass, including each edge case named in PRD 6.5 and 6.6.

## Phase 3: School life

- Build: notices with school or class audience, notices outside child tabs, archiving, and the deletion request only.
- Requirements: FR-NOT-01, FR-NOT-02, FR-DASH-04, FR-ARC-01, FR-DATA-01, FR-DATA-02, FR-DATA-03.
- Needs: OQ-8 (past deletion requests), OQ-18 (who posts notices), OQ-20 and OQ-21 (retention and deletion handling), OQ-22 (parents whose children are all archived), OQ-28 (unpaid fees at archive).
- Do not build data deletion or anonymising.
- Done when: a parent sees only school-wide notices and notices for their children's classes, and an archived child keeps every payment and receipt.

## Phase 4: Assistant

- Build in this order: document upload and ingestion (PRD 9.4), retrieval (PRD 9.5, 10.3), the question router and templates (PRD 7.2 step 5), the assistant route (PRD 7.2), the eval set (PRD 7.8).
- Requirements: AI-01 to AI-11, PRD Sections 7, 9 and 10.
- Needs: OQ-2, OQ-3, OQ-7, OQ-18 and OQ-19; the Gemini model; my confirmation of Gemini's data terms.
- Done when: every case in PRD 7.8 passes, and the isolation tests show no answer or log row with another family's data.

## Before parents are invited

These come from the PRD. They are not code tasks. Tell me when the build reaches them.
- The bursar checks a sample of children against the school ledger (PRD G-1).
- The bursar counts fee questions for the baseline period (PRD Section 12).
