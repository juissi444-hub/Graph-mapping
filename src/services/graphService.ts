import { supabase } from './supabase'
import { getCurrentUserId } from './userService'
import { Node, Edge } from '@xyflow/react'
import { GraphWithMetadata, SortBy, ConnectionType } from '@/types'
import { getGraphHash } from '@/utils/graphIsomorphism'

/**
 * Save graph to database
 */
export async function saveGraph(
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[]
): Promise<string | null> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('You must be logged in to save graphs')
  }

  const { data, error } = await supabase
    .from('graphs')
    .insert([
      {
        name,
        description,
        nodes: nodes,
        edges: edges,
        user_id: userId,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error saving graph:', error)
    throw new Error('Failed to save graph')
  }

  // Check for isomorphism and create group if needed
  await checkAndCreateIsomorphicGroup(data.id, nodes, edges)

  return data.id
}

/**
 * Check if graph is isomorphic to any existing graphs
 */
async function checkAndCreateIsomorphicGroup(
  graphId: string,
  nodes: Node[],
  edges: Edge[]
): Promise<void> {
  try {
    const hash = getGraphHash(
      nodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: { label: String(n.data.label || ''), description: String(n.data.description || '') },
      })),
      edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: (e.data?.connectionType || e.className || ConnectionType.CONNECTION) as ConnectionType,
      }))
    )

    // Check if group with this hash already exists
    const { data: existingGroup } = await supabase
      .from('isomorphic_groups')
      .select('*')
      .eq('graph_hash', hash)
      .single()

    let groupId: string

    if (existingGroup) {
      groupId = existingGroup.id
    } else {
      // Create new group
      const { data: newGroup } = await supabase
        .from('isomorphic_groups')
        .insert([{ graph_hash: hash }])
        .select()
        .single()

      groupId = newGroup!.id
    }

    // Link graph to group
    await supabase
      .from('graph_isomorphic_groups')
      .insert([{ graph_id: graphId, group_id: groupId }])
  } catch (error) {
    console.error('Error checking isomorphism:', error)
  }
}

/**
 * Get all graphs with sorting
 */
export async function getGraphs(sortBy: SortBy = SortBy.LATEST): Promise<GraphWithMetadata[]> {
  let query = supabase.from('graph_stats').select('*')

  switch (sortBy) {
    case SortBy.LATEST:
      query = query.order('created_at', { ascending: false })
      break
    case SortBy.BEST_RATED:
      query = query.order('average_rating', { ascending: false })
      break
    case SortBy.MOST_POPULAR:
      query = query.order('rating_count', { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching graphs:', error)
    return []
  }

  return (data || []).map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description || '',
    nodes: g.nodes,
    edges: g.edges,
    userId: g.user_id,
    authorUsername: g.username || 'Unknown',
    averageRating: g.average_rating || 0,
    ratingCount: g.rating_count || 0,
    createdAt: g.created_at,
    updatedAt: g.updated_at,
  }))
}

/**
 * Rate a graph
 */
export async function rateGraph(graphId: string, rating: number): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('You must be logged in to rate graphs')
  }

  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }

  // Upsert rating (insert or update if exists)
  const { error } = await supabase
    .from('ratings')
    .upsert(
      [
        {
          graph_id: graphId,
          user_id: userId,
          rating,
        },
      ],
      { onConflict: 'graph_id,user_id' }
    )

  if (error) {
    console.error('Error rating graph:', error)
    throw new Error('Failed to submit rating')
  }
}

/**
 * Get user's rating for a graph
 */
export async function getUserRating(graphId: string): Promise<number | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('graph_id', graphId)
    .eq('user_id', userId)
    .single()

  if (error || !data) return null

  return data.rating
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(50)

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  return data || []
}

/**
 * Delete a graph (only if owned by current user)
 */
export async function deleteGraph(graphId: string): Promise<void> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('You must be logged in')
  }

  // First check if user owns the graph
  const { data: graph } = await supabase
    .from('graphs')
    .select('user_id')
    .eq('id', graphId)
    .single()

  if (!graph || graph.user_id !== userId) {
    throw new Error('You can only delete your own graphs')
  }

  const { error } = await supabase.from('graphs').delete().eq('id', graphId)

  if (error) {
    console.error('Error deleting graph:', error)
    throw new Error('Failed to delete graph')
  }
}
