import { useState, useEffect } from 'react'
import { ensureUser, createOrLoginUser, logoutUser } from '@/services/userService'

interface UserPanelProps {
  onUserChange: () => void
}

function UserPanel({ onUserChange }: UserPanelProps) {
  const [username, setUsername] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [inputUsername, setInputUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const user = await ensureUser()
    if (user) {
      setUsername(user.username)
    } else {
      setUsername(null)
    }
  }

  const handleLogin = async () => {
    if (!inputUsername.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await createOrLoginUser(inputUsername)
      if (user) {
        setUsername(user.username)
        setShowModal(false)
        setInputUsername('')
        onUserChange()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logoutUser()
    setUsername(null)
    onUserChange()
  }

  if (username) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <span className="text-white font-medium">👤 {username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg font-medium"
      >
        Sign In / Sign Up
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700 shadow-2xl transform transition-all">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Welcome!
            </h2>
            <p className="text-gray-400 mb-6">
              Enter a username to get started. If it's new, we'll create an account for you!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Choose a username"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Continue'}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
              <p className="text-xs text-blue-300">
                💡 <strong>Tip:</strong> Your username is saved locally. You can use the same username across devices!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserPanel
