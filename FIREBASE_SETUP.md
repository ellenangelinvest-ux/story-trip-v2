# Firebase Setup Guide for StoryTrip

This guide will help you set up Firebase to enable real authentication and photo uploads in StoryTrip.

## Quick Start

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "storytrip")
4. Disable Google Analytics (optional) and click "Create project"

### 2. Add a Web App

1. In your Firebase project, click the web icon (</>) to add a web app
2. Register your app with a nickname (e.g., "StoryTrip Web")
3. Copy the Firebase configuration object - you'll need this for the next step

### 3. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your Firebase config values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:

#### Google Sign-In
- Click "Google"
- Toggle "Enable"
- Add your support email
- Click "Save"

#### Facebook Sign-In (Optional)
- Click "Facebook"
- Toggle "Enable"
- You'll need a Facebook App ID and Secret from [Facebook Developers](https://developers.facebook.com/)
- Add the OAuth redirect URI to your Facebook app settings
- Click "Save"

#### Email/Password
- Click "Email/Password"
- Toggle "Enable"
- Click "Save"

### 5. Set Up Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Done"

#### Firestore Security Rules (Production)

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read/write their own trips
    match /trips/{tripId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Users can read/write their own bookmarks
    match /bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Users can read/write their own photos
    match /photos/{photoId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 6. Set Up Firebase Storage

1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Click "Done"

#### Storage Security Rules (Production)

For production, update your Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Add Authorized Domains

1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Add your deployment domain (e.g., `story-trip.vercel.app`)
3. Add `localhost` for development

## Vercel Deployment

When deploying to Vercel, add your Firebase environment variables:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add each `VITE_FIREBASE_*` variable from your `.env` file

## Testing

After setup:

1. Run `npm run dev` to start the development server
2. Try signing in with Google - a real Google OAuth popup should appear
3. Try uploading photos - they should appear in your Firebase Storage
4. Check Firestore to see user profiles being saved

## Troubleshooting

### "Firebase not configured" banner appears
- Check that your `.env` file exists and contains valid values
- Make sure variable names start with `VITE_`
- Restart the dev server after adding environment variables

### Google Sign-In not working
- Verify Google is enabled in Authentication > Sign-in method
- Check that your domain is in the authorized domains list
- Look for errors in the browser console

### Photo uploads failing
- Verify Storage is enabled
- Check Storage rules allow writes
- Verify the user is authenticated

### Facebook Sign-In not working
- Ensure you have a valid Facebook App ID and Secret
- Add the Firebase OAuth redirect URI to Facebook app settings
- Facebook requires a privacy policy URL for production apps

## Data Structure

### Users Collection
```
users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - photoURL: string
  - name: string
  - gender: string
  - nationality: string
  - interests: string[]
  - personality: string
  - relationshipStatus: string
  - travelDates: object
  - budgetRange: string
  - groupPreference: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Photos Collection
```
photos/{photoId}
  - id: string
  - url: string
  - fileName: string
  - uploadedAt: timestamp
  - tripId: string
  - userId: string
```

### Trips Collection
```
trips/{tripId}
  - userId: string
  - title: string
  - destination: string
  - category: string
  - status: string
  - itinerary: object
  - createdAt: timestamp
```

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Web SDK Reference](https://firebase.google.com/docs/reference/js)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
