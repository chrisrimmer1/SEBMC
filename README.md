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
🎨 **6 Beautiful Themes** - Chris (yellow), Olly (pink), Midnight (dark), Minimal (monochrome), Ocean (teal), Sunset (coral)
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
- Choose from 6 beautiful themes using the palette dropdown (🎨)
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

## Themes

The app includes 6 beautiful color themes to customize your experience:

### Available Themes

- **☀️ Chris** (Default) - Classic yellow and black design, professional and bold
- **💗 Olly** - Vibrant hot pink theme with playful energy
- **🌙 Midnight** - Dark mode with yellow accents for reduced eye strain
- **⬛ Minimal** - Pure black and white monochrome for distraction-free focus
- **🌊 Ocean** - Cool cyan and teal colors, calm and refreshing
- **🌅 Sunset** - Warm coral and orange tones, inviting and friendly

### Changing Themes

1. Click the **🎨 Theme** button in the header (shows current theme)
2. Select your preferred theme from the dropdown menu
3. Theme choice is saved automatically and persists across sessions

Each theme includes carefully chosen colors for:
- Section borders and accents
- Text and backgrounds with proper contrast
- Shadows and UI elements
- Consistent experience across all features

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

**Option A: Automatic Setup (Recommended - Easiest)**

1. **Create Neon Database**
   - Go to [console.neon.tech](https://console.neon.tech) and sign up (free)
   - Click **"Create a project"**
   - Name your project (e.g., "SEBMC")
   - Select region closest to you
   - Click **"Create project"**
   - Your database is ready!

2. **Set Up Database Table**
   - In Neon console, click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**
   - Copy and paste the entire contents of `database/schema.sql` (or use the SQL below)
   - Click **"Run"** or press Ctrl+Enter
   - You should see: "Success" with "CREATE TABLE" messages

   ```sql
   CREATE TABLE IF NOT EXISTS canvas_data (
     id SERIAL PRIMARY KEY,
     user_id VARCHAR(255) NOT NULL DEFAULT 'default',
     canvas_name VARCHAR(255) NOT NULL DEFAULT 'My Canvas',
     data JSONB NOT NULL,
     last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(user_id, canvas_name)
   );

   CREATE INDEX IF NOT EXISTS idx_user_id ON canvas_data(user_id);
   CREATE INDEX IF NOT EXISTS idx_last_modified ON canvas_data(last_modified DESC);
   ```

3. **Verify Table Created**
   - In SQL Editor, run: `SELECT * FROM canvas_data;`
   - Should return empty results (no rows yet) - this confirms the table exists

4. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. **Deploy to Netlify with Neon Integration**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub** and select your SEBMC repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
     - **Functions directory**: `netlify/functions`
   - Click **"Deploy site"** (don't worry, we'll connect database next)

6. **Install Neon Integration** (Automatic Database Connection)
   - In your Netlify site dashboard, click **"Integrations"** in the top menu
   - Search for **"Neon"**
   - Click **"Add integration"** on the Neon card
   - Click **"Connect Neon"**
   - Authorize Netlify to access your Neon account
   - Select your SEBMC project from the dropdown
   - Select your database
   - Click **"Connect"**
   - Netlify automatically sets `NETLIFY_DATABASE_URL` environment variable!

7. **Redeploy**
   - Go to **"Deploys"** tab
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Wait for build to complete (~1-2 minutes)
   - Your app is live with database! ✅

**Option B: Manual Setup**

If you prefer manual configuration or the integration doesn't work:

1. **Get Neon Connection String**
   - In Neon console, click **"Dashboard"**
   - Find your database in the project
   - Click **"Connection Details"**
   - Copy the connection string (looks like: `postgresql://user:password@ep-xyz.region.neon.tech/dbname?sslmode=require`)

2. **Add to Netlify Manually**
   - In Netlify dashboard, go to **Site settings** → **Environment variables**
   - Click **"Add a variable"**
   - **Key**: `NETLIFY_DATABASE_URL`
   - **Value**: Paste your Neon connection string
   - **Scopes**: Check "All" or "Production"
   - Click **"Create variable"**

3. **Redeploy**
   - Go to **"Deploys"** tab → **"Trigger deploy"** → **"Deploy site"**

**Verifying Database Connection**

After deployment:
1. Open your deployed site URL
2. Press **F12** → **Network tab**
3. Refresh the page
4. Look for a request to `get-canvas` or `/.netlify/functions/get-canvas`
   - ✅ **Status 200**: Database connected and working!
   - ⚠️ **Status 404**: Functions not deployed (check build logs)
   - ❌ **Status 500**: Database connection issue (check environment variables)

5. Unlock edit mode and add an item
6. Look for `save-canvas` request with Status 200
7. Refresh the page - data should persist! ✅

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

## Troubleshooting Database Issues

### "Failed to load canvas data" or "Failed to save changes"

**Check 1: Verify Database Table Exists**
- Go to Neon console → SQL Editor
- Run: `SELECT * FROM canvas_data;`
- If error "relation does not exist": Run the schema SQL again (see deployment steps)
- If returns empty results: ✅ Table exists, continue to next check

**Check 2: Verify Environment Variable is Set**
- Netlify dashboard → Site settings → Environment variables
- Look for `NETLIFY_DATABASE_URL` or `DATABASE_URL`
- If missing: Add manually or reinstall Neon integration
- If present: Copy value and test connection in Neon

**Check 3: Check Netlify Function Logs**
- Netlify dashboard → Functions tab
- Click on `get-canvas` or `save-canvas`
- Click "Function logs"
- Look for errors like:
  - "Connection refused": Database not accessible (check Neon is running)
  - "relation does not exist": Table not created (run schema SQL)
  - "password authentication failed": Wrong connection string

**Check 4: Verify Functions Deployed**
- Netlify dashboard → Deploys → Latest deploy
- Scroll to build logs
- Search for "Packaging Functions"
- Should see: `get-canvas.ts` and `save-canvas.ts` listed
- If not listed: Check `netlify.toml` exists and redeploy

### Functions Return 404

**Cause**: Functions weren't deployed with the site

**Fix**:
1. Verify `netlify.toml` exists in project root
2. Check it has: `functions = "netlify/functions"`
3. Trigger a new deploy: Deploys → Trigger deploy → Deploy site
4. Check build logs for "Functions" section

### Data Doesn't Persist Across Devices

**Cause**: Still using localStorage instead of database

**Fix**:
1. Check browser Network tab (F12) when loading the app
2. Look for requests to `/.netlify/functions/get-canvas`
3. If NO requests appear: App is using localStorage
4. Verify `src/App.tsx` imports `useCanvasDataDB` (not `useCanvasData`)
5. Rebuild and redeploy

### Neon Connection String Issues

**Correct format**:
```
postgresql://user:password@ep-xxxxx-xxxxx.region.aws.neon.tech/dbname?sslmode=require
```

**Common mistakes**:
- Missing `?sslmode=require` at the end (Neon requires SSL)
- Using wrong database name
- Expired password (Neon resets passwords periodically)
- Wrong region endpoint

**Get fresh connection string**:
- Neon console → Dashboard → Your database → Connection Details
- Click "Copy" icon to avoid typos

### Database Works Locally but Not on Netlify

**Local (using `netlify dev`)**:
- Uses `.env` file with `DATABASE_URL`

**Production (Netlify)**:
- Uses environment variables from Netlify dashboard
- Must set `NETLIFY_DATABASE_URL` in Netlify (not in `.env`)

**Fix**: Add environment variable in Netlify dashboard, then redeploy

### How to View Data in Neon

To inspect your saved canvas data:

```sql
-- See all canvases
SELECT user_id, canvas_name, last_modified FROM canvas_data;

-- See full data for default canvas
SELECT data FROM canvas_data WHERE user_id = 'default';

-- Pretty print the JSON
SELECT jsonb_pretty(data) FROM canvas_data WHERE user_id = 'default';

-- Count items in each section
SELECT
  key as section,
  jsonb_array_length(value->'items') as item_count
FROM canvas_data, jsonb_each(data->'sections')
WHERE user_id = 'default';
```

### Reset Database (Start Fresh)

If you want to clear all data and start over:

```sql
-- Delete all data but keep table structure
DELETE FROM canvas_data;

-- Or drop and recreate table
DROP TABLE canvas_data;
-- Then run schema.sql again
```

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
│   │   ├── useTheme.ts      # Theme management (6 themes)
│   │   └── useCanvasDataDB.ts  # Database operations
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   │   ├── initialData.ts   # Default canvas
│   │   ├── exportPDF.ts     # PDF generation
│   │   ├── markdown.tsx     # Text formatting
│   │   ├── seedQuestions.ts # Help content
│   │   └── themes.ts        # Theme definitions
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
- ✅ 6 custom themes (Chris, Olly, Midnight, Minimal, Ocean, Sunset)
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
- [ ] User-customizable color themes
- [ ] Undo/redo functionality
- [ ] Version history
- [ ] Comments and notes
- [ ] Team sharing

---

Built with ❤️ for social entrepreneurs making a difference
