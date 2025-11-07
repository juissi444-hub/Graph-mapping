import { useState, useEffect } from 'react'
import { getLeaderboard } from '@/services/graphService'

interface LeaderboardEntry {
  userId: string
  username: string
  graphCount: number
  averageRating: number
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const data = await getLeaderboard()
      setLeaderboard(data as LeaderboardEntry[])
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400">Top contributors and graph creators</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mb-4"></div>
            <p className="text-gray-400 text-lg">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Rankings Yet</h2>
            <p className="text-gray-400 text-lg mb-8">
              Create graphs and get rated to appear on the leaderboard!
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              🎨 Start Creating
            </a>
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-yellow-600 to-orange-600">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Graphs Created
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">
                      Avg Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className="hover:bg-gray-700 hover:bg-opacity-50 transition-colors"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && (
                            <span className="text-5xl">🥇</span>
                          )}
                          {index === 1 && (
                            <span className="text-5xl">🥈</span>
                          )}
                          {index === 2 && (
                            <span className="text-5xl">🥉</span>
                          )}
                          {index > 2 && (
                            <span className="text-2xl font-bold text-gray-400 ml-3">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">
                              {entry.username}
                            </div>
                            {index < 3 && (
                              <div className="text-xs text-yellow-400">
                                ⭐ Top Contributor
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 bg-opacity-20 rounded-full border border-blue-500">
                          <span className="text-2xl">📊</span>
                          <span className="text-xl font-bold text-blue-400">
                            {entry.graphCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 bg-opacity-20 rounded-full border border-yellow-500">
                          <span className="text-2xl">⭐</span>
                          <span className="text-xl font-bold text-yellow-400">
                            {entry.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && leaderboard.length > 0 && (
          <div className="mt-8 p-6 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">📈 How Rankings Work</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Rankings are based on total graphs created and average rating</li>
              <li>• Create more graphs to climb the leaderboard</li>
              <li>• Higher-rated graphs boost your position</li>
              <li>• Updated in real-time as new graphs are added</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
