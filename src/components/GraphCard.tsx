import { useState } from 'react'
import { GraphWithMetadata } from '@/types'
import { rateGraph } from '@/services/graphService'
import { getCurrentUsername } from '@/services/userService'

interface GraphCardProps {
  graph: GraphWithMetadata
  onUpdate?: () => void
}

function GraphCard({ graph, onUpdate }: GraphCardProps) {
  const [showRating, setShowRating] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleRate = async (rating: number) => {
    const username = getCurrentUsername()
    if (!username) {
      alert('Please sign in to rate graphs!')
      return
    }

    setSubmitting(true)
    try {
      await rateGraph(graph.id, rating)
      setUserRating(rating)
      setShowRating(false)
      if (onUpdate) onUpdate()
      alert(`Rated ${rating} stars! ⭐`)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImport = () => {
    const graphData = {
      name: graph.name + ' (Copy)',
      description: graph.description,
      nodes: graph.nodes,
      edges: graph.edges,
    }
    const dataStr = JSON.stringify(graphData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${graph.name.replace(/\s+/g, '-').toLowerCase()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-xl border border-gray-700 hover:border-blue-500 transition-all overflow-hidden shadow-xl transform hover:scale-105">
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          {graph.name}
        </h3>
        {graph.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{graph.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <span className="flex items-center space-x-1">
            <span>👤</span>
            <span className="text-blue-400 font-medium">{graph.authorUsername}</span>
          </span>
          <span className="text-gray-500">
            {graph.nodes.length} nodes • {graph.edges.length} edges
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= Math.round(graph.averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-white font-bold ml-2">
              {graph.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-400 text-xs">({graph.ratingCount})</span>
          </div>

          {graph.isIsomorphic && (
            <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-medium">
              🔗 Isomorphic
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-900 bg-opacity-50 border-t border-gray-700 flex space-x-2">
        <button
          onClick={() => setShowRating(!showRating)}
          disabled={submitting}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg text-sm transition-all transform hover:scale-105 font-medium shadow-lg disabled:opacity-50"
        >
          ⭐ Rate
        </button>
        <button
          onClick={handleImport}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm transition-all transform hover:scale-105 font-medium shadow-lg"
        >
          📥 Import
        </button>
      </div>

      {showRating && (
        <div className="px-5 py-4 bg-gray-900 bg-opacity-70 border-t border-gray-700">
          <p className="text-sm text-gray-300 mb-3 text-center">Rate this graph:</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                disabled={submitting}
                className="text-3xl hover:scale-125 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={userRating && star <= userRating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GraphCard
