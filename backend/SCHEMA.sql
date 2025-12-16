-- Voyager Database Schema
-- Supabase PostgreSQL

-- Profiles Table
CREATE TABLE public.profiles (
  id uuid NOT NULL,
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
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Posts Table
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  content text,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Comments Table
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  user_id uuid,
  content text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id),
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Trips Table
CREATE TABLE public.trips (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid,
  name text,
  location text,
  start_date date,
  end_date date,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trips_pkey PRIMARY KEY (id),
  CONSTRAINT trips_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);

-- Trip Members Table
CREATE TABLE public.trip_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid,
  user_id uuid,
  role text DEFAULT 'editor'::text,
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trip_members_pkey PRIMARY KEY (id),
  CONSTRAINT trip_members_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT trip_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Activities Table
CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid,
  name text,
  description text,
  category text,
  latitude double precision,
  longitude double precision,
  image_url text,
  source text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id)
);

-- Group Swipes Table (Tinder-style voting)
CREATE TABLE public.group_swipes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid,
  user_id uuid,
  activity_id uuid,
  preference text CHECK (preference = ANY (ARRAY['like'::text, 'dislike'::text, 'neutral'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT group_swipes_pkey PRIMARY KEY (id),
  CONSTRAINT group_swipes_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT group_swipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT group_swipes_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id)
);

-- Itinerary Items Table
CREATE TABLE public.itinerary_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid,
  day integer NOT NULL,
  activity_id uuid,
  start_time time without time zone,
  end_time time without time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT itinerary_items_pkey PRIMARY KEY (id),
  CONSTRAINT itinerary_items_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT itinerary_items_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id)
);

-- Reviews Table
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  activity_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT reviews_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.activities(id)
);

-- Friends Table
CREATE TABLE public.friends (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  requester_id uuid,
  receiver_id uuid,
  status text NOT NULL DEFAULT 'pending'::text 
    CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'blocked'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT friends_pkey PRIMARY KEY (id),
  CONSTRAINT friends_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(id),
  CONSTRAINT friends_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES auth.users(id)
);

-- Visited Locations Table
CREATE TABLE public.visited_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  city text,
  country text,
  latitude double precision,
  longitude double precision,
  visited_at date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visited_locations_pkey PRIMARY KEY (id),
  CONSTRAINT visited_locations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Admins Table
CREATE TABLE public.admins (
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admins_pkey PRIMARY KEY (user_id),
  CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Admin Actions Table
CREATE TABLE public.admin_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_user_id uuid,
  action_type text,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_actions_pkey PRIMARY KEY (id),
  CONSTRAINT admin_actions_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.admins(user_id)
);
