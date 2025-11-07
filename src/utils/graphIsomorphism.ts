import { GraphNode, GraphEdge, ConnectionType } from '@/types'

interface AdjacencyMap {
  [nodeId: string]: {
    [targetId: string]: ConnectionType
  }
}

interface NodeSignature {
  degree: number
  edgeTypeCount: {
    [key in ConnectionType]: number
  }
}

/**
 * Build adjacency map from edges
 */
function buildAdjacencyMap(edges: GraphEdge[]): AdjacencyMap {
  const adj: AdjacencyMap = {}

  for (const edge of edges) {
    if (!adj[edge.source]) adj[edge.source] = {}
    if (!adj[edge.target]) adj[edge.target] = {}

    adj[edge.source][edge.target] = edge.type
    adj[edge.target][edge.source] = edge.type // undirected graph
  }

  return adj
}

/**
 * Calculate signature for a node (degree and edge type distribution)
 */
function getNodeSignature(nodeId: string, adj: AdjacencyMap): NodeSignature {
  const neighbors = adj[nodeId] || {}
  const edgeTypeCount = {
    [ConnectionType.OPPOSITE]: 0,
    [ConnectionType.CONNECTION]: 0,
    [ConnectionType.LINEAR]: 0,
  }

  Object.values(neighbors).forEach((type) => {
    edgeTypeCount[type]++
  })

  return {
    degree: Object.keys(neighbors).length,
    edgeTypeCount,
  }
}

/**
 * Check if two node signatures match
 */
function signaturesMatch(sig1: NodeSignature, sig2: NodeSignature): boolean {
  if (sig1.degree !== sig2.degree) return false

  for (const type of Object.values(ConnectionType)) {
    if (sig1.edgeTypeCount[type] !== sig2.edgeTypeCount[type]) {
      return false
    }
  }

  return true
}

/**
 * Check if a mapping is valid by verifying all edges match
 */
function isValidMapping(
  _nodes1: GraphNode[],
  edges1: GraphEdge[],
  _nodes2: GraphNode[],
  edges2: GraphEdge[],
  mapping: Map<string, string>
): boolean {
  const adj2 = buildAdjacencyMap(edges2)

  // Check all edges in graph 1
  for (const edge of edges1) {
    const mappedSource = mapping.get(edge.source)
    const mappedTarget = mapping.get(edge.target)

    if (!mappedSource || !mappedTarget) return false

    // Check if corresponding edge exists in graph 2 with same type
    const adj2Source = adj2[mappedSource]
    if (!adj2Source || adj2Source[mappedTarget] !== edge.type) {
      return false
    }
  }

  return true
}

/**
 * Recursive backtracking to find isomorphism
 */
function findIsomorphismRecursive(
  nodes1: GraphNode[],
  edges1: GraphEdge[],
  nodes2: GraphNode[],
  edges2: GraphEdge[],
  adj1: AdjacencyMap,
  adj2: AdjacencyMap,
  signatures1: Map<string, NodeSignature>,
  signatures2: Map<string, NodeSignature>,
  mapping: Map<string, string>,
  unmapped1: Set<string>,
  unmapped2: Set<string>
): boolean {
  // All nodes mapped successfully
  if (unmapped1.size === 0) {
    return isValidMapping(nodes1, edges1, nodes2, edges2, mapping)
  }

  // Pick next unmapped node from graph 1
  const node1Id = Array.from(unmapped1)[0]
  const sig1 = signatures1.get(node1Id)!

  // Try mapping to each unmapped node in graph 2 with matching signature
  for (const node2Id of unmapped2) {
    const sig2 = signatures2.get(node2Id)!

    if (!signaturesMatch(sig1, sig2)) continue

    // Try this mapping
    mapping.set(node1Id, node2Id)
    unmapped1.delete(node1Id)
    unmapped2.delete(node2Id)

    // Check if this partial mapping is valid
    let validPartial = true
    for (const [mapped1, mapped2] of mapping.entries()) {
      const neighbors1 = adj1[mapped1] || {}
      const neighbors2 = adj2[mapped2] || {}

      for (const [neighbor1, edgeType] of Object.entries(neighbors1)) {
        const mappedNeighbor = mapping.get(neighbor1)
        if (mappedNeighbor) {
          // Both nodes are mapped, verify edge matches
          if (neighbors2[mappedNeighbor] !== edgeType) {
            validPartial = false
            break
          }
        }
      }
      if (!validPartial) break
    }

    if (validPartial) {
      // Recurse
      if (findIsomorphismRecursive(
        nodes1, edges1, nodes2, edges2,
        adj1, adj2,
        signatures1, signatures2,
        mapping, unmapped1, unmapped2
      )) {
        return true
      }
    }

    // Backtrack
    mapping.delete(node1Id)
    unmapped1.add(node1Id)
    unmapped2.add(node2Id)
  }

  return false
}

/**
 * Check if two graphs are isomorphic
 * This considers the three different edge types (opposite, connection, linear)
 */
export function areGraphsIsomorphic(
  nodes1: GraphNode[],
  edges1: GraphEdge[],
  nodes2: GraphNode[],
  edges2: GraphEdge[]
): boolean {
  // Quick checks
  if (nodes1.length !== nodes2.length) return false
  if (edges1.length !== edges2.length) return false
  if (nodes1.length === 0) return true

  // Build adjacency maps
  const adj1 = buildAdjacencyMap(edges1)
  const adj2 = buildAdjacencyMap(edges2)

  // Calculate signatures for all nodes
  const signatures1 = new Map<string, NodeSignature>()
  const signatures2 = new Map<string, NodeSignature>()

  for (const node of nodes1) {
    signatures1.set(node.id, getNodeSignature(node.id, adj1))
  }

  for (const node of nodes2) {
    signatures2.set(node.id, getNodeSignature(node.id, adj2))
  }

  // Check if signature distributions match
  const sigStrings1 = Array.from(signatures1.values())
    .map(s => JSON.stringify(s))
    .sort()
  const sigStrings2 = Array.from(signatures2.values())
    .map(s => JSON.stringify(s))
    .sort()

  if (JSON.stringify(sigStrings1) !== JSON.stringify(sigStrings2)) {
    return false
  }

  // Try to find isomorphism using backtracking
  const mapping = new Map<string, string>()
  const unmapped1 = new Set(nodes1.map(n => n.id))
  const unmapped2 = new Set(nodes2.map(n => n.id))

  return findIsomorphismRecursive(
    nodes1, edges1, nodes2, edges2,
    adj1, adj2,
    signatures1, signatures2,
    mapping, unmapped1, unmapped2
  )
}

/**
 * Generate a canonical hash for a graph structure
 * Useful for quick comparison before full isomorphism check
 */
export function getGraphHash(nodes: GraphNode[], edges: GraphEdge[]): string {
  const edgeTypeCounts = {
    [ConnectionType.OPPOSITE]: 0,
    [ConnectionType.CONNECTION]: 0,
    [ConnectionType.LINEAR]: 0,
  }

  edges.forEach(edge => {
    edgeTypeCounts[edge.type]++
  })

  return `n${nodes.length}_e${edges.length}_op${edgeTypeCounts[ConnectionType.OPPOSITE]}_cn${edgeTypeCounts[ConnectionType.CONNECTION]}_ln${edgeTypeCounts[ConnectionType.LINEAR]}`
}
