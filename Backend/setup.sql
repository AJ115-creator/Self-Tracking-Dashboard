
-- 1. Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create feature_clicks table for tracking
CREATE TABLE IF NOT EXISTS feature_clicks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_clicks ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for profiles table
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. RLS Policies for feature_clicks table
-- Users can insert their own clicks
CREATE POLICY "Users can insert own clicks" ON feature_clicks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read all clicks (for analytics - or restrict to own clicks)
CREATE POLICY "Users can read all clicks" ON feature_clicks
  FOR SELECT USING (true);

-- 6. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feature_clicks_user_id ON feature_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_clicks_timestamp ON feature_clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_feature_clicks_feature_name ON feature_clicks(feature_name);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);
