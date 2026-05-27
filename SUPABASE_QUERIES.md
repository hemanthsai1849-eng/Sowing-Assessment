# 🗂️ Supabase Queries & Authentication Guide

## Quick Start: Query Supabase Data

### 1. Read Data (SELECT)

```typescript
import { supabase } from '@/services/supabase';

// Get all records
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('*');

// Get specific columns
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('id, crop_type, area_hectares');

// Get with conditions (WHERE)
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('*')
  .eq('crop_type', 'Rice');

// Get with multiple conditions
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('*')
  .eq('crop_type', 'Rice')
  .gt('area_hectares', 10);

// Get single record
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('*')
  .eq('id', 'parcel-123')
  .single();

// Get with pagination
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('*')
  .range(0, 9);  // First 10 records

// Order results
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('*')
  .order('area_hectares', { ascending: false });

// Limit results
const { data, error } = await supabase
  .from('parcels_supabase')
  .select('*')
  .limit(5);
```

---

## 2. Insert Data (CREATE)

```typescript
import { supabase } from '@/services/supabase';

// Insert single record
const { data, error } = await supabase
  .from('parcels_supabase')
  .insert([
    {
      parcel_id: 101,
      crop_type: 'Corn',
      area_hectares: 15.5,
      status: 'active',
      geometry: null // Add geometry later
    }
  ]);

// Insert multiple records
const { data, error } = await supabase
  .from('parcels_supabase')
  .insert([
    { parcel_id: 102, crop_type: 'Wheat', area_hectares: 12 },
    { parcel_id: 103, crop_type: 'Rice', area_hectares: 20 }
  ]);

// Get inserted record back
const { data, error } = await supabase
  .from('parcels_supabase')
  .insert([{ parcel_id: 104, crop_type: 'Sugarcane', area_hectares: 25 }])
  .select();
```

---

## 3. Update Data (UPDATE)

```typescript
import { supabase } from '@/services/supabase';

// Update by ID
const { data, error } = await supabase
  .from('parcels_supabase')
  .update({ crop_type: 'Barley', status: 'updated' })
  .eq('id', 'parcel-123');

// Update multiple records
const { data, error } = await supabase
  .from('parcels_supabase')
  .update({ status: 'inactive' })
  .eq('crop_type', 'Rice');

// Update and return data
const { data, error } = await supabase
  .from('parcels_supabase')
  .update({ area_hectares: 30 })
  .eq('id', 'parcel-123')
  .select();
```

---

## 4. Delete Data (DELETE)

```typescript
import { supabase } from '@/services/supabase';

// Delete by ID
const { data, error } = await supabase
  .from('parcels_supabase')
  .delete()
  .eq('id', 'parcel-123');

// Delete multiple records
const { data, error } = await supabase
  .from('parcels_supabase')
  .delete()
  .lt('area_hectares', 5);  // Delete parcels smaller than 5 hectares
```

---

## 5. Real-Time Subscriptions (LISTEN)

```typescript
import { supabase } from '@/services/supabase';

// Subscribe to all changes
const channel = supabase
  .channel('parcels_channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'parcels_supabase' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Listen to specific events
const channel = supabase
  .channel('parcels_insert')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'parcels_supabase' },
    (payload) => {
      console.log('New parcel added:', payload.new);
    }
  )
  .subscribe();

// Unsubscribe when done
supabase.removeChannel(channel);
```

---

## 6. Authentication (Sign Up, Sign In)

```typescript
import { supabase, signUp, signIn, signOut, getCurrentUser } from '@/services/supabase';

// Sign Up
const handleSignUp = async (email: string, password: string) => {
  const { data, error } = await signUp(email, password);
  
  if (error) {
    console.error('Signup failed:', error.message);
    return null;
  }
  
  console.log('User created:', data.user);
  return data.user;
};

// Sign In
const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await signIn(email, password);
  
  if (error) {
    console.error('Login failed:', error.message);
    return null;
  }
  
  console.log('Logged in:', data.user);
  return data.user;
};

// Sign Out
const handleSignOut = async () => {
  const { error } = await signOut();
  
  if (error) {
    console.error('Logout failed:', error.message);
  }
};

// Get Current User
const handleGetCurrentUser = async () => {
  const { data: { user }, error } = await getCurrentUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  console.log('Current user:', user);
  return user;
};
```

---

## 7. Advanced Filtering

