# 🔐 Supabase Integration Guide

Supabase is an open-source Firebase alternative that provides authentication, real-time database, and storage capabilities.

## 📋 What's Included

- ✅ Supabase JavaScript client
- ✅ Auth helpers for React
- ✅ Environment configuration
- ✅ Supabase service utilities

## 🚀 Quick Setup

### Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New project"
3. Enter project name: `crop-sowing-assessment`
4. Create a password
5. Select region closest to India (Singapore recommended)
6. Wait for project to initialize

### Step 2: Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

### Step 3: Configure Environment

Update `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Set Up Authentication

In Supabase Console:

1. Go to **Authentication** → **Providers**
2. Enable:
   - ✅ Email/Password (default)
   - ✅ Google (optional)
   - ✅ GitHub (optional)

3. Go to **URL Configuration**
4. Add your Netlify URL to Redirect URLs:
   ```
   https://your-domain.netlify.app
   https://your-domain.netlify.app/auth/callback
   ```

### Step 5: Create Database Tables

In **SQL Editor**, run:

```sql
-- Users Profile
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Parcels Integration (optional)
CREATE TABLE public.parcels_supabase (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parcel_id INTEGER,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  geometry GEOMETRY(POLYGON, 4326),
  area_hectares FLOAT,
  crop_type TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.parcels_supabase ENABLE ROW LEVEL SECURITY;
```

---

## 💻 Usage Examples

### Authentication

```typescript
import { supabase, signUp, signIn, signOut } from '@/services/supabase';

// Sign up
const signUpUser = async (email: string, password: string) => {
  const { data, error } = await signUp(email, password);
  if (error) console.error('Signup error:', error);
  return data;
};

// Sign in
const loginUser = async (email: string, password: string) => {
  const { data, error } = await signIn(email, password);
  if (error) console.error('Login error:', error);
  return data;
};

// Sign out
const logoutUser = async () => {
  await signOut();
};

// Get current user
const getCurrentUserData = async () => {
  const { data: { user } } = await getCurrentUser();
  return user;
};
```

### Real-time Listeners

```typescript
import { onAuthStateChange } from '@/services/supabase';

// Listen for auth changes
onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});
```

### Database Operations

```typescript
import { supabase } from '@/services/supabase';

// Insert
const addParcel = async (parcelData: any) => {
  const { data, error } = await supabase
    .from('parcels_supabase')
    .insert([parcelData]);
  return { data, error };
};

// Select
const getParcels = async () => {
  const { data, error } = await supabase
    .from('parcels_supabase')
    .select('*');
  return { data, error };
};

// Update
const updateParcel = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('parcels_supabase')
    .update(updates)
    .eq('id', id);
  return { data, error };
};

// Delete
const deleteParcel = async (id: string) => {
  const { data, error } = await supabase
    .from('parcels_supabase')
    .delete()
    .eq('id', id);
  return { data, error };
};
```

### File Storage

```typescript
import { supabase } from '@/services/supabase';

// Upload file
const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  return { data, error };
};

// Get public URL
const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
};

// Download file
const downloadFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);
  return { data, error };
};
```

---

## 🔧 Environment Variables

Add to Netlify settings:

```
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

---

## 📊 Architecture

```
┌─────────────────────────────────┐
│  Frontend (React + Supabase)    │
│  - Authentication ✅            │
│  - Real-time updates ✅        │
│  - File storage ✅              │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Supabase (Backend as Service)  │
│  - PostgreSQL database ✅       │
│  - Auth system ✅               │
│  - Storage ✅                   │
│  - Real-time subscriptions ✅   │
│  - RLS policies ✅              │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Spring Boot API (Optional)     │
│  - Business logic ✅            │
│  - Spatial analysis ✅          │
│  - External integrations ✅     │
└─────────────────────────────────┘
```

---

## 🔒 Security Best Practices

1. **Never commit API keys** - Use `.env.local` (already in `.gitignore`)
2. **Enable Row Level Security (RLS)** - Control who sees what data
3. **Use Service Role Key carefully** - Only on backend, never frontend
4. **Validate all inputs** - Supabase validates, but double-check
5. **Set up CORS** - Already handled by Supabase

---

## 🚨 Troubleshooting

### "Supabase credentials not configured"
- Check `.env.local` has correct values
- Restart dev server: `npm run dev`

### "CORS error"
- Add your domain to Supabase Settings → URL Configuration
- Clear browser cache

### "Auth redirect not working"
- Verify redirect URL in Supabase matches exactly
- Check browser console for errors

### "RLS policy denying access"
- Check SQL policies in Supabase
- Verify authenticated user ID is correct

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Auth Examples](https://github.com/supabase/supabase/tree/master/examples)

---

✅ **You're all set to use Supabase!**
