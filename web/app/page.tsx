export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✈️</span>
              <h1 className="text-2xl font-bold text-blue-600">voyAIger</h1>
            </div>
            <div className="flex gap-4">
              <a
                href="/login"
                className="px-6 py-2 text-gray-800 hover:text-gray-600 font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Plan Your Perfect Trip
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">Together</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Collaborate with friends, get AI-powered suggestions, and create unforgettable travel experiences. Voyager makes trip planning social and fun.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a
              href="/signup"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Planning Free
            </a>
            <a
              href="#features"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold rounded-lg hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              Learn More
            </a>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AI-Powered Suggestions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get personalized activity recommendations powered by advanced AI to discover the best experiences.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Collaborative Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Vote on activities with your travel group using our fun swipe feature. Democracy made easy!
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Social Travel Feed
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your adventures, get inspired by friends, and build your travel community.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                🗺️
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Plan Together
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Create collaborative trips
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                💡
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Smart Itineraries
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                AI-optimized schedules
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                🌍
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Travel Social
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Share your adventures
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-20 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">✈️ Voyager - Your AI-Powered Travel Companion</p>
          <p className="text-sm">Made with ❤️ for travelers</p>
        </div>
      </footer>
    </div>
  );
}
