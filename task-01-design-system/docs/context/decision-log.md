# Decision Log: MyFee

Write each decision on the day you make it, with the reason. Edit these in your own words. When a decision changes, keep the old one and mark it replaced, so the history shows how your thinking changed.

## Decisions

|#|Date|Decision|Reason|Status|
|-|-|-|-|-|
|1|2026-10-23|Switched from off-plan property to a school fees portal.|Property had too many unclear rules for the time available. School fees are fixed per term, with clear deadlines.|Active|
|2|2026-10-23|Start with one school, but keep each school's data separate (`school\_id` on records).|Easy to demo now; can add more schools later without rebuilding.|Active|
|3|2026-10-23|The school adds all children and links parents. Parents join by email invite only.|Stops anyone linking themselves to a child who isn't theirs.|Active|
|4|2026-10-23|New and existing parents use the same invite flow.|One flow is simpler to build, test and explain.|Active|
|5|2026-10-23|One payment proof = one child.|Clear tracking.|Replaced by #20|
|6|2026-10-23|Each parent gets their own login, created by the school, linked to the same children. No shared passwords.|Shared passwords cause lockouts, hide who paid, and get forwarded.|Active|
|7|2026-10-23|Parent–child is many-to-many (a links table).|One parent can have many children; one child can have two parents.|Active|
|8|2026-10-23|The school controls access and links. Parents control their own password, reset, logout, and can request deletion.|Keeps the school in charge while meeting the NDPA and the Task 4/5 requirements.|Active|
|9|2026-10-23|Uploaded proof shows "awaiting confirmation" until the bursar confirms.|A screenshot is not proof money arrived.|Replaced by #21|
|10|2026-10-23|Fees are only Required or Optional, each with a due date and description.|More categories add rules without clear benefit.|Active|
|11|2026-10-23|Notices are for the school or a class, not inside each child's tab.|Most notices aren't about one child.|Active|
|12|2026-10-23|Start from the current term only.|Avoids entering years of old payment history.|Active|
|13|2026-10-23|Out of scope: results, attendance, report cards.|Keeps the project finishable; fees are the core pain.|Active|
|14|2026-10-23|MyFee must replace the bursar's current work, never add to it.|If it adds work, the school won't adopt it.|Active|
|15|2026-10-23|Fees are set per class per term; children get their class's fees automatically.|Nobody sets fees child by child.|Active|
|16|2026-10-23|Manual admission: staff enter only \~7 fields from the paper form and click Save. Saving counts as approval and sends the invite.|Keeps admission close to what staff already do.|Active|
|17|2026-10-23|An existing parent email links the new child to that parent.|Siblings appear under one login automatically.|Active|
|18|2026-10-23|Leaving pupils are archived, not deleted. Payment records are kept.|Financial records are needed for audits and disputes.|Active|
|19|2026-10-23|Target high-end private schools in Abuja first.|Parents are used to paying online; schools can pay for software.|Active|
|20|2026-10-23|Payments go through Paystack checkout, one fee for one child per payment, labelled with child, fee and term. No dedicated account number per child.|Confirms automatically; dedicated accounts are limited and not needed.|Active|
|21|2026-10-23|A fee is marked paid only when Paystack confirms to the server, never from the browser. Nobody can mark a fee paid by hand.|Browser messages can be faked; stops staff marking unpaid children as paid.|Replaced by #29|
|22|2026-10-23|Abandoned and failed checkouts are saved as payment attempts.|Shows where parents get stuck; full money record for audits and tax.|Active|
|23|2026-10-23|Full payment only. Part payment is later.|Most target schools expect full payment; keeps payments simple.|Active|
|24|2026-10-23|Roles: Owner, Staff, Parent. Platform admin exists but has no screen yet.|Roles named by what they can do, since schools name staff differently.|Active|
|25|2026-10-23|Only the Owner can create or change fees.|Stops anyone quietly changing a fee or giving unofficial discounts.|Active|
|26|2026-10-23|"Still owed" counts only unpaid required fees. Optional fees are shown separately.|Parents shouldn't look like they owe for an excursion they didn't choose.|Active|
|27|2026-10-23|Later: parent online admission form; spreadsheet import of existing pupils.|Not needed for the first version; imports differ by school.|Parked|
|28|2026-10-23|Name: MyFee.|Gotten from "my" and "fees"|Active|
|29|2026-10-29|A fee can be marked paid in two ways: (1) Paystack confirms to the server, or (2) staff record an offline payment (cash, teller or direct bank transfer) and the bursar approves it. The browser can never mark a fee paid.|Some parents will still pay at the school or straight into its bank account. Without a way to record it, the balance would be wrong, and a wrong balance breaks the one thing that must work.|Active|
|30|2026-10-29|An offline payment record must include: child, fee, amount, payment method, date paid, bank or teller reference (for transfers and tellers), and who recorded it. Amount must equal the full fee.|Gives a trail that can be checked against the bank statement. Matches the full-payment-only rule (#23).|Active|
|31|2026-10-29|Two people for offline payments: Staff record it, the Owner approves it. Until approved it shows as "Recorded, awaiting approval" and does not reduce the balance.|One person alone can't mark a child paid when no money arrived.|Replaced by #35|
|32|2026-10-29|Recorded payments are never edited or deleted. A mistake is fixed by a reversal with a written reason, which is also logged.|A record that can be quietly changed is useless in a dispute or audit.|Active|
|33|2026-10-29|Once a fee is paid (online or offline), its Pay button disappears. If a Paystack payment arrives for a fee that is already paid, it is flagged for a refund instead of counted twice.|Stops a parent paying twice, for example paying cash and then online.|Active|
|34|2026-10-29|Parents see how a fee was paid (online or directly to the school) and get a receipt either way.|Parents who pay the school directly still need proof in the app.|Active|
|35|2026-10-29|The bursar approves offline payments, not the Owner. Only staff with the "can approve payments" permission (the bursar) can approve. Nobody can approve a payment they recorded themselves; if the bursar records one, the Owner approves it.|The bursar already checks the bank today, so approving fits their existing job and doesn't add work for the Owner. Keeping recorder and approver different keeps the two-person check.|Active|
|36|2026-10-29|Parents: no verification code when logging in on a new device. Login is email + password only. (Staff and Owner do need one, see #39.)|Parents mostly use one phone, and a code on every new device would annoy parents who change phones or clear their browser. MyFee is a less likely target than a bank or payment app: card details stay with Paystack, and MyFee can't move money. Protection comes from the password, the login limit (5 per hour) and the leaked-password check (Task 4).|Active|
|37|2026-10-29|Parents' phone numbers are kept so the school can call them, for example about overdue fees. MyFee does not send SMS.|Gives the phone number a real job, so collecting it is justified under the NDPA's "collect only what you need" rule.|Active|
|38|2026-10-29|When a new verification code is sent, any older code for that account (parent, staff or Owner) stops working.|Stops someone collecting several live codes to get more guesses at once.|Active|
|39|2026-10-29|Owner and staff (bursar or administrator) must enter a code when logging in on a new device. Parents don't (#36). Each person's code goes to their own email: the bursar's to the bursar, the Owner's to the Owner's personal email.|Owner and staff accounts can see every child and parent in the school, approve payments and change fees. Misuse could harm the parents, the school and the owner, so they need stricter security than parent accounts. Codes go to each person's own email so nobody depends on someone else to log in; if the Owner is busy or travelling, the bursar can still work.|Active|
|40|2026-10-29|Every failed code attempt and failed login is recorded (who, when, which account). A lockout sends an alert: a parent lockout emails that parent; a staff lockout alerts the Owner; an Owner lockout emails the Owner.|Gives a warning if someone is trying to break in. Alerts fire on lockouts, not on every wrong try, so people aren't flooded with messages from simple typos. Each alert goes to the person who can act on it.|Replaced by #43|
|41|2026-10-29|A parent never has to use MyFee to pay. Paystack is optional: any fee, including the very first one at admission, can be paid directly (cash, teller or bank transfer) and recorded by staff, even before the parent has accepted the invite.|Payments belong to the child and the fee, not to the parent's login. Forcing a new parent to create an account before they can pay would add a step and slow down admission (#14). When they later accept the invite, the payment is already there as paid.|Active|
|42|2026-10-29|Only the Owner, the bursar and admin staff use MyFee. Teachers, cleaners and other school workers don't get accounts.|They have no fee work to do, and every extra account is another way into children's data.|Active|
|43|2026-10-29|Every failed login and wrong code is recorded (who, when, which account). On a lockout, the alert goes to the email attached to that account, whoever it belongs to (parent, staff or Owner). The Owner can also see a log of all failed attempts and lockouts.|The account holder is the only one who knows whether the attempts were theirs: they ignore the alert if it was them, and act (for example, reset their password) if it wasn't. The log lets the school spot a pattern, like many accounts being tried at once. Alerts fire on lockouts only, so simple typos don't flood people with emails.|Active|

## Numbers (with reasons)

|What|My number|Why|
|-|-|-|
|Invite link expiry|24 hours|Most parents go straight to work after dropping off or enrolling their kids. A 24-hour window lets them use the link after work or early the next morning.<br /><br />Weak point: a parent enrolled on a Friday, or whose email lands in spam, may miss it. That's acceptable because staff can resend the invite in one click, and a short life means a forwarded or leaked link stops working quickly.|
|Parent code expiry|10 minutes|Sent by **email**, not SMS: every parent already has an email from the invite, and email is free while SMS costs money per message.<br /><br />Used only when resetting a forgotten password (no code for new devices, see #36).<br /><br />Why not shorter: some parents are on slow or unstable networks, so the email can take a few minutes to arrive and open.<br /><br />Why not longer: a phone or network that needs more than 10 minutes to receive an email couldn't run MyFee anyway. Guessing is already blocked by the 3-wrong-tries rule, so the expiry covers a different risk: an unused code sitting in a parent's inbox. If someone gets into that inbox later, an expired code is useless to them.|
|Wrong tries per code (parents and staff)|3|First and second wrong tries are fair mistakes (a mistyped digit). A third wrong try is suspicious, so the code is destroyed and a new one must be requested.|
|Code requests per hour (parents and staff)|3, then wait until the hour is up|At most 3 codes × 3 tries = 9 guesses an hour. Against a 6-digit code (1,000,000 possibilities), that's about a 1 in 111,000 chance per hour. It also stops someone flooding an inbox by requesting codes over and over.|
|Staff/Owner code expiry|3 minutes|Applies to every staff and Owner code: logging in on a new device and resetting a password. Stricter than parents' 10 minutes because these accounts are more sensitive. Staff and owners work on office laptops with stable connections (see brief), so the email arrives quickly.|
|Staff/Owner lockout|Same 3 tries per code and 3 codes per hour as parents; only the expiry is shorter (3 minutes)|Using up all 9 tries most likely means the person isn't careful enough with a sensitive account, or doesn't actually have access to the email the code was sent to.<br /><br />When this is wrong: the bursar mistypes during the busy first week of term and can't approve offline payments until the hour is up. I accept that cost: the Owner can still work, Paystack payments keep confirming automatically, and only offline approvals wait.|
|Login attempt limit (parents, staff and Owner)|5 failed attempts per hour|The limit is there to stop someone guessing a password and getting into children's records and payments. Five tries is enough to fix a typo or try a couple of old passwords. It applies to every account, and a lockout sends an alert (#43) so the account holder knows someone may be trying to break in.<br /><br />Someone who has truly forgotten their password won't remember it by waiting, so password reset still works during the lockout. The lockout only blocks guessing, not the real user.|

## Open questions (ask the school)

1. What fees exist besides tuition, and which are required?
2. What happens if a parent pays late?
3. Is there a sibling discount? How is it worked out?
4. Do any parents still pay cash, or transfer straight to the school's bank?
5. Does the principal need different powers from the bursar?
6. Do you have an admission number for each pupil? What does it look like?
7. What fee questions do parents ask most often?
8. Has a parent ever asked you to delete their information? What did you do?

