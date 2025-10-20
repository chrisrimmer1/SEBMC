# Social Enterprise Business Model Canvas (SEBMC)

A modern, interactive web application for planning and visualizing social enterprise business models. Built with React, TypeScript, and Vite for a fast, responsive experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)

## Features

✨ **Interactive Canvas** - 9 specialized sections adapted for social enterprises
🔒 **Password Protection** - View-only mode by default, edit mode requires authentication
🎯 **Drag & Drop** - Easily reorder items within sections
💾 **Database Persistence** - Changes automatically saved to Neon PostgreSQL via Netlify
📥 **PDF Export** - Download your canvas as a professionally formatted A4 PDF
📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
⚡ **Lightning Fast** - Built with Vite for instant hot reload during development
🎨 **Theme Toggle** - Switch between light and dark modes
❓ **Guided Questions** - Built-in seed questions help you think through each section
🌐 **Cloud-Based** - Access your canvas from anywhere with database sync

## Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+ and npm
- (Optional) Netlify account for deployment
- (Optional) Neon PostgreSQL database for cloud storage

### Installation

```bash
# Clone the repository
git clone https://github.com/chrisrimmer1/SEBMC.git
cd SEBMC

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

**Note**: The dev server runs locally without database persistence. For full functionality including cloud sync, deploy to Netlify (see Deployment section).

### Building for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## Usage

### View Mode

Open the application - you'll see the Social Enterprise Business Model Canvas in view-only mode. You can:
- Browse all 9 sections and their content
- Switch between light/dark themes using the moon/sun icon
- Export the canvas to PDF using the download icon

### Edit Mode

1. Click the **🔓 Unlock** button in the top-right corner
2. Enter password: `jobshapedobject`
3. You can now:
   - **Add items**: Click "+ Add Item" in any section
   - **Edit items**: Click on any item to edit its title and description
   - **Delete items**: Click the × button on any item
   - **Reorder items**: Drag items by their handle (⋮⋮) to reorder
   - **Edit subtitles**: Click on any section subtitle to customize it
   - **Edit canvas title/subtitle**: Click the main title or subtitle to edit
   - **Get help**: Click the ❓ icon in any section header to see guiding questions
   - **Export/Import**: Use the sidebar menu for JSON backup and restore

### Formatting Text

**Bullet points** - Start a line with `-` or `•`:
```
- First point
- Second point
Regular text
- Another point
```

**Canvas subtitle** - Supports markdown formatting:
```
**Bold text**
*Italic text*
Manual line breaks preserved
```

### Keyboard Shortcuts

- **Enter**: Save when editing
- **Esc**: Close modal or cancel editing
- **Ctrl/Cmd + Enter**: Save multi-line text in subtitle editor

## Canvas Sections

The SEBMC includes 9 sections organized in 3 rows:

### Row 1: Value Creation
- **Social Problem** - The social issue or imbalance you're addressing
- **Service Portfolio** - Services/actions/programs that deliver the core value
- **Core Value Offerings** - The value proposition to address the social problem
- **Beneficiaries** - Target group who will benefit directly from your work
- **Impact** - Metrics and evidence of positive change created

### Row 2: Delivery
- **Network Partners** - Allies and collaborators who strengthen your mission
- **Channels** - How people discover and access your services

### Row 3: Sustainability
- **Costs** - Sources of expenditure (capital, operational, fixed vs. variable)
- **Revenue Streams** - Income sources that sustain and grow your funding base

## Data Storage

### Cloud Storage (Production)

When deployed to Netlify with Neon PostgreSQL:
- ✅ Data persists across devices and sessions
- ✅ Automatic sync to cloud database
- ✅ Access from anywhere
- ✅ Secure backend via Netlify Functions

### Local Storage (Development)

When running locally (`npm run dev`):
- ✅ Data stored in browser localStorage
- ✅ Works offline - no internet required
- ⚠️ Data is device-specific
- ⚠️ Clearing browser data erases your canvas

**Recommendation**: Deploy to Netlify for persistent cloud storage!

## Deployment

### Netlify (Recommended)

**Prerequisites:**
- Netlify account (free tier works)
- Neon PostgreSQL database (free tier works)
- GitHub account

**Steps:**

1. **Create Neon Database**
   - Go to [neon.tech](https://neon.tech) and create a free account
   - Create a new project and database
   - Copy the connection string (starts with `postgresql://`)

