# Deroua Services

Arabic/French/English local services directory built with React, TypeScript, Vite and Firebase.

## Canonical project and commands

Run all commands from the repository root. The duplicate nested project, old PocketBase implementation, one-off repair scripts and checked-in build archives have been removed. Build artifacts must come from this source, not an old ZIP.

Requires Node.js 22.13+ (tested with 22.23.2). Firebase emulator tests also require Java 21+.

```sh
npm ci
npm test
npm run test:rules
npm run build
npm run preview
```

The public UI lists approved records only. Visitor submissions are sent to Firebase as pending. A failure keeps the form open and its data available for retry; no local success or promised background synchronization is fabricated. Language, theme and favorites remain local. This is not a service-worker/PWA offline installation.

## Required Firebase rollout

This branch does not change production Firebase configuration or deploy the website.

1. Back up Firestore and inspect the current production rules. These files define access only for `services`, `advertisements` and the new image paths; review any other legitimate consumers before publishing.
2. Enable Anonymous Authentication for visitor submissions and Email/Password Authentication for administrators in project `deroua-services`. No anonymous sign-in is required merely to browse.
3. Using a trusted Firebase Admin SDK environment, assign the `admin: true` custom claim to the intended existing administrator UID, preserving unrelated custom claims. Never set this claim from the client. Then sign out and back in. An authenticated user without this claim cannot moderate.
4. Review/migrate existing records. Approved services need BOTH `status: "approved"` and `verified: true`. Approved advertisements need BOTH `status: "approved"` and `isApproved: true`. Documents missing explicit approval will not be public. Do not blindly approve legacy submissions.
5. Deploy rules using an authorized account: `npx firebase deploy --project deroua-services --only firestore:rules,storage`. Storage rules that consult Firestore may require enabling cross-service permission in Firebase's deployment flow. Test on staging first; the included emulator tests use `demo-deroua-test` only.
6. Build and deploy the frontend together with the new rules, then verify real visitor submission, administrator review, publication, rejection and sign-out on staging before production rollout.

The administrator entry points share the same Firebase login and custom-claim authorization. Public clients cannot set trusted approval, rating or duty fields in submissions. Pending requests are not readable by visitors. Uploads use `ads/{ownerUid}/{adId}/image`, are limited to JPEG/PNG/WebP and 5 MiB, and cannot overwrite an existing image. Failed document creation attempts clean up their newly uploaded image. Approved advertisement fields, including descriptions and notes, must be considered public; do not enter sensitive material.

Firebase configuration in `src/lib/firebase.ts` identifies the existing project; its web API key is not an administrator credential. Security depends on the deployed rules and Auth configuration.

Official references:
- https://firebase.google.com/docs/auth/admin/custom-claims
- https://firebase.google.com/docs/rules/basics

## Pharmacy duty

The old hard-coded “this week” claim has been removed. A pharmacy is shown as currently on duty only when it is approved/verified and has:
- `isGuardPharmacy: true`
- `guardStartsAt` and `guardEndsAt`: ISO timestamps including a timezone, with start <= now < end.
- `guardSource`: nonempty confirmation source.

The moderator's duty editor saves the period and `guardVerifiedAt`. Datetime inputs use the moderator device's local time and are stored as ISO UTC timestamps. An expired or unsourced record is not replaced by a random pharmacy. No current roster has been invented.

Existing static directory entries remain in `src/data/derouaData.ts`; the moderator UI explains that those entries are edited in source until deliberately migrated. Seeded sample user submissions are no longer loaded into the public directory. Migrating all static services and verifying actual contact details remain separate tasks.

## Hosting

`npm run deploy` builds the root project and uploads `dist/` over certificate-verified explicit FTPS. Supply:
- `DEROUA_FTP_HOST`
- `DEROUA_FTP_USER`
- `DEROUA_FTP_PASSWORD`
- optional `DEROUA_FTP_PORT` (21), `DEROUA_FTP_DIRECTORY` (/public_html)

The host must support FTPS. There is no plaintext fallback. Assets are uploaded before the entry HTML. This script does not publish Firebase rules.

**Rotate the hosting password that previously appeared in source.** Removing it from current files does not remove it from Git history or previously deployed JavaScript/archives. After rotation, review and remove obsolete public build assets and archives using the hosting provider. No production password was changed by this patch, and no production files were deleted.

## Validation and remaining work

Automated tests cover publication filters, removal of stale data, failed submissions, forged local admin state, dated pharmacy duty, URL/phone normalization and Firestore/Storage authorization. Production rules and the live database are not tested by emulator runs.

Independent service URLs/SSR, full English editorial coverage, authoritative verification of phone numbers/ratings, and further Firebase bundle splitting are not completed in this patch.
