# Last Time Since

A personal "time since" tracker built with React. Track how long it's been since you did something, with optional cloud sync across devices.

## Features

- ✅ **Guest Mode** - Works immediately without signup (uses localStorage)
- ✅ **Cloud Sync** - Optional Supabase integration for cross-device access
- ✅ **Add/Edit/Delete Tasks** - Full CRUD operations
- ✅ **Organize by Folders** - Create folders (e.g. GF 1, GF 2) and assign tasks; "All" folder shows everything
- ✅ **Live Countdown** - Real-time elapsed time updates every second
- ✅ **Custom Colors & Icons** - Personalize each task
- ✅ **Seamless Migration** - Auto-migrate localStorage tasks to cloud on signup

## Quick Start (Guest Mode)

The app works immediately without any setup:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) - you can start tracking right away!

## Cloud Sync Setup (Optional)

To enable cross-device sync, set up Supabase:

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to finish provisioning

### 2. Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run it in the SQL Editor
4. This creates the `tasks` table with Row Level Security policies

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to **Settings** → **API** in Supabase Dashboard
   - Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy your **anon/public key**

3. Update `.env`:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Restart the dev server:
   ```bash
   npm start
   ```

### 4. Test Authentication

1. Click **"Save to Cloud"** button (top-right)
2. Sign up with email/password
3. Your localStorage tasks will automatically migrate to the cloud
4. Sign in on another device to see your synced tasks!

## Project Structure

```
src/
├── pages/
│   ├── Last_Time_since.jsx  # Main component
│   └── App.css              # Styles
├── components/
│   ├── AuthModal.jsx        # Sign up/sign in modal
│   └── UserBadge.jsx        # User indicator
├── hooks/
│   └── useAuth.js           # Authentication hook
├── services/
│   └── dataService.js       # Data abstraction layer
└── config/
    └── supabase.js          # Supabase client config
```

## How It Works

### Guest Mode (Default)
- Uses browser `localStorage`
- No account required
- Data stays on your device
- Works offline

### Cloud Mode (Optional)
- Uses Supabase PostgreSQL database
- Requires free account
- Syncs across devices
- Automatic backup

### Data Migration
When you sign up:
1. Your localStorage tasks are automatically detected
2. They're migrated to Supabase
3. localStorage is cleared
4. Future changes sync to cloud

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | Only for cloud sync |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Only for cloud sync |

**Note:** The app works in guest mode without these variables. They're only needed for cloud sync.

## Database Schema

The `tasks` table structure:

- `id` - UUID primary key
- `user_id` - UUID foreign key to `auth.users`
- `label` - Task description (e.g., "i texted her")
- `last_done` - Timestamp of when it last happened
- `color` - Hex color code
- `icon_index` - Index of icon in ICON_OPTIONS array
- `created_at` - Auto-generated timestamp
- `updated_at` - Auto-updated timestamp

Row Level Security (RLS) ensures users can only access their own tasks.

## Deployment

### Vercel / Netlify

1. Push your code to GitHub
2. Import the repository in Vercel/Netlify
3. Add environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
4. Deploy!

### Static Hosting

```bash
npm run build
```

Upload the `build` folder contents to any static host. Guest mode will work, but cloud sync requires environment variables to be set.

## Troubleshooting

### "Supabase not configured" warning
- This is normal in guest mode
- Add `.env` file with Supabase credentials to enable cloud sync

### Tasks not syncing
- Check that environment variables are set correctly
- Verify Supabase project is active
- Check browser console for errors

### Migration failed
- Check Supabase dashboard for errors
- Verify database schema is set up correctly
- Tasks remain in localStorage if migration fails

## Tech Stack

- **React 19** - UI framework
- **Supabase** - Backend (PostgreSQL + Auth)
- **Lucide React** - Icons
- **localStorage** - Guest mode storage

## License

MIT

## Support

For issues or questions, check the console logs or Supabase dashboard for error details.
