// Database Types
export interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  profile_image_url: string | null;
  interests: string | null;
  budget_preference: string | null;
  travel_style: string | null;
  travel_pace: string | null;
  group_size: number | null;
  accommodation_preference: string | null;
  transportation_preferences: string[] | null;
  dietary_preferences: string[] | null;
  created_at: string;
}

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

export interface Trip {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at: string;
  profiles?: {
    username: string;
    profile_image_url: string;
  };
}

export interface Activity {
  id: string;
  trip_id: string;
  name: string;
  description: string | null;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  source: string | null;
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

export interface APIError {
  error: string;
  details?: any;
}
