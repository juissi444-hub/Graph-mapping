# Graph Mapping - Advanced Flowchart Platform

An interactive platform for creating, sharing, and analyzing graphs with isomorphism detection. Users can build flowcharts with three distinct connection types, share them with the community, and discover isomorphic graphs created by others.

## Features

### Core Functionality
- **Interactive Graph Builder**: Drag-and-drop interface powered by React Flow
- **Three Connection Types**:
  - 🔴 **Opposite** (Red) - Represents opposing relationships
  - 🔵 **Connection** (Blue) - Standard connections
  - 🟢 **Linear** (Green) - Sequential/linear relationships
- **Node Descriptions**: Add detailed explanations to each node
- **Graph Import/Export**: Save and load graphs as JSON files

### Social Features
- **Graph Sharing**: Publish your graphs to the community
- **Rating System**: Rate graphs from 1-5 stars
- **Leaderboard**: Track top contributors by graph count and ratings
- **Isomorphism Detection**: Automatically groups structurally identical graphs
- **Browse & Discover**:
  - Sort by "Best Rated", "Latest", or "Most Popular"
  - View isomorphic graph groups together

### Advanced Features
- **Graph Isomorphism Algorithm**: Sophisticated backtracking algorithm that respects edge types
- **Real-time Collaboration**: Built on Supabase for real-time updates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Flow** - Interactive graph visualization
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing

### Backend
- **Netlify Functions** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time capabilities
  - Authentication
  - Row-Level Security (RLS)
  - Real-time subscriptions

### Deployment
- **Netlify** - Automatic deployments with CI/CD
- **Supabase Cloud** - Managed PostgreSQL database

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (free tier available)
- Netlify account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/graph-mapping.git
   cd graph-mapping
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in the SQL editor
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Type-check TypeScript files

### Project Structure

```
graph-mapping/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── EdgeTypeSelector.tsx
│   │   ├── GraphActionsPanel.tsx
│   │   ├── GraphCard.tsx
│   │   └── NodeModal.tsx
│   ├── pages/           # Route components
│   │   ├── GraphBuilder.tsx
│   │   ├── Browse.tsx
│   │   └── Leaderboard.tsx
│   ├── services/        # External service integrations
│   │   └── supabase.ts
│   ├── store/           # State management
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   └── graphIsomorphism.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── netlify/
│   └── functions/       # Serverless API endpoints
│       ├── graphs.ts
│       ├── ratings.ts
│       └── leaderboard.ts
├── public/              # Static assets
├── netlify.toml         # Netlify configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## Deployment to Netlify

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect the build settings from `netlify.toml`

3. **Add environment variables**
   - In Netlify dashboard: Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_KEY` (for Netlify Functions)

4. **Deploy**
   - Netlify will automatically build and deploy
   - Every push to main will trigger a new deployment

### Manual Deploy

```bash
npm run build
netlify deploy --prod
```

## Graph Isomorphism Algorithm

The platform implements a sophisticated graph isomorphism detection algorithm that:

1. **Respects Edge Types**: Unlike standard isomorphism algorithms, this considers the three distinct connection types
2. **Signature-Based Pruning**: Uses node degree and edge type distribution to quickly eliminate non-isomorphic candidates
3. **Backtracking Search**: Employs recursive backtracking with early pruning for efficient mapping discovery
4. **Hash-Based Quick Check**: Generates structural hashes for O(1) preliminary comparisons

### Algorithm Complexity
- **Best Case**: O(n) - Different node counts or edge distributions
- **Average Case**: O(n! / k) - Signature pruning reduces search space
- **Worst Case**: O(n!) - Complete graphs with uniform structure

### Practical Limits
- Works efficiently for graphs up to ~20 nodes
- For larger graphs, uses hash-based grouping only

## Database Schema

The application uses the following main tables:

- **users** - User profiles and authentication
- **graphs** - Graph data (nodes, edges, metadata)
- **ratings** - User ratings for graphs (1-5 stars)
- **isomorphic_groups** - Groups of isomorphic graphs
- **graph_isomorphic_groups** - Mapping between graphs and groups

See `supabase-schema.sql` for complete schema with indexes and RLS policies.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Test your changes locally before submitting

## Roadmap

- [ ] User authentication with Supabase Auth
- [ ] Real-time collaborative editing
- [ ] Graph templates and presets
- [ ] Advanced search and filtering
- [ ] Graph analytics and statistics
- [ ] Export to various formats (PNG, SVG, PDF)
- [ ] Mobile app (React Native)
- [ ] Graph animations and transitions
- [ ] Comments and discussions on graphs
- [ ] Private graphs and sharing permissions

## License

ISC

## Acknowledgments

- [React Flow](https://reactflow.dev/) - Graph visualization library
- [Supabase](https://supabase.com/) - Backend and database
- [Netlify](https://netlify.com/) - Hosting and deployment
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
