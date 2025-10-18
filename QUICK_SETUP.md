# Quick Database Setup - 5 Minutes

Your Neon database is already connected to Netlify! Here's what to do:

## Step 1: Create the Database Table (2 minutes)

1. **Go to Neon Console:**
   - Click on your database: **late-meadow-15169286**
   - Click on "SQL Editor" in the left sidebar

2. **Run this SQL:**

```sql
-- Create the canvas_data table
CREATE TABLE IF NOT EXISTS canvas_data (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL DEFAULT 'default',
  canvas_name VARCHAR(255) NOT NULL DEFAULT 'My Canvas',
  data JSONB NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, canvas_name)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_id ON canvas_data(user_id);
CREATE INDEX IF NOT EXISTS idx_last_modified ON canvas_data(last_modified DESC);
```

3. **Click "Run"** or press Execute

You should see: "Query executed successfully"

## Step 2: Update Your Code (1 minute)

Open `src/App.tsx` and change line 7:

**From:**
```typescript
import { useCanvasData } from './hooks/useCanvasData';
```

**To:**
```typescript
import { useCanvasData } from './hooks/useCanvasDataDB';
```

That's it! Save the file.

## Step 3: Build and Deploy (2 minutes)

```bash
npm run build
```

Then either:
- **Option A:** Drag the `dist` folder to Netlify dashboard
- **Option B:** Use Netlify CLI: `netlify deploy --prod`

## Done! 🎉

Your app now uses the Neon database instead of localStorage.

### Benefits:
- ✅ Data syncs across all devices
- ✅ Survives browser cache clearing
- ✅ Professional database backend
- ✅ Ready for multi-user in the future

### Test It:
1. Open your deployed site
2. Add some items
3. Close browser completely
4. Open site on a different device/browser
5. Your data is there! ✨

## Troubleshooting

**"Failed to load canvas data"**
- Make sure you ran the SQL in Step 1
- Check Netlify Function logs in your Netlify dashboard

**Changes not saving**
- Check browser console (F12) for errors
- Verify the table was created in Neon SQL Editor

**Still showing old data**
- Clear browser cache (Ctrl+Shift+Delete)
- Or use incognito/private mode
