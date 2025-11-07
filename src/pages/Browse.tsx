import { useState, useEffect } from 'react'
import { SortBy, GraphWithMetadata } from '@/types'
import { getGraphs } from '@/services/graphService'
import GraphCard from '@/components/GraphCard'

function Browse() {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.BEST_RATED)
  const [graphs, setGraphs] = useState<GraphWithMetadata[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGraphs()
  }, [sortBy])

  const loadGraphs = async () => {
    setLoading(true)
    try {
      const data = await getGraphs(sortBy)
      setGraphs(data)
    } catch (error) {
      console.error('Error loading graphs:', error)
      setGraphs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
              Browse Graphs
            </h1>
            <p className="text-gray-400">Discover amazing graphs created by the community</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy(SortBy.BEST_RATED)}
              className={`px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg ${
                sortBy === SortBy.BEST_RATED
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800 bg-opacity-80 backdrop-blur-md text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              ⭐ Best Rated
            </button>
            <button
              onClick={() => setSortBy(SortBy.LATEST)}
              className={`px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg ${
                sortBy === SortBy.LATEST
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800 bg-opacity-80 backdrop-blur-md text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              🕐 Latest
            </button>
            <button
              onClick={() => setSortBy(SortBy.MOST_POPULAR)}
              className={`px-6 py-2.5 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg ${
                sortBy === SortBy.MOST_POPULAR
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800 bg-opacity-80 backdrop-blur-md text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              🔥 Popular
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-400 text-lg">Loading graphs...</p>
          </div>
        ) : graphs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📊</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Graphs Yet</h2>
            <p className="text-gray-400 text-lg mb-8">
              Be the first to create and share a graph with the community!
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              🎨 Create Your First Graph
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {graphs.map((graph) => (
              <GraphCard key={graph.id} graph={graph} onUpdate={loadGraphs} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse
