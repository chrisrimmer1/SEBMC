# SEBMC Neon Database Integration Guide

This guide shows you how to integrate your SEBMC app with Neon PostgreSQL database on Netlify.

## What's Been Set Up

✅ **Netlify Functions** - Serverless API endpoints for database operations
✅ **Database Schema** - PostgreSQL table structure for storing canvas data
✅ **API Endpoints** - GET and POST endpoints for reading/writing data
✅ **Frontend Hook** - `useCanvasDataDB` for database-backed state management

## Step-by-Step Setup

### 1. Set Up Neon Database

1. **Get your Neon connection string:**
   - Go to [https://console.neon.tech/](https://console.neon.tech/)
   - Sign in to your Neon account
   - Select your project
   - Click "Connection Details"
   - Copy the connection string (looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

2. **Create the database table:**
   - In Neon console, go to "SQL Editor"
   - Copy the contents of `database/schema.sql`
   - Paste and run the SQL to create the table

### 2. Configure Netlify Environment Variables

1. **Go to your Netlify site:**
   - Log in to [https://app.netlify.com/](https://app.netlify.com/)
   - Select your SEBMC site

2. **Add environment variable:**
   - Go to: Site settings → Environment variables
   - Click "Add a variable"
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string (from step 1)
   - Click "Create variable"

3. **Trigger a redeploy:**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - This rebuilds with the new environment variable

### 3. Update Your Frontend Code

You have two options:

#### Option A: Switch to Database-Only (Recommended for Production)

Replace localStorage with database in `src/App.tsx`:

```typescript
// Change this line:
import { useCanvasData } from './hooks/useCanvasData';

// To this:
import { useCanvasData } from './hooks/useCanvasDataDB';
```

#### Option B: Hybrid Approach (Use Both)

Keep localStorage as a fallback when offline:
- Use `useCanvasDataDB` when online
- Fall back to `useCanvasData` (localStorage) when offline
- (Requires additional code to detect connectivity)

### 4. Test Locally (Optional)

To test database integration locally before deploying:

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Neon connection string:**
   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```

3. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

4. **Run Netlify Dev (includes functions):**
   ```bash
   netlify dev
   ```

This runs your app locally with Netlify Functions enabled.

### 5. Deploy to Netlify

```bash
npm run build
# Then drag dist folder to Netlify, OR:
netlify deploy --prod
```

## How It Works

### Data Flow

**When viewing/loading:**
1. User opens app
2. Frontend calls `GET /.netlify/functions/get-canvas`
3. Netlify Function queries Neon database
4. Returns canvas data to frontend
5. Frontend displays the canvas

**When editing/saving:**
1. User makes a change (add/edit/delete/reorder)
2. Frontend calls `POST /.netlify/functions/save-canvas`
3. Netlify Function saves to Neon database
4. Returns success confirmation
5. Frontend updates UI

### API Endpoints

**GET `/api/get-canvas`**
- Fetches current canvas data from database
- Returns JSON with canvas data and last modified timestamp
- No authentication required (yet)

**POST `/api/save-canvas`**
- Saves canvas data to database
- Body: `{ canvasData: { sections: {...}, lastModified: "..." } }`
- Returns success and new timestamp

### Database Schema

```sql
Table: canvas_data
├── id (serial, primary key)
├── user_id (varchar) - Currently "default", can add user auth later
├── canvas_name (varchar) - Currently "My Canvas"
├── data (jsonb) - Your entire canvas structure
├── last_modified (timestamp)
└── created_at (timestamp)
```

## Migrating Existing localStorage Data

If you already have data in localStorage and want to move it to the database:

1. **Export your current data:**
   - Open your app
   - Unlock edit mode
   - Click "Export Backup"
   - Save the JSON file

2. **Import after deploying:**
   - Open your deployed app (with database)
   - Unlock edit mode
   - Click "Import Backup"
   - Select the JSON file you exported

Your data is now in the database!

## Advantages of Database vs localStorage

| Feature | localStorage | Neon Database |
|---------|-------------|---------------|
| **Syncs across devices** | ❌ No | ✅ Yes |
| **Survives browser clear** | ❌ No | ✅ Yes |
| **Multi-user capable** | ❌ No | ✅ Yes (with auth) |
| **Works offline** | ✅ Yes | ❌ No |
| **Data backup** | Manual export | ✅ Automatic |
| **Storage limit** | ~5-10 MB | ✅ Much larger |
| **Setup complexity** | ✅ Simple | ⚠️ Moderate |

## Adding User Authentication (Future)

Currently, everyone shares the same canvas ("default" user). To add user accounts:

1. Add authentication (Netlify Identity, Auth0, or custom)
2. Update functions to use actual user IDs
3. Create multiple canvases per user
4. Add canvas listing/switching UI

Example change in `get-canvas.ts`:
```typescript
// Instead of:
const userId = 'default';

// Use:
const userId = event.headers['x-user-id']; // From auth token
```

## Troubleshooting

### "Failed to load canvas data"
- Check that `DATABASE_URL` is set in Netlify
- Verify Neon database is running
- Check Netlify Function logs

### "Failed to save changes"
- Check network tab for API errors
- Verify database schema is created
- Check Neon connection string is correct

### Functions not working locally
- Make sure you're using `netlify dev`, not `npm run dev`
- Check `.env` file exists with DATABASE_URL
- Install Netlify CLI: `npm install -g netlify-cli`

### CORS errors
- Functions include CORS headers
- If still issues, check Netlify Function logs
- Verify API calls use correct paths (`/.netlify/functions/...`)

## File Structure

```
SEBMC/
├── netlify/
│   └── functions/
│       ├── get-canvas.ts       # GET endpoint
│       └── save-canvas.ts      # POST endpoint
├── database/
│   └── schema.sql              # Database setup
├── src/
│   └── hooks/
│       ├── useCanvasData.ts    # localStorage version (original)
│       └── useCanvasDataDB.ts  # Database version (new)
├── netlify.toml                # Netlify configuration
├── .env.example                # Environment template
└── .env                        # Your local secrets (gitignored)
```

## Next Steps

1. ✅ Create Neon database table (run schema.sql)
2. ✅ Add DATABASE_URL to Netlify environment variables
3. ✅ Update App.tsx to use useCanvasDataDB
4. ✅ Deploy to Netlify
5. ✅ Test the app
6. ✅ Migrate your existing data (export/import)

## Questions?

- **Neon docs:** https://neon.tech/docs
- **Netlify Functions:** https://docs.netlify.com/functions/overview/
- **PostgreSQL JSONB:** https://www.postgresql.org/docs/current/datatype-json.html
