import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import GraphBuilder from './pages/GraphBuilder'
import Browse from './pages/Browse'
import Leaderboard from './pages/Leaderboard'
import UserPanel from './components/UserPanel'

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`px-6 py-2 rounded-lg transition-all transform hover:scale-105 font-medium ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  )
}

function AppContent() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserChange = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 bg-opacity-80 backdrop-blur-md border-b border-gray-700 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              🗺️ Graph Mapping
            </h1>
            <div className="flex space-x-2">
              <NavLink to="/">🎨 Builder</NavLink>
              <NavLink to="/browse">🔍 Browse</NavLink>
              <NavLink to="/leaderboard">🏆 Leaderboard</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserPanel onUserChange={handleUserChange} />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<GraphBuilder key={refreshKey} />} />
          <Route path="/browse" element={<Browse key={refreshKey} />} />
          <Route path="/leaderboard" element={<Leaderboard key={refreshKey} />} />
        </Routes>
      </main>

      {/* Footer with gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