2. **Set Up Database Schema**
   - Connect to your Neon database console
   - Run the SQL from `database/schema.sql`:
   ```sql
   CREATE TABLE IF NOT EXISTS canvas_data (
     id SERIAL PRIMARY KEY,
     user_id VARCHAR(255) NOT NULL DEFAULT 'default',
     canvas_name VARCHAR(255) NOT NULL DEFAULT 'My Canvas',
     data JSONB NOT NULL,
     last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(user_id, canvas_name)
   );
   ```

3. **Connect to Netlify**
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Functions directory**: `netlify/functions`

4. **Configure Environment Variables**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add `NETLIFY_DATABASE_URL` with your Neon connection string
   - OR install the Neon Netlify integration (recommended - auto-configures)

5. **Deploy**
   - Netlify will automatically deploy when you push to GitHub
   - Future pushes trigger automatic redeployment

**Manual Deployment:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist --functions=netlify/functions
```

### GitHub Pages (Static Only)

**Note**: GitHub Pages doesn't support serverless functions, so database features won't work.

```bash
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

Configure in `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## Environment Variables

Required for database functionality:

- `NETLIFY_DATABASE_URL` - PostgreSQL connection string (auto-set by Neon integration)
- `DATABASE_URL` - Fallback connection string

These are automatically configured when using the Neon Netlify integration.

## Changing the Password

The default password is `jobshapedobject`. To change it:

1. Generate SHA-256 hash of your new password:
   ```javascript
   const hash = await crypto.subtle.digest('SHA-256',
     new TextEncoder().encode('your-new-password'));
   const hashHex = Array.from(new Uint8Array(hash))
     .map(b => b.toString(16).padStart(2, '0')).join('');
   console.log(hashHex);
   ```

2. Update `CORRECT_PASSWORD_HASH` in `src/hooks/useAuth.ts`

3. Rebuild and redeploy

## Development

### Project Structure

```
SEBMC/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Top navigation
│   │   ├── Sidebar.tsx      # Tools panel
│   │   ├── CanvasSection.tsx
│   │   ├── ContentItem.tsx
│   │   ├── EditModal.tsx
│   │   └── SeedQuestionsModal.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication
│   │   ├── useTheme.ts      # Light/dark mode
│   │   └── useCanvasDataDB.ts  # Database operations
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   │   ├── initialData.ts   # Default canvas
│   │   ├── exportPDF.ts     # PDF generation
│   │   ├── markdown.tsx     # Text formatting
│   │   └── seedQuestions.ts # Help content
│   ├── App.tsx              # Main application
│   └── App.css              # All styles
├── netlify/
│   └── functions/           # Serverless functions
│       ├── get-canvas.ts
│       └── save-canvas.ts
├── database/
│   └── schema.sql           # Database schema
└── netlify.toml             # Netlify config
```

### Tech Stack

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool and dev server
- **@hello-pangea/dnd** - Drag and drop
- **lucide-react** - Icon library
- **jspdf + html2canvas** - PDF export
- **Neon PostgreSQL** - Cloud database
- **Netlify Functions** - Serverless backend

### Running the Dev Server

```bash
# Start dev server (runs on http://localhost:5173)
npm run dev

# The dev server features:
# - Hot module replacement (instant updates)
# - TypeScript type checking
# - Local storage persistence (not database)
```

### Making Changes

See `CLAUDE.md` for detailed development documentation including:
- Adding new sections
- Modifying styles
- Changing the grid layout
- Adding features

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires:
- ES2020+ support
- CSS Grid and Flexbox
- localStorage API
- Web Crypto API (for password hashing)

## Credits

Based on the **Social Enterprise Business Model Canvas** by [HotCubator](https://hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas/), adapted from the original **Business Model Canvas** by Alexander Osterwalder.

**Implementation**: React + TypeScript with modern web technologies

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests: `npm run build` (ensure it builds without errors)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check `CLAUDE.md` for detailed development documentation

## Changelog

### Current Version

**Features:**
- ✅ Interactive 9-section canvas
- ✅ Password-protected edit mode
- ✅ Database persistence (Neon + Netlify)
- ✅ PDF export with smart page breaks
- ✅ Light/dark theme toggle
- ✅ Seed questions for guided planning
- ✅ Drag & drop reordering
- ✅ Editable section subtitles
- ✅ Markdown formatting support
- ✅ Mobile-optimized view
- ✅ JSON export/import

### Roadmap

Future enhancements:
- [ ] Multiple canvas support (save different projects)
- [ ] User authentication (multiple users)
- [ ] Real-time collaboration
- [ ] Custom themes and colors
- [ ] Undo/redo functionality
- [ ] Version history
- [ ] Comments and notes
- [ ] Team sharing

---

Built with ❤️ for social entrepreneurs making a difference
