# Setup Guide

This guide will walk you through setting up the Graph Mapping platform from scratch.

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - Project name: `graph-mapping`
   - Database password: (generate a strong password and save it)
   - Region: Choose closest to your users
   - Pricing plan: Free tier is sufficient for development

4. Wait for the project to be created (~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and click "Run"
5. Verify all tables were created in the Table Editor

### 1.3 Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

### 1.4 Configure Authentication (Optional)

1. Go to Authentication → Providers
2. Enable Email provider (enabled by default)
3. For social logins (optional):
   - Enable Google, GitHub, etc.
   - Add OAuth credentials from respective providers

## Step 2: Local Development Setup

### 2.1 Clone and Install

```bash
git clone https://github.com/yourusername/graph-mapping.git
cd graph-mapping
npm install
```

### 2.2 Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
   SUPABASE_SERVICE_KEY=eyJhbGc...your-service-key
   ```

### 2.3 Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Step 3: Netlify Deployment

### 3.1 Prepare Repository

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

### 3.2 Create Netlify Site

1. Go to [netlify.com](https://netlify.com) and login
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your repositories
5. Select your `graph-mapping` repository

### 3.3 Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

### 3.4 Add Environment Variables

1. Before deploying, click "Add environment variables"
2. Add these variables:
   ```
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGc...
   SUPABASE_SERVICE_KEY = eyJhbGc...
   ```

### 3.5 Deploy

1. Click "Deploy site"
2. Wait for build to complete (~2-3 minutes)
3. Your site will be available at `https://random-name-123.netlify.app`

### 3.6 Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow instructions to configure DNS
4. Netlify provides free SSL certificates automatically

## Step 4: Testing

### 4.1 Test Graph Builder

1. Open your deployed site
2. Click "Builder" in navigation
3. Create a few nodes by clicking "Add Node"
4. Connect nodes by dragging from one to another
5. Click a node to edit its label and description
6. Test Export/Import functionality

### 4.2 Test Database Integration

Once you implement the API integration:

1. Create and save a graph
2. Check Supabase Table Editor to verify it was saved
3. Test rating a graph
4. Verify leaderboard updates

## Step 5: Next Steps

### Implement API Integration

The current implementation has placeholder API calls. To connect to Supabase:

1. Update `src/pages/GraphBuilder.tsx` to save/load from Supabase
2. Update `src/pages/Browse.tsx` to fetch graphs
3. Update `src/pages/Leaderboard.tsx` to fetch leaderboard data
4. Implement authentication

### Enable Row-Level Security

The schema includes RLS policies, but they require authentication:

1. Implement Supabase Auth in your app
2. Test RLS policies ensure users can only modify their own data
3. Configure email templates in Supabase dashboard

### Monitor and Scale

1. **Supabase Dashboard**:
   - Monitor database usage
   - Set up backups
   - Enable database extensions if needed

2. **Netlify Dashboard**:
   - Monitor build minutes
   - Check function invocations
   - Set up deploy notifications

3. **Performance**:
   - Enable Supabase connection pooling for production
   - Consider CDN for static assets (automatic on Netlify)
   - Add database indexes for frequent queries

## Troubleshooting

### Build Fails on Netlify

- Check build logs for specific errors
- Verify all environment variables are set
- Ensure `package.json` has correct dependencies
- Try building locally: `npm run build`

### Supabase Connection Issues

- Verify API keys are correct
- Check RLS policies aren't blocking access
- Look at Supabase logs in dashboard
- Ensure API URL includes `https://`

### TypeScript Errors

- Run `npm run lint` to check for errors
- Ensure all dependencies are installed
- Clear cache: `rm -rf node_modules && npm install`

### Functions Not Working

- Check Netlify function logs
- Verify `netlify.toml` configuration
- Test functions locally with Netlify CLI:
  ```bash
  npm install -g netlify-cli
  netlify dev
  ```

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Join discussions in the repository

---

**Happy building!** 🚀
