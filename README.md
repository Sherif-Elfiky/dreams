# Dreams App

A simple dream journal application where you can record, edit, and track your dreams. Sign in with Google and start keeping track of your dreams with mood tracking and tags.

## What it does

- Record dreams with title, description, date, mood, and tags
- Edit and delete existing dreams
- View statistics about your dreams (total count, weekly count, average per week)
- All data is stored locally in your browser

## Requirements

- Node.js 18 or higher
- npm or yarn
- Google account for authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

3. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to use

1. Sign in with Google on the homepage
2. Go to the dashboard
3. Click "Add New Dream" to record a dream
4. Fill in the dream details and save
5. Edit or delete dreams using the buttons on each dream card
