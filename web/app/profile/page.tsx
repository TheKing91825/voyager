'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import type { Profile } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    fetchProfile(user.id);
  }

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-6xl mb-4">
              👤
            </div>
            
            {/* Name and Username */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile?.username || 'User'}
            </h1>
            <p className="text-gray-700 text-lg mb-2">
              @{profile?.username || 'username'}
            </p>
            <p className="text-gray-600 flex items-center">
              {user?.email}
            </p>
          </div>

          {/* About Me Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About Me
            </h2>
            <p className="text-gray-700 text-lg">
              {profile?.bio || 'No bio yet. Click Edit to add one!'}
            </p>
          </div>

          {/* Travel Preferences Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Travel Preferences
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Budget */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">Budget</h3>
                <p className="text-gray-700">
                  {profile?.budget_preference || 'Not set'}
                </p>
              </div>

              {/* Travel Style */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">Travel Style</h3>
                <p className="text-gray-700">
                  {profile?.travel_style || 'Not set'}
                </p>
              </div>

              {/* Accommodation */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">Accommodation</h3>
                <p className="text-gray-700">
                  {profile?.accommodation_preference || 'Not set'}
                </p>
              </div>

              {/* Transportation */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">Transportation</h3>
                <p className="text-gray-700">
                  {profile?.transportation_preferences?.join(', ') || 'Not set'}
                </p>
              </div>

              {/* Travel Pace */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">Travel Pace</h3>
                <p className="text-gray-700">
                  {profile?.travel_pace || 'Not set'}
                </p>
              </div>

              {/* Group Size */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">Group Size</h3>
                <p className="text-gray-700">
                  {profile?.group_size ? `${profile.group_size} people` : 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-center">
            <Link
              href="/preferences"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Edit Profile & Preferences
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
