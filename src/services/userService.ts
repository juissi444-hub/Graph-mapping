import { supabase } from './supabase'

const USERNAME_KEY = 'graph_mapping_username'
const USER_ID_KEY = 'graph_mapping_user_id'

export interface User {
  id: string
  username: string
  email: string
}

/**
 * Get or create user session
 */
export async function ensureUser(): Promise<User | null> {
  // Check if user already exists in localStorage
  const savedUsername = localStorage.getItem(USERNAME_KEY)
  const savedUserId = localStorage.getItem(USER_ID_KEY)

  if (savedUsername && savedUserId) {
    // Verify user exists in database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', savedUserId)
      .single()

    if (!error && data) {
      return data as User
    }
  }

  return null
}

/**
 * Create a new user or login
 */
export async function createOrLoginUser(username: string): Promise<User | null> {
  if (!username || username.trim().length === 0) {
    throw new Error('Username is required')
  }

  const trimmedUsername = username.trim()

  // Check if username already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('username', trimmedUsername)
    .single()

  if (!checkError && existingUser) {
    // User exists, login
    localStorage.setItem(USERNAME_KEY, existingUser.username)
    localStorage.setItem(USER_ID_KEY, existingUser.id)
    return existingUser as User
  }

  // Create new user
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert([
      {
        username: trimmedUsername,
        email: `${trimmedUsername}@graphmapping.local`,
      },
    ])
    .select()
    .single()

  if (createError) {
    console.error('Error creating user:', createError)
    throw new Error('Failed to create user')
  }

  // Save to localStorage
  localStorage.setItem(USERNAME_KEY, newUser.username)
  localStorage.setItem(USER_ID_KEY, newUser.id)

  return newUser as User
}

/**
 * Logout current user
 */
export function logoutUser(): void {
  localStorage.removeItem(USERNAME_KEY)
  localStorage.removeItem(USER_ID_KEY)
}

/**
 * Get current username
 */
export function getCurrentUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY)
}

/**
 * Get current user ID
 */
export function getCurrentUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY)
}
