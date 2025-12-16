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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-4xl flex-shrink-0">
              👤
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile?.username || 'User'}
              </h1>
              <p className="text-zinc-400 mb-1">
                @{profile?.username || 'username'}
              </p>
              <p className="text-zinc-500 text-sm">
                {user?.email}
              </p>
            </div>

            <Link
              href="/preferences"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* About Section */}
        {profile?.bio && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">About</h2>
            <p className="text-zinc-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Interests Section */}
        {profile?.interests && profile.interests.trim() && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.split(',').map((interest, index) => (
                <span key={index} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm">
                  {interest.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Travel Preferences */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Travel Preferences</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-zinc-500 text-sm mb-1">Budget</div>
              <div className="text-white font-medium">
                {profile?.budget_preference || 'Not set'}
              </div>
            </div>

            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-zinc-500 text-sm mb-1">Travel Style</div>
              <div className="text-white font-medium">
                {profile?.travel_style || 'Not set'}
              </div>
            </div>

            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-zinc-500 text-sm mb-1">Accommodation</div>
              <div className="text-white font-medium">
                {profile?.accommodation_preference || 'Not set'}
              </div>
            </div>

            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-zinc-500 text-sm mb-1">Travel Pace</div>
              <div className="text-white font-medium">
                {profile?.travel_pace || 'Not set'}
              </div>
            </div>

            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-zinc-500 text-sm mb-1">Group Size</div>
              <div className="text-white font-medium">
                {profile?.group_size ? `${profile.group_size} people` : 'Not set'}
              </div>
            </div>

            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <div className="text-zinc-500 text-sm mb-1">Transportation</div>
              <div className="text-white font-medium">
                {profile?.transportation_preferences?.join(', ') || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
