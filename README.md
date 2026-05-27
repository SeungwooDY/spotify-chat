# Spotify Chat

Spotify Chat is a social app built on top of Spotify. Users log in with their Spotify account and get access to their listening stats, a customizable profile, direct messaging, and music discussion forums, all in one place.

Built with React, Express, and Firebase.

---

## Table of Contents

- [Project Description](#spotify-chat)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Features and Status](#features-and-status)
- [Credits](#credits)

---

## Installation

### Prerequisites

- Node.js 18+
- A [Spotify Developer app](https://developer.spotify.com/dashboard) with a registered redirect URI
- A Firebase project with Firestore enabled

### 1. Clone and install

```bash
git clone <repo-url>
cd spotify-chat

cd backend && npm install
cd ../frontend && npm install
```

### 2. External setup

**Spotify:** In your Spotify Developer Dashboard, add `http://127.0.0.1:3000/callback` as a Redirect URI.

**Firebase:** Create a Firestore database in your Firebase project. No additional rules configuration is required for local development.

### 3. Create `backend/.env`

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://127.0.0.1:3000/callback
FRONTEND_URI=http://127.0.0.1:5173

FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...

PORT=3000
```

### 4. Run

```bash
# terminal 1
cd backend && npm start

# terminal 2
cd frontend && npm run dev
```

App runs at `http://127.0.0.1:5173`.

---

## How to Use

1. Visit the app and click **Login with Spotify** to authenticate.
2. After logging in, you'll be taken to your dashboard where you can navigate to any page from the sidebar.
3. Visit **Top Artists** or **Top Songs** to see your Spotify listening history filtered by time range.
4. Visit **Liked Songs** to browse your saved tracks.
5. Go to **Profile** to set up your in-app profile: write a bio, choose featured artists and songs, and decide whether your profile is public or private.
6. Visit **Discover** to browse other users with public profiles.
7. Use the **Inbox** to send and receive direct messages with other users.
8. Head to **Forums** to browse discussion boards, search by name, create posts, and like posts from other users.

---

## Features and Status

| Feature | Description | Status |
|---------|-------------|--------|
| Login / Auth | Spotify OAuth 2.0 login, token exchange handled server-side | Complete |
| Top Artists | View top artists filterable by time range | In Progress |
| Top Songs | View top songs filterable by time range | In Progress |
| Liked Songs | Browse saved/liked tracks with album art | In Progress |
| Profile Page | Edit bio, featured artists/songs, public/private toggle | In Progress |
| Discover | Browse all public user profiles | In Progress |
| Inbox | Direct messaging between users | In Progress |
| Forums | Discussion boards with search, create post, and likes | In Progress |

---

## Credits

Developed by:

- Aleya Banthavong
- Sohan Dadana
- Emily Middleton
- Angelina Rodriguez
- Seungwoo Yoon
