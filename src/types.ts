/**
 * Connection types for edges
 */
export enum ConnectionType {
  OPPOSITE = 'opposite',
  CONNECTION = 'connection',
  LINEAR = 'linear',
}

/**
 * Sort options for browsing graphs
 */
export enum SortBy {
  LATEST = 'latest',
  BEST_RATED = 'best_rated',
  MOST_POPULAR = 'most_popular',
}

/**
 * Graph with metadata from database
 */
export interface GraphWithMetadata {
  id: string
  name: string
  description: string
  nodes: any
  edges: any
  userId: string
  authorUsername: string
  averageRating: number
  ratingCount: number
  createdAt: string
  updatedAt: string
  isIsomorphic?: boolean
}

/**
 * Simplified node structure for isomorphism checking
 */
export interface GraphNode {
  id: string
  position: {
    x: number
    y: number
  }
  data: {
    label: string
    description: string
  }
}

/**
 * Simplified edge structure for isomorphism checking
 */
export interface GraphEdge {
  id: string
  source: string
  target: string
  type: ConnectionType
}
