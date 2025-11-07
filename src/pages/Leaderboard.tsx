import { useState, useEffect } from 'react'
import { LeaderboardEntry } from '@/types'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch leaderboard from API
    setLoading(false)
    // Mock data for now
    setLeaderboard([])
  }, [])

  return (
    <div className="h-full overflow-auto bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Leaderboard</h1>

        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Graphs Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Avg Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    Loading leaderboard...
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No users yet. Create some graphs to get on the leaderboard!
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr key={entry.userId} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <span className="text-2xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{entry.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{entry.graphCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm text-gray-300">
                          {entry.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
