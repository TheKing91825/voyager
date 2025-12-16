# Database Schema Analysis for Frontend

## 📊 Database Overview

Your Voyager app is a **comprehensive social travel planning platform** with collaborative trip planning, activity voting, and social features!

---

## 🗄️ Database Tables Summary

### ✅ Implemented Tables (Have Backend Routes)

1. **profiles** - User profiles with travel preferences
   - Routes: `GET /api/profile/me`, `PATCH /api/profile/me`
   
2. **posts** - Social media style posts
   - Routes: `GET /api/posts`, `POST /api/posts`
   - Supports: Pagination, profile joins
   
3. **trips** - Trip planning
   - Routes: `GET /api/trips`, `POST /api/trips`
   - Supports: Pagination

### ⚠️ Tables WITHOUT Backend Routes (Need Implementation)

4. **comments** - Post comments
   - Fields: `post_id`, `user_id`, `content`, `created_at`
   - Needed for: Social interaction on posts

5. **trip_members** - Collaborative trip members
   - Fields: `trip_id`, `user_id`, `role`, `joined_at`
   - Needed for: Group trip planning, permissions

6. **activities** - Trip activities/suggestions
   - Fields: `trip_id`, `name`, `description`, `category`, `latitude`, `longitude`, `image_url`, `source`
   - Needed for: Core trip planning feature
   - **Connected to AI route!** (AI generates these)

7. **group_swipes** - Tinder-style activity voting
   - Fields: `trip_id`, `user_id`, `activity_id`, `preference` (like/dislike/neutral)
   - Needed for: Democratic activity selection in groups
   - **Key feature!** Group decision making

8. **itinerary_items** - Scheduled itinerary
   - Fields: `trip_id`, `day`, `activity_id`, `start_time`, `end_time`, `notes`
   - Needed for: Final trip schedule/timeline

9. **reviews** - Activity reviews
   - Fields: `user_id`, `activity_id`, `rating` (1-5), `review_text`
   - Needed for: Post-trip feedback

10. **friends** - Friend connections
    - Fields: `requester_id`, `receiver_id`, `status` (pending/accepted/declined/blocked)
    - Needed for: Social features, inviting to trips

11. **visited_locations** - Location history
    - Fields: `user_id`, `city`, `country`, `latitude`, `longitude`, `visited_at`
    - Needed for: Travel history tracking, profile enhancement

12. **admins** - Admin users
    - Fields: `user_id`, `created_at`
    - Needed for: Admin dashboard

13. **admin_actions** - Admin audit log
    - Fields: `admin_user_id`, `action_type`, `target_table`, `target_id`, `details` (jsonb)
    - Needed for: Admin activity tracking

---

## 🎯 Application Flow (Based on Schema)

### User Journey:
1. **Sign up** → Creates profile with travel preferences
2. **Create trip** → Name, location, dates
3. **Invite friends** → Add trip members
4. **AI Suggestions** → Get activity suggestions (already implemented!)
5. **Group voting** → Members swipe on activities (Tinder-style)
6. **Build itinerary** → Schedule approved activities by day/time
7. **Share posts** → Post about trip experiences
8. **Leave reviews** → Rate activities after trip

### Key Features:
- **Social feed** with posts and comments
- **Collaborative trip planning** with voting
- **AI-powered recommendations**
- **Friend network**
- **Travel history tracking**

---

## 📋 TypeScript Types for Frontend

```typescript
// User & Profile
export interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  profile_image_url: string | null;
  budget_preference: string | null;
  travel_style: string | null;
  travel_pace: string | null;
  group_size: number | null;
  accommodation_preference: string | null;
  transportation_preferences: string[] | null;
  dietary_preferences: string[] | null;
  created_at: string;
}

// Posts
export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  profiles?: {
    username: string;
    profile_image_url: string;
  };
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

// Trips
export interface Trip {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  start_date: string; // ISO date string
  end_date: string;
  description: string | null;
  created_at: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: 'editor' | 'viewer' | string;
  joined_at: string;
  profiles?: Profile;
}

// Activities
export interface Activity {
  id: string;
  trip_id: string;
  name: string;
  description: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  source: string | null; // 'ai', 'manual', 'google', etc.
  created_at: string;
}

export interface GroupSwipe {
  id: string;
  trip_id: string;
  user_id: string;
  activity_id: string;
  preference: 'like' | 'dislike' | 'neutral';
  created_at: string;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  day: number;
  activity_id: string;
  start_time: string | null; // HH:MM format
  end_time: string | null;
  notes: string | null;
  created_at: string;
  activity?: Activity; // Joined data
}

export interface Review {
  id: string;
  user_id: string;
  activity_id: string;
  rating: number; // 1-5
  review_text: string | null;
  created_at: string;
  profiles?: Profile;
}

// Social
export interface Friend {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
}

export interface VisitedLocation {
  id: string;
  user_id: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  visited_at: string; // ISO date
  created_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AIExploreResponse {
  activities: {
    name: string;
    description: string;
    category: string;
    latitude?: number;
    longitude?: number;
  }[];
}
```

---

## 🚧 Missing Backend Routes (To Implement Eventually)

