# Firebase CMS Admin Setup

## 1) Security first
- The downloaded service account file must stay server-side only.
- Do not commit service account JSON files to git.
- If the key was exposed, revoke and regenerate it in Google Cloud IAM immediately.

## 2) Configure client env
1. Copy `client/.env.example` to `client/.env`.
2. Fill all `VITE_FIREBASE_*` values from Firebase Project Settings > General > Your apps (Web).
3. Optionally set `VITE_ADMIN_EMAILS` as a comma-separated allowlist.

## 3) Enable Firebase Authentication
1. Firebase Console > Authentication > Sign-in method.
2. Enable `Email/Password`.
3. Create admin users in Authentication > Users.

## 4) Enable Firebase Storage
1. Firebase Console > Storage.
2. Click Get started and choose a region.
3. Keep `VITE_FIREBASE_STORAGE_BUCKET` in `client/.env` aligned with your Firebase app settings.

## 5) Create admin access records
1. Open Firestore Database.
2. Create collection: `admins`.
3. Sign in once at `/admin` and copy the displayed Firebase `uid` from the "Admin Access Setup" screen.
4. Create a document where doc ID is that `uid`.
5. Add field:
   - `active`: `true` (boolean)

After adding this document, refresh `/admin` and access will be granted.

## 6) CMS document location
The app reads and writes the CMS document at:
- Collection: `cms`
- Document: `site-content`

Version snapshots are stored at:
- Collection: `cms-admin-history`
- Documents: auto-generated per save/restore action

## 7) Firestore rules (starter)
Use strict rules and only allow authenticated admins to write CMS content.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && exists(/databases/$(database)/documents/admins/$(request.auth.uid))
        && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.active == true;
    }

    match /cms/site-content {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /cms-admin-history/{entryId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    match /admins/{uid} {
      allow read: if isAdmin();
      allow write: if false;
    }
  }
}
```

## 8) Storage rules (starter)
Restrict uploads to authenticated admins and allow public reads for website images.

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && firestore.get(/databases/(default)/documents/admins/$(request.auth.uid)).data.active == true;
    }

    match /cms/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 9) Deploy rules from this repository
From repository root (`/workspaces/artful`):
1. Install Firebase CLI if needed: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Select project: `firebase use <your-project-id>`
4. Deploy rules: `firebase deploy --only firestore:rules,storage`

This repo now includes:
- `firestore.rules`
- `storage.rules`
- `firebase.json`

## 10) Seed Firestore with existing website data
1. Run the client app and open `/admin`.
2. Sign in with an admin account that exists in `admins/{uid}` with `active: true`.
3. The app auto-seeds Firestore if `cms/site-content` does not exist.
4. Confirm these documents/collections are created:
   - `cms/site-content`
   - `cms-admin-history/*` with action `seed`

## 11) Use the admin page
1. Run the client app.
2. Go to `/admin`.
3. Sign in with an admin user.
4. Update hero slides, portfolio projects, services images/descriptions, or JSON directly.
5. Use the file inputs beside image URL fields to upload images to Firebase Storage.
6. Save changes and refresh public pages.
7. Use the Version History panel to restore any previous snapshot.
8. Confirm each save creates a new `cms-admin-history` entry with action `save` or `restore`.
