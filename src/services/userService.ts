import { supabase } from './supabase'

export interface User {
  id: string
  username: string
  email: string
}

/**
 * Sign up a new user with username, email, and password
 */
export async function signUp(username: string, email: string, password: string): Promise<User | null> {
  if (!username || username.trim().length === 0) {
    throw new Error('Username is required')
  }
  if (!email || email.trim().length === 0) {
    throw new Error('Email is required')
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const trimmedUsername = username.trim()
  const trimmedEmail = email.trim().toLowerCase()

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('username')
    .eq('username', trimmedUsername)
    .single()

  if (existingUser) {
    throw new Error('Username already taken')
  }

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: trimmedEmail,
    password: password,
    options: {
      data: {
        username: trimmedUsername,
      },
    },
  })

  if (authError) {
    console.error('Error signing up:', authError)
    throw new Error(authError.message || 'Failed to sign up')
  }

  if (!authData.user) {
    throw new Error('Failed to create user')
  }

  // Get the user profile that was created by the trigger
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (userProfile) {
    return userProfile as User
  }

  // If profile doesn't exist yet (trigger might be slow), return basic info
  return {
    id: authData.user.id,
    username: trimmedUsername,
    email: trimmedEmail,
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<User | null> {
  if (!email || email.trim().length === 0) {
    throw new Error('Email is required')
  }
  if (!password || password.length === 0) {
    throw new Error('Password is required')
  }

  const trimmedEmail = email.trim().toLowerCase()

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password: password,
  })

  if (authError) {
    console.error('Error signing in:', authError)
    throw new Error(authError.message || 'Failed to sign in')
  }

  if (!authData.user) {
    throw new Error('Failed to sign in')
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (userProfile) {
    return userProfile as User
  }

  return null
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw new Error('Failed to sign out')
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (userProfile) {
    return userProfile as User
  }

  return null
}

/**
 * Get current username
 */
export async function getCurrentUsername(): Promise<string | null> {
  const user = await getCurrentUser()
  return user ? user.username : null
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user ? user.id : null
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Legacy compatibility - kept for backward compatibility but now async
export function getCurrentUserId_sync(): string | null {
  // This is a temporary hack - components should be updated to use async version
  console.warn('getCurrentUserId_sync is deprecated, use async getCurrentUserId instead')
  return null
}
