import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import GraphBuilder from './pages/GraphBuilder'
import Browse from './pages/Browse'
import Leaderboard from './pages/Leaderboard'

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        {/* Navigation */}
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Graph Mapping
              </h1>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Builder
                </Link>
                <Link
                  to="/browse"
                  className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Browse
                </Link>
                <Link
                  to="/leaderboard"
                  className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Leaderboard
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<GraphBuilder />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
