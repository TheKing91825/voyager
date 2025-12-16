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
  const [interests, setInterests] = useState('');
  const [budgetPreference, setBudgetPreference] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [travelPace, setTravelPace] = useState('');
  const [groupSize, setGroupSize] = useState<number | ''>('');
  const [accommodationPreference, setAccommodationPreference] = useState('');
  const [transportationPreferences, setTransportationPreferences] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [otherDietary, setOtherDietary] = useState('');

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
        setInterests(data.interests || '');
        setBudgetPreference(data.budget_preference || '');
        setTravelStyle(data.travel_style || '');
        setTravelPace(data.travel_pace || '');
        setGroupSize(data.group_size || '');
        setAccommodationPreference(data.accommodation_preference || '');
        setTransportationPreferences(data.transportation_preferences || []);
        
        // Separate standard dietary prefs from "Other"
        const dietPrefs = data.dietary_preferences || [];
        const standard = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Pescatarian', 'Dairy-Free'];
        const standardPrefs = dietPrefs.filter((pref: string) => standard.includes(pref));
        const otherPrefs = dietPrefs.filter((pref: string) => !standard.includes(pref));
        
        setDietaryPreferences(standardPrefs);
        if (otherPrefs.length > 0) {
          setOtherDietary(otherPrefs.join(', '));
        }
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
      // Combine dietary preferences
      let allDietaryPrefs = [...dietaryPreferences];
      if (otherDietary.trim()) {
        allDietaryPrefs.push(otherDietary.trim());
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          bio,
          interests,
          budget_preference: budgetPreference,
          travel_style: travelStyle,
          travel_pace: travelPace,
          group_size: groupSize || null,
          accommodation_preference: accommodationPreference,
          transportation_preferences: transportationPreferences,
          dietary_preferences: allDietaryPrefs,
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">Manage your profile and travel preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Bio Section */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">About You</h2>
            <div>
              <label className="block text-zinc-300 font-medium mb-2 text-sm">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-zinc-500"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-zinc-500 mt-1.5">{bio.length}/500 characters</p>
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Interests</h2>
            <div>
              <label className="block text-zinc-300 font-medium mb-2 text-sm">
                What do you enjoy?
              </label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., Hiking, Museums, Food tours, Photography, Shopping"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-zinc-500"
                rows={3}
              />
              <p className="text-xs text-zinc-500 mt-1.5">Separate with commas</p>
            </div>
          </div>

          {/* Core Travel Preferences */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Travel Preferences</h2>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Budget */}
              <div>
                <label className="block text-zinc-300 font-medium mb-2 text-sm">
                  Budget
                </label>
                <select
                  value={budgetPreference}
                  onChange={(e) => setBudgetPreference(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
                <label className="block text-zinc-300 font-medium mb-2 text-sm">
                  Travel Style
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
                <label className="block text-zinc-300 font-medium mb-2 text-sm">
                  Travel Pace
                </label>
                <select
                  value={travelPace}
                  onChange={(e) => setTravelPace(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select pace</option>
                  <option value="Slow - Lots of relaxation">Slow - Lots of relaxation</option>
                  <option value="Moderate - Balanced">Moderate - Balanced</option>
                  <option value="Fast - Pack it all in">Fast - Pack it all in</option>
                </select>
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-zinc-300 font-medium mb-2 text-sm">
                  Group Size
                </label>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select size</option>
                  <option value="1">Solo</option>
                  <option value="2">Couple</option>
                  <option value="3">Small Group (3-5)</option>
                  <option value="6">Large Group (6+)</option>
                  <option value="0">Family</option>
                </select>
              </div>

              {/* Accommodation */}
              <div className="md:col-span-2">
                <label className="block text-zinc-300 font-medium mb-2 text-sm">
                  Accommodation
                </label>
                <select
                  value={accommodationPreference}
                  onChange={(e) => setAccommodationPreference(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select type</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Airbnb/Vacation Rental">Airbnb/Vacation Rental</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Resort">Resort</option>
                  <option value="Boutique Hotel">Boutique Hotel</option>
                  <option value="Camping">Camping</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transportation */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Transportation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Flight', 'Train', 'Car Rental', 'Public Transit', 'Walking', 'Biking', 'Rideshare'].map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={transportationPreferences.includes(option)}
                    onChange={() => handleTransportationToggle(option)}
                    className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-zinc-300 group-hover:text-white transition-colors text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Dietary Preferences</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Pescatarian', 'Dairy-Free'].map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dietaryPreferences.includes(option)}
                    onChange={() => handleDietaryToggle(option)}
                    className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-zinc-300 group-hover:text-white transition-colors text-sm">{option}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-2 text-sm">
                Other (specify)
              </label>
              <input
                type="text"
                value={otherDietary}
                onChange={(e) => setOtherDietary(e.target.value)}
                placeholder="e.g., Nut allergy, Shellfish allergy"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
