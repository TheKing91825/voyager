'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function PreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');
  
  // Form state
  const [bio, setBio] = useState('');
  const [budgetPreference, setBudgetPreference] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [travelPace, setTravelPace] = useState('');
  const [groupSize, setGroupSize] = useState<number | ''>('');
  const [accommodationPreference, setAccommodationPreference] = useState('');
  const [transportationPreferences, setTransportationPreferences] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
    fetchProfile(user.id);
  }

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setBio(data.bio || '');
        setBudgetPreference(data.budget_preference || '');
        setTravelStyle(data.travel_style || '');
        setTravelPace(data.travel_pace || '');
        setGroupSize(data.group_size || '');
        setAccommodationPreference(data.accommodation_preference || '');
        setTransportationPreferences(data.transportation_preferences || []);
        setDietaryPreferences(data.dietary_preferences || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bio,
          budget_preference: budgetPreference,
          travel_style: travelStyle,
          travel_pace: travelPace,
          group_size: groupSize || null,
          accommodation_preference: accommodationPreference,
          transportation_preferences: transportationPreferences,
          dietary_preferences: dietaryPreferences,
        })
        .eq('id', userId);

      if (error) throw error;

      router.push('/profile');
    } catch (error: any) {
      alert('Error saving preferences: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  const handleTransportationToggle = (option: string) => {
    setTransportationPreferences(prev =>
      prev.includes(option)
        ? prev.filter(t => t !== option)
        : [...prev, option]
    );
  };

  const handleDietaryToggle = (option: string) => {
    setDietaryPreferences(prev =>
      prev.includes(option)
        ? prev.filter(d => d !== option)
        : [...prev, option]
    );
  };

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
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile & Preferences</h1>

          {/* Bio Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bio</h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short bio about yourself"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900"
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-gray-600 mt-1">{bio.length}/500 characters</p>
          </div>

          {/* Core Travel Preferences */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Core Travel Preferences</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Budget Preference */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Budget Preference
                </label>
                <select
                  value={budgetPreference}
                  onChange={(e) => setBudgetPreference(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select budget</option>
                  <option value="Budget ($)">Budget ($)</option>
                  <option value="Moderate ($$)">Moderate ($$)</option>
                  <option value="Luxury ($$$)">Luxury ($$$)</option>
                  <option value="Ultra-Luxury ($$$$)">Ultra-Luxury ($$$$)</option>
                </select>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Travel Style
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select style</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Relaxation">Relaxation</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Foodie">Foodie</option>
                  <option value="Nature">Nature</option>
                  <option value="Urban">Urban</option>
                  <option value="Beach">Beach</option>
                </select>
              </div>

              {/* Travel Pace */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Travel Pace
                </label>
                <select
                  value={travelPace}
                  onChange={(e) => setTravelPace(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select pace</option>
                  <option value="Slow-Paced - Lots of relaxation">Slow-Paced - Lots of relaxation</option>
                  <option value="Moderate - Balanced mix">Moderate - Balanced mix</option>
                  <option value="Fast-Paced - Pack in as much as possible">Fast-Paced - Pack in as much as possible</option>
                </select>
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Group Size
                </label>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select group size</option>
                  <option value="1">Solo Traveler</option>
                  <option value="2">Couple</option>
                  <option value="3">Small Group (3-5)</option>
                  <option value="6">Large Group (6+)</option>
                  <option value="0">Family with Kids</option>
                </select>
              </div>
            </div>
          </div>

          {/* Accommodation & Transportation */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Accommodation & Transportation</h2>

            {/* Accommodation */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">
                Accommodation Preference
              </label>
              <select
                value={accommodationPreference}
                onChange={(e) => setAccommodationPreference(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              >
                <option value="">Select accommodation</option>
                <option value="Hotel">Hotel</option>
                <option value="Airbnb/Vacation Rental">Airbnb/Vacation Rental</option>
                <option value="Hostel">Hostel</option>
                <option value="Resort">Resort</option>
                <option value="Boutique Hotel">Boutique Hotel</option>
                <option value="Camping">Camping</option>
              </select>
            </div>

            {/* Transportation */}
            <div>
              <label className="block text-gray-900 font-semibold mb-3">
                Transportation Preferences (select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Flight', 'Train', 'Car Rental', 'Public Transit', 'Walking', 'Biking', 'Rideshare'].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={transportationPreferences.includes(option)}
                      onChange={() => handleTransportationToggle(option)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Dietary Preferences</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Pescatarian', 'Dairy-Free'].map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dietaryPreferences.includes(option)}
                    onChange={() => handleDietaryToggle(option)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
