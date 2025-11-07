import { useState, useEffect } from 'react'
import { Node, Edge } from '@xyflow/react'
import { supabase } from '@/services/supabase'
import { areGraphsIsomorphic } from '@/utils/graphIsomorphism'
import { GraphNode, GraphEdge } from '@/types'

interface IsomorphicGraphsModalProps {
  isOpen: boolean
  onClose: () => void
  currentNodes: Node[]
  currentEdges: Edge[]
}

interface StoredGraph {
  id: string
  name: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  username: string
}

function IsomorphicGraphsModal({
  isOpen,
  onClose,
  currentNodes,
  currentEdges,
}: IsomorphicGraphsModalProps) {
  const [isomorphicGraphs, setIsomorphicGraphs] = useState<StoredGraph[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const findIsomorphicGraphs = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch all graphs from the database
        const { data: graphs, error: fetchError } = await supabase
          .from('graph_stats')
          .select('*')

        if (fetchError) throw fetchError

        if (!graphs || graphs.length === 0) {
          setIsomorphicGraphs([])
          setLoading(false)
          return
        }

        // Convert current graph to the format expected by isomorphism algorithm
        const currentGraphNodes: GraphNode[] = currentNodes.map((node) => ({
          id: node.id,
          position: node.position,
          data: {
            label: String(node.data.label || ''),
            description: String(node.data.description || ''),
          },
        }))

        const currentGraphEdges: GraphEdge[] = currentEdges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: (edge.data?.connectionType || edge.className || 'connection') as any,
        }))

        // Check each graph for isomorphism
        const matches: StoredGraph[] = []
        for (const graph of graphs) {
          const storedNodes = graph.nodes as GraphNode[]
          const storedEdges = graph.edges as GraphEdge[]

          if (areGraphsIsomorphic(currentGraphNodes, currentGraphEdges, storedNodes, storedEdges)) {
            matches.push({
              id: graph.id,
              name: graph.name,
              nodes: storedNodes,
              edges: storedEdges,
              username: graph.username || 'Unknown',
            })
          }
        }

        setIsomorphicGraphs(matches)
      } catch (err) {
        console.error('Error finding isomorphic graphs:', err)
        setError('Failed to search for isomorphic graphs. Make sure the database is set up.')
      } finally {
        setLoading(false)
      }
    }

    findIsomorphicGraphs()
  }, [isOpen, currentNodes, currentEdges])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Isomorphic Graphs</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Searching for isomorphic graphs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400 text-sm">
              Make sure you've set up the Supabase database with the provided schema.
            </p>
          </div>
        ) : isomorphicGraphs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl mb-2">No isomorphic graphs found</p>
            <p className="text-sm">
              Your graph structure is unique! Be the first to share it with the community.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300 mb-4">
              Found <span className="font-bold text-green-400">{isomorphicGraphs.length}</span>{' '}
              graph(s) with the same structure as yours:
            </p>
            {isomorphicGraphs.map((graph) => (
              <div
                key={graph.id}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{graph.name}</h3>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                    Isomorphic
                  </span>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Created by: <span className="text-blue-400">{graph.username}</span></p>
                  <p>
                    Structure: {graph.nodes.length} nodes, {graph.edges.length} edges
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h3 className="text-sm font-semibold text-white mb-2">What are Isomorphic Graphs?</h3>
          <p className="text-xs text-gray-400">
            Two graphs are isomorphic if they have the same structure - the same number of nodes and edges
            with identical connection patterns, even if the nodes are positioned differently or labeled differently.
            This tool respects the three connection types (Opposite, Connection, Linear) when checking for isomorphism.
          </p>
        </div>
      </div>
    </div>
  )
}

export default IsomorphicGraphsModal