```typescript
import { supabase } from '@/services/supabase';

// Filter operators
const queries = {
  // Equals
  eq: () => supabase.from('parcels_supabase').select('*').eq('crop_type', 'Rice'),
  
  // Not equals
  neq: () => supabase.from('parcels_supabase').select('*').neq('status', 'inactive'),
  
  // Greater than
  gt: () => supabase.from('parcels_supabase').select('*').gt('area_hectares', 10),
  
  // Greater than or equal
  gte: () => supabase.from('parcels_supabase').select('*').gte('area_hectares', 10),
  
  // Less than
  lt: () => supabase.from('parcels_supabase').select('*').lt('area_hectares', 5),
  
  // Less than or equal
  lte: () => supabase.from('parcels_supabase').select('*').lte('area_hectares', 5),
  
  // Like (partial match)
  like: () => supabase.from('parcels_supabase').select('*').like('crop_type', '%ice'),
  
  // In array
  in: () => supabase.from('parcels_supabase').select('*').in('crop_type', ['Rice', 'Wheat']),
  
  // Is null
  isNull: () => supabase.from('parcels_supabase').select('*').is('geometry', null),
  
  // Text search
  textSearch: () => supabase.from('parcels_supabase').select('*').textSearch('crop_type', 'Rice'),
};
```

---

## 8. Example: React Component with Supabase

```typescript
import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

interface Parcel {
  id: string;
  parcel_id: number;
  crop_type: string;
  area_hectares: number;
  status: string;
}

export const ParcelList: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch parcels on mount
  useEffect(() => {
    fetchParcels();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('parcels_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'parcels_supabase' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchParcels(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch parcels from database
  const fetchParcels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parcels_supabase')
        .select('*')
        .order('area_hectares', { ascending: false });

      if (error) throw error;
      setParcels(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new parcel
  const addParcel = async (parcelData: Omit<Parcel, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('parcels_supabase')
        .insert([parcelData])
        .select();

      if (error) throw error;
      setParcels([...parcels, ...(data || [])]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete parcel
  const deleteParcel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('parcels_supabase')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setParcels(parcels.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Parcels</h2>
      <ul>
        {parcels.map(parcel => (
          <li key={parcel.id}>
            <strong>{parcel.crop_type}</strong> - {parcel.area_hectares} hectares
            <button onClick={() => deleteParcel(parcel.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 9. Common Error Handling

```typescript
import { supabase } from '@/services/supabase';

const handleQuery = async () => {
  try {
    const { data, error } = await supabase
      .from('parcels_supabase')
      .select('*');

    if (error) {
      // Error occurred
      if (error.code === 'PGRST116') {
        console.error('Table not found');
      } else if (error.message.includes('JWT')) {
        console.error('Authentication failed - need to login');
      } else if (error.message.includes('permission')) {
        console.error('Permission denied - check RLS policies');
      } else {
        console.error('Query error:', error.message);
      }
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};
```

---

## 📋 Query Reference Table

| Operation | Method | Example |
|-----------|--------|---------|
| Read all | `.select('*')` | `supabase.from('table').select('*')` |
| Read specific | `.select('col1,col2')` | `supabase.from('table').select('id,name')` |
| Condition | `.eq()` | `supabase.from('table').select('*').eq('id', 1)` |
| Insert | `.insert()` | `supabase.from('table').insert([data])` |
| Update | `.update()` | `supabase.from('table').update(data).eq('id', 1)` |
| Delete | `.delete()` | `supabase.from('table').delete().eq('id', 1)` |
| Subscribe | `.channel().on()` | Real-time updates |
| Limit | `.limit()` | `supabase.from('table').select('*').limit(10)` |
| Order | `.order()` | `supabase.from('table').select('*').order('id')` |

---

## 🔒 Row Level Security (RLS)

Enable RLS on tables to control who can query what data:

```sql
-- Enable RLS
ALTER TABLE public.parcels_supabase ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own parcels
CREATE POLICY "Users can view their own parcels" 
ON public.parcels_supabase 
FOR SELECT 
USING (auth.uid() = owner_id);

-- Allow authenticated users to insert
CREATE POLICY "Users can insert parcels"
ON public.parcels_supabase
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Allow users to update only their own
CREATE POLICY "Users can update their own parcels"
ON public.parcels_supabase
FOR UPDATE
USING (auth.uid() = owner_id);

-- Allow users to delete only their own
CREATE POLICY "Users can delete their own parcels"
ON public.parcels_supabase
FOR DELETE
USING (auth.uid() = owner_id);
```

---

## 🚀 Next Steps

1. **Set up authentication** - Add login/signup pages
2. **Create tables** - Define your data schema
3. **Enable RLS** - Secure your data
4. **Add subscriptions** - Real-time updates
5. **Deploy** - Push to production

Need help with any specific query? Just ask! 🎉
