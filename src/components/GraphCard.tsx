import { GraphWithMetadata } from '@/types'

interface GraphCardProps {
  graph: GraphWithMetadata
}

function GraphCard({ graph }: GraphCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{graph.name}</h3>
        {graph.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{graph.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>by {graph.authorUsername}</span>
          <span>
            {graph.nodes.length} nodes, {graph.edges.length} edges
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-white font-medium">
              {graph.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-400">({graph.ratingCount})</span>
          </div>

          {graph.isIsomorphic && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
              Isomorphic Group
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-750 border-t border-gray-700 flex space-x-2">
        <button className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
          View
        </button>
        <button className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
          Import
        </button>
      </div>
    </div>
  )
}

export default GraphCard
