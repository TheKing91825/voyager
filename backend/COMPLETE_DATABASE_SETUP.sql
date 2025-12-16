-- ============================================
-- VOYAGER COMPLETE DATABASE SETUP
-- Run this in Supabase SQL Editor to set up everything
-- ============================================

-- ============================================
-- 1. CREATE ALL TABLES
-- ============================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  bio text,
  profile_image_url text,
  budget_preference text,
  travel_style text,
  travel_pace text,
  group_size integer,
  accommodation_preference text,
  transportation_preferences text[],
  dietary_preferences text[],
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id)
);

-- Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  location text,
  start_date date,
  end_date date,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trips_pkey PRIMARY KEY (id)
);

-- Trip Members Table
CREATE TABLE IF NOT EXISTS public.trip_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'editor'::text,
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trip_members_pkey PRIMARY KEY (id)
);

-- Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE,
  name text,
  description text,
  category text,
  latitude double precision,
  longitude double precision,
  image_url text,
  source text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activities_pkey PRIMARY KEY (id)
);

-- Group Swipes Table (Tinder-style voting)
CREATE TABLE IF NOT EXISTS public.group_swipes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE,
  preference text CHECK (preference = ANY (ARRAY['like'::text, 'dislike'::text, 'neutral'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT group_swipes_pkey PRIMARY KEY (id)
);

-- Itinerary Items Table
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE,
  day integer NOT NULL,
  activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE,
  start_time time without time zone,
  end_time time without time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT itinerary_items_pkey PRIMARY KEY (id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id)
);

-- Friends Table
CREATE TABLE IF NOT EXISTS public.friends (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending'::text 
    CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'blocked'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT friends_pkey PRIMARY KEY (id)
);

-- Visited Locations Table
CREATE TABLE IF NOT EXISTS public.visited_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  visited_at date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visited_locations_pkey PRIMARY KEY (id)
);

-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (user_id)
);

-- Admin Actions Table
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES public.admins(user_id) ON DELETE CASCADE,
  action_type text,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_actions_pkey PRIMARY KEY (id)
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visited_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view other profiles" ON public.profiles;
CREATE POLICY "Users can view other profiles"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- POSTS POLICIES
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Anyone can view posts"
ON public.posts FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);

-- COMMENTS POLICIES
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
CREATE POLICY "Anyone can view comments"
ON public.comments FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (auth.uid() = user_id);

-- TRIPS POLICIES
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
CREATE POLICY "Users can view their own trips"
ON public.trips FOR SELECT
USING (
  auth.uid() = owner_id OR
  EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_members.trip_id = trips.id
    AND trip_members.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create trips" ON public.trips;
CREATE POLICY "Users can create trips"
ON public.trips FOR INSERT
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update their trips" ON public.trips;
CREATE POLICY "Owners can update their trips"
ON public.trips FOR UPDATE
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete their trips" ON public.trips;
CREATE POLICY "Owners can delete their trips"
ON public.trips FOR DELETE
USING (auth.uid() = owner_id);

-- TRIP MEMBERS POLICIES
DROP POLICY IF EXISTS "Users can view trip members" ON public.trip_members;
CREATE POLICY "Users can view trip members"
ON public.trip_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trips
    WHERE trips.id = trip_members.trip_id
    AND (trips.owner_id = auth.uid() OR trip_members.user_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Trip owners can add members" ON public.trip_members;
CREATE POLICY "Trip owners can add members"
ON public.trip_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trips
    WHERE trips.id = trip_members.trip_id
    AND trips.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Trip owners can remove members" ON public.trip_members;
CREATE POLICY "Trip owners can remove members"
ON public.trip_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.trips
    WHERE trips.id = trip_members.trip_id
    AND trips.owner_id = auth.uid()
  )
);

-- ACTIVITIES POLICIES
DROP POLICY IF EXISTS "Trip members can view activities" ON public.activities;
CREATE POLICY "Trip members can view activities"
ON public.activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trips
    WHERE trips.id = activities.trip_id
    AND (
      trips.owner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.trip_members
        WHERE trip_members.trip_id = trips.id
        AND trip_members.user_id = auth.uid()
      )
    )
  )
);

DROP POLICY IF EXISTS "Trip members can add activities" ON public.activities;
CREATE POLICY "Trip members can add activities"
ON public.activities FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trips
    WHERE trips.id = activities.trip_id
    AND (
      trips.owner_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.trip_members
        WHERE trip_members.trip_id = trips.id
        AND trip_members.user_id = auth.uid()
      )
    )
  )
);

-- FRIENDS POLICIES
DROP POLICY IF EXISTS "Users can view their friendships" ON public.friends;
CREATE POLICY "Users can view their friendships"
ON public.friends FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send friend requests" ON public.friends;
CREATE POLICY "Users can send friend requests"
ON public.friends FOR INSERT
WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can update their friend requests" ON public.friends;
CREATE POLICY "Users can update their friend requests"
ON public.friends FOR UPDATE
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- VISITED LOCATIONS POLICIES
DROP POLICY IF EXISTS "Users can view their visited locations" ON public.visited_locations;
CREATE POLICY "Users can view their visited locations"
ON public.visited_locations FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add visited locations" ON public.visited_locations;
CREATE POLICY "Users can add visited locations"
ON public.visited_locations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. CREATE TRIGGER FUNCTION FOR AUTO PROFILE CREATION
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_trips_owner_id ON public.trips(owner_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON public.trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user_id ON public.trip_members(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON public.activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_friends_requester_id ON public.friends(requester_id);
CREATE INDEX IF NOT EXISTS idx_friends_receiver_id ON public.friends(receiver_id);

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify setup
SELECT 'Database setup complete!' as status;
SELECT 'Total tables created: ' || COUNT(*)::text as tables_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
