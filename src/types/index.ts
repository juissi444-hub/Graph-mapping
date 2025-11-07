// Connection types for edges
export enum ConnectionType {
  OPPOSITE = 'opposite',
  CONNECTION = 'connection',
  LINEAR = 'linear',
}

// Node data structure
export interface GraphNode {
  id: string
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
  }
  type?: string
}

// Edge data structure with connection type
export interface GraphEdge {
  id: string
  source: string
  target: string
  type: ConnectionType
  animated?: boolean
}

// Complete graph structure
export interface Graph {
  id: string
  name: string
  description?: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  userId: string
  createdAt: string
  updatedAt: string
}

// User data
export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

// Graph rating
export interface GraphRating {
  id: string
  graphId: string
  userId: string
  rating: number // 1-5
  createdAt: string
}

// Leaderboard entry
export interface LeaderboardEntry {
  userId: string
  username: string
  graphCount: number
  averageRating: number
}

// Graph with additional metadata for display
export interface GraphWithMetadata extends Graph {
  authorUsername: string
  averageRating: number
  ratingCount: number
  isIsomorphic?: boolean
  isomorphicGroupId?: string
}

// Sort options for browsing
export enum SortBy {
  LATEST = 'latest',
  BEST_RATED = 'best_rated',
  MOST_POPULAR = 'most_popular',
}
