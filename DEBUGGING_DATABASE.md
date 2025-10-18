# How to Check if Your Netlify App is Using the Database

## Quick Check #1: Netlify Function Logs

1. **Go to your Netlify dashboard:**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Select your SEBMC site

2. **Open Function logs:**
   - Click on "Functions" tab in the left sidebar
   - You should see 2 functions:
     - `get-canvas`
     - `save-canvas`
   - Click on either one
   - Click "Function logs"

3. **Test your app:**
   - Open your deployed site in a browser
   - Unlock edit mode
   - Add an item
   - Go back to Function logs
   - **You should see logs** showing the function was called

**If you see logs** = ✅ Functions are working
**If NO logs appear** = ❌ Functions aren't being called

---

## Quick Check #2: Browser Developer Tools

1. **Open your deployed site**
2. **Press F12** (or Cmd+Option+I on Mac) to open DevTools
3. **Go to Network tab**
4. **Unlock and add an item**
5. **Look for requests to:**
   - `/.netlify/functions/save-canvas` (when saving)
   - `/.netlify/functions/get-canvas` (when loading)

**If you see these requests** = ✅ Trying to use database
**Status 200** = ✅ Working perfectly
**Status 404/500** = ❌ Functions exist but something's wrong
**No requests** = ❌ Not calling functions at all

---

## Quick Check #3: Check if Functions Were Deployed

1. **In Netlify Dashboard:**
   - Go to "Deploys" tab
   - Click on the latest deploy
   - Scroll down to "Deploy log"
   - Search for "functions" in the log

2. **Look for lines like:**
   ```
   ◈ Packaging Functions from netlify/functions directory:
   ◈  - get-canvas.ts
   ◈  - save-canvas.ts
   ```

**If you see this** = ✅ Functions were deployed
**If you don't see this** = ❌ Functions weren't included in deploy

---

## Quick Check #4: Test the API Directly

Open this URL in your browser (replace YOUR-SITE with your actual Netlify URL):

```
https://YOUR-SITE.netlify.app/.netlify/functions/get-canvas
```

**Expected responses:**
- ✅ `{"error": "Canvas not found"}` - Function works, no data yet
- ✅ `{"canvasData": {...}}` - Function works, data exists
- ❌ `404 Page not found` - Function not deployed
- ❌ `500 Internal error` - Function deployed but broken

---

## Common Issues & Fixes

### Issue 1: Functions Not Deployed
**Symptom:** 404 errors when calling functions

**Fix:**
1. Make sure `netlify.toml` exists in project root
2. Redeploy from Netlify dashboard
3. Or deploy using: `netlify deploy --prod`

### Issue 2: Database Connection Error
**Symptom:** 500 errors in function logs

**Likely causes:**
- Database table not created (run schema.sql in Neon)
- NETLIFY_DATABASE_URL not set (should be automatic if Neon is connected)

**Fix:**
- Check Netlify: Site settings → Environment variables
- Should see `NETLIFY_DATABASE_URL`
- Run the SQL schema in Neon console

### Issue 3: Still Using localStorage
**Symptom:** No function calls in Network tab, data only saved locally

**Fix:**
- Make sure you deployed the NEW build (after changing to useCanvasDataDB)
- Check that `src/App.tsx` line 7 says: `import { useCanvasDataDB as useCanvasData }`
- Rebuild: `npm run build`
- Redeploy the new `dist` folder

### Issue 4: CORS Errors
**Symptom:** "CORS policy" errors in browser console

**This shouldn't happen** - our functions include CORS headers. If you see this:
- Check function code has `Access-Control-Allow-Origin: *` headers
- Redeploy functions

---

## Expected Behavior with Database

**When working correctly:**
1. Open site → sees "Loading..." briefly
2. Calls `GET /.netlify/functions/get-canvas`
3. Loads data from Neon database
4. Add item → immediately calls `POST /.netlify/functions/save-canvas`
5. Refresh page → data persists (loaded from database)
6. Open on different device → same data appears

**When NOT working (still using localStorage):**
1. No API calls in Network tab
2. Data only persists in same browser
3. Different device shows empty canvas
4. Function logs show nothing

---

## What to Look For Right Now

1. **Open your deployed site URL**
2. **Press F12 → Network tab**
3. **Refresh the page**
4. **Look for:** `get-canvas` request
   - If you see it: ✅ Using database
   - If you don't: ❌ Still using localStorage

5. **Add an item (in edit mode)**
6. **Look for:** `save-canvas` request
   - If you see it: ✅ Saving to database
   - If you don't: ❌ Saving to localStorage only

---

## Quick Diagnostic Script

If you want to check programmatically, open browser console on your site and paste:

```javascript
// Check if database hook is being used
console.log('Checking for database integration...');

// Try to fetch from API
fetch('/.netlify/functions/get-canvas')
  .then(r => {
    console.log('✅ Functions responding:', r.status);
    return r.json();
  })
  .then(data => console.log('Data:', data))
  .catch(err => console.error('❌ Functions not working:', err));
```

---

## Next Steps Based on Results

**If functions ARE being called but returning errors:**
→ Check Neon database has the table created (run schema.sql)

**If functions are NOT being called at all:**
→ The build didn't include the database version
→ Rebuild and redeploy

**If functions return 404:**
→ Functions weren't deployed with the site
→ Check netlify.toml exists
→ Redeploy

Tell me what you find and I'll help fix it!
