-- This SQL schema should be run in your Supabase SQL editor
-- It creates all necessary tables for the Graph Mapping application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (can also use Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Graphs table
CREATE TABLE IF NOT EXISTS graphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_id UUID REFERENCES graphs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(graph_id, user_id)
);

-- Isomorphic groups table (for tracking which graphs are isomorphic)
CREATE TABLE IF NOT EXISTS isomorphic_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  graph_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Graph to isomorphic group mapping
CREATE TABLE IF NOT EXISTS graph_isomorphic_groups (
  graph_id UUID REFERENCES graphs(id) ON DELETE CASCADE,
  group_id UUID REFERENCES isomorphic_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (graph_id, group_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_graphs_user_id ON graphs(user_id);
CREATE INDEX IF NOT EXISTS idx_graphs_created_at ON graphs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_graph_id ON ratings(graph_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_isomorphic_groups_hash ON isomorphic_groups(graph_hash);

-- View for graph statistics
CREATE OR REPLACE VIEW graph_stats AS
SELECT
  g.id,
  g.name,
  g.description,
  g.nodes,
  g.edges,
  g.user_id,
  u.username,
  g.created_at,
  g.updated_at,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COUNT(DISTINCT r.id) as rating_count
FROM graphs g
LEFT JOIN users u ON g.user_id = u.id
LEFT JOIN ratings r ON g.id = r.graph_id
GROUP BY g.id, u.username;

-- View for leaderboard
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.id as user_id,
  u.username,
  COUNT(DISTINCT g.id) as graph_count,
  COALESCE(AVG(r.rating), 0) as average_rating
FROM users u
LEFT JOIN graphs g ON u.id = g.user_id
LEFT JOIN ratings r ON g.id = r.graph_id
GROUP BY u.id, u.username
ORDER BY graph_count DESC, average_rating DESC;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_graphs_updated_at BEFORE UPDATE ON graphs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Users can read all users
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Graphs are viewable by everyone
CREATE POLICY "Graphs are viewable by everyone" ON graphs
  FOR SELECT USING (true);

-- Users can insert their own graphs
CREATE POLICY "Users can insert own graphs" ON graphs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own graphs
CREATE POLICY "Users can update own graphs" ON graphs
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own graphs
CREATE POLICY "Users can delete own graphs" ON graphs
  FOR DELETE USING (auth.uid() = user_id);

-- Ratings are viewable by everyone
CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);

-- Users can insert their own ratings
CREATE POLICY "Users can insert own ratings" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings" ON ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings" ON ratings
  FOR DELETE USING (auth.uid() = user_id);