### High Priority (Core Features)
```javascript
// Trip Members
GET    /api/trips/:id/members       - Get trip members
POST   /api/trips/:id/members       - Add member to trip
DELETE /api/trips/:id/members/:userId - Remove member

// Activities
GET    /api/trips/:id/activities    - Get trip activities
POST   /api/trips/:id/activities    - Add activity manually
DELETE /api/activities/:id          - Delete activity

// Group Swipes (Voting)
GET    /api/trips/:id/swipes        - Get all swipes for trip
POST   /api/activities/:id/swipe    - Vote on activity
GET    /api/activities/:id/results  - Get voting results

// Itinerary
GET    /api/trips/:id/itinerary     - Get trip itinerary
POST   /api/trips/:id/itinerary     - Add item to itinerary
PATCH  /api/itinerary/:id           - Update itinerary item
DELETE /api/itinerary/:id           - Remove from itinerary

// Comments
GET    /api/posts/:id/comments      - Get post comments
POST   /api/posts/:id/comments      - Add comment
DELETE /api/comments/:id            - Delete comment
```

### Medium Priority (Social Features)
```javascript
// Friends
GET    /api/friends                 - Get friend list
POST   /api/friends/request         - Send friend request
PATCH  /api/friends/:id/accept      - Accept request
DELETE /api/friends/:id             - Remove friend/decline

// Reviews
GET    /api/activities/:id/reviews  - Get activity reviews
POST   /api/activities/:id/reviews  - Add review
GET    /api/profile/me/reviews      - Get my reviews

// Visited Locations
GET    /api/profile/me/visited      - Get visited locations
POST   /api/profile/me/visited      - Add visited location
DELETE /api/visited/:id             - Remove location
```

### Low Priority (Admin/Additional)
```javascript
// Posts - Additional
DELETE /api/posts/:id               - Delete post
PATCH  /api/posts/:id               - Edit post
GET    /api/posts/:id               - Get single post

// Trips - Additional  
PATCH  /api/trips/:id               - Update trip
DELETE /api/trips/:id               - Delete trip
GET    /api/trips/:id               - Get single trip details

// Profile - Additional
GET    /api/profile/:username       - Get user by username
GET    /api/profile/:id             - Get user by ID
```

---

## 🎨 Frontend Page Recommendations

Based on your schema, here are the pages you'll need:

### Public Pages
- `/` - Landing page
- `/login` - Login page
- `/signup` - Sign up page

### Protected Pages
- `/feed` - Social feed (posts)
- `/profile` - User profile settings
- `/profile/:username` - View other profiles
- `/friends` - Friend list and requests
- `/trips` - My trips list
- `/trips/new` - Create new trip
- `/trips/:id` - Trip detail page
- `/trips/:id/activities` - Activity suggestions
- `/trips/:id/vote` - Group voting (swipe UI)
- `/trips/:id/itinerary` - Final itinerary view
- `/explore` - Explore locations/activities
- `/history` - Visited locations

### Key Components You'll Need
- `PostCard` - Display post with comments
- `TripCard` - Trip preview card
- `ActivityCard` - Activity with voting buttons
- `SwipeableActivity` - Tinder-style swipe card
- `ItineraryDay` - Day-by-day schedule
- `FriendsList` - Friends and requests
- `MapView` - Show activities on map
- `ProfileEditor` - Edit profile preferences

---

## 🔄 Data Flow Example: Trip Planning

1. **Create Trip**
   ```
   POST /api/trips
   { name, location, start_date, end_date, description }
   ```

2. **Invite Friends**
   ```
   POST /api/trips/:id/members
   { user_id, role: 'editor' }
   ```

3. **Get AI Suggestions**
   ```
   POST /api/ai/explore
   { prompt: "romantic spots in Paris", numActivities: 10 }
   → Creates activities in database (need route!)
   ```

4. **Group Voting**
   ```
   POST /api/activities/:id/swipe
   { preference: 'like' }
   ```

5. **Check Results**
   ```
   GET /api/trips/:id/activities?voted=true
   → Shows activities with vote counts
   ```

6. **Build Itinerary**
   ```
   POST /api/trips/:id/itinerary
   { day: 1, activity_id, start_time: '10:00', end_time: '12:00' }
   ```

7. **View Schedule**
   ```
   GET /api/trips/:id/itinerary
   → Returns organized by day
   ```

---

## ⚡ Quick Start for Frontend

### What You Can Build Right Now (With Existing Routes):
1. ✅ **Authentication** - Supabase Auth
2. ✅ **Profile page** - View/edit profile
3. ✅ **Social feed** - View/create posts
4. ✅ **Trip list** - View/create trips
5. ✅ **AI suggestions** - Get activity ideas

### What Needs Backend Routes First:
- ❌ Comments on posts
- ❌ Trip collaboration (members)
- ❌ Activity management
- ❌ Group voting/swiping
- ❌ Itinerary building
- ❌ Friend system

---

## 🎯 Recommendation

**For MVP (Minimum Viable Product), focus on:**

1. **Auth flow** (Supabase handles this)
2. **Profile setup** (existing route)
3. **Trip creation** (existing route)
4. **AI suggestions** (existing route)
5. **Social feed** (existing route)

**Then add routes for:**
- Trip members
- Activities
- Basic itinerary

**Save for later:**
- Group voting/swiping
- Reviews
- Friend system
- Visited locations

This gives you a working app that you can iterate on!

---

## 📝 Notes

- Your backend is using **service role key** for database operations (correct!)
- Frontend should use **anon key** and pass **user JWT tokens**
- All user-specific queries should be filtered by `req.user.id` in backend
- Consider **Row Level Security (RLS)** policies in Supabase for additional security

---

**Next Step:** Start with Next.js frontend focusing on auth, profiles, and the social feed!
