export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <h1 className="text-xl font-semibold text-white">voyAIger</h1>
            </div>
            <div className="flex gap-3">
              <a
                href="/login"
                className="px-5 py-2 text-zinc-300 hover:text-white font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Plan trips that
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                matter
              </span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Collaborative trip planning powered by AI. Vote on activities, build itineraries, and travel with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-lg transition-all"
              >
                Start Planning
              </a>
              <a
                href="#features"
                className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white text-lg font-semibold rounded-lg transition-all border border-zinc-800"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-6 mt-32">
            <div className="p-8 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                AI-Powered Suggestions
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Get personalized recommendations for activities, restaurants, and experiences based on your preferences.
              </p>
            </div>

            <div className="p-8 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Collaborate Seamlessly
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Vote on activities with your group. Everyone gets a say in building the perfect itinerary.
              </p>
            </div>

            <div className="p-8 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Social Travel
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Share your adventures, discover new destinations, and connect with fellow travelers.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-32 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">Collaborative</div>
              <div className="text-zinc-500">Plan together effortlessly</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Intelligent</div>
              <div className="text-zinc-500">AI-optimized itineraries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Connected</div>
              <div className="text-zinc-500">Share your journey</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-32 border-t border-zinc-800">
        <div className="text-center text-zinc-500">
          <p>voyAIger • Your AI-Powered Travel Companion</p>
        </div>
      </footer>
    </div>
  );
}
