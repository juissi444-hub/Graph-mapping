import { useState, useEffect } from 'react'
import { SortBy, GraphWithMetadata } from '@/types'
import GraphCard from '@/components/GraphCard'

function Browse() {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.BEST_RATED)
  const [graphs, setGraphs] = useState<GraphWithMetadata[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch graphs from API
    setLoading(false)
    // Mock data for now
    setGraphs([])
  }, [sortBy])

  return (
    <div className="h-full overflow-auto bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Browse Graphs</h1>

          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy(SortBy.BEST_RATED)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === SortBy.BEST_RATED
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Best Rated
            </button>
            <button
              onClick={() => setSortBy(SortBy.LATEST)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === SortBy.LATEST
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy(SortBy.MOST_POPULAR)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === SortBy.MOST_POPULAR
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Most Popular
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading graphs...</div>
        ) : graphs.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl mb-2">No graphs found</p>
            <p>Be the first to create and share a graph!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {graphs.map((graph) => (
              <GraphCard key={graph.id} graph={graph} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse
