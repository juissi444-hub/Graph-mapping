import { useState, useEffect } from 'react'
import { getCurrentUser, signIn, signUp, signOut } from '@/services/userService'

interface UserPanelProps {
  onUserChange: () => void
}

function UserPanel({ onUserChange }: UserPanelProps) {
  const [username, setUsername] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  // Form fields
  const [inputUsername, setInputUsername] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [inputConfirmPassword, setInputConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const user = await getCurrentUser()
    if (user) {
      setUsername(user.username)
    } else {
      setUsername(null)
    }
  }

  const resetForm = () => {
    setInputUsername('')
    setInputEmail('')
    setInputPassword('')
    setInputConfirmPassword('')
    setError('')
  }

  const handleSignIn = async () => {
    if (!inputEmail.trim()) {
      setError('Please enter your email')
      return
    }
    if (!inputPassword) {
      setError('Please enter your password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await signIn(inputEmail, inputPassword)
      if (user) {
        setUsername(user.username)
        setShowModal(false)
        resetForm()
        onUserChange()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!inputUsername.trim()) {
      setError('Please enter a username')
      return
    }
    if (!inputEmail.trim()) {
      setError('Please enter your email')
      return
    }
    if (!inputPassword) {
      setError('Please enter a password')
      return
    }
    if (inputPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (inputPassword !== inputConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await signUp(inputUsername, inputEmail, inputPassword)
      if (user) {
        setUsername(user.username)
        setShowModal(false)
        resetForm()
        onUserChange()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      setUsername(null)
      onUserChange()
    } catch (err: any) {
      console.error('Logout error:', err)
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    resetForm()
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
              {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-400 mb-6">
              {mode === 'signin'
                ? 'Sign in to continue building amazing graphs'
                : 'Join our community and start creating graphs!'}
            </p>

            <div className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Choose a unique username"
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="your@email.com"
                  autoFocus={mode === 'signin'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (mode === 'signin' ? handleSignIn() : inputPassword === inputConfirmPassword && handleSignUp())
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder={mode === 'signin' ? 'Your password' : 'At least 6 characters'}
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={inputConfirmPassword}
                    onChange={(e) => setInputConfirmPassword(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && inputPassword === inputConfirmPassword && handleSignUp()
                    }
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={switchMode}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  disabled={loading}
                >
                  {mode === 'signin'
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
              <p className="text-xs text-blue-300">
                💡 <strong>Tip:</strong> Your session is securely stored and synced with Supabase!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserPanel
