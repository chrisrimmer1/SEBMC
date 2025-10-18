# Deploy SEBMC with Database - GitHub Method (5 Minutes)

Your code is ready! We just need to get it onto GitHub and connect it to Netlify properly.

## Step 1: Push to GitHub (2 minutes)

Your changes are already committed. Now push them:

**Do you have a GitHub repository for this project?**

### If YES (you have a remote repository):
```bash
git push origin main
```

### If NO (you need to create one):

1. **Go to GitHub.com** and create a new repository:
   - Name it: `sebmc` or whatever you want
   - Don't add README, .gitignore, or license (we already have them)
   - Click "Create repository"

2. **Copy the repository URL** (looks like: `https://github.com/YOUR-USERNAME/sebmc.git`)

3. **Run these commands:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/sebmc.git
   git push -u origin main
   ```

---

## Step 2: Connect Netlify to GitHub (3 minutes)

1. **Go to Netlify Dashboard:**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Find your existing SEBMC site
   - Click on it

2. **Link the repository:**
   - Go to: **Site settings** → **Build & deploy** → **Continuous deployment**
   - Click **"Link repository"** or **"Connect to Git provider"**
   - Choose **GitHub**
   - Authorize Netlify if needed
   - Select your **SEBMC repository**
   - Branch: **main**
   - Click **"Save"**

3. **Netlify will automatically:**
   - Build your project: `npm run build`
   - Deploy the `dist` folder
   - **Deploy your functions** from `netlify/functions/`
   - Everything will work together!

---

## Step 3: Watch the Deploy

1. **Go to "Deploys" tab** in your Netlify site
2. **Watch it build** (takes 1-2 minutes)
3. **Look for:** "Functions packaged successfully" or similar message
4. **When done,** you'll see: "Published"

---

## Step 4: Test It!

1. **Open your site URL**
2. **Press F12** → Network tab
3. **Refresh the page**
4. **Look for:** `get-canvas` request
   - ✅ If you see it: Database is working!
5. **Add an item** (unlock edit mode first)
6. **Look for:** `save-canvas` request
   - ✅ If you see it: Saving to database!
7. **Refresh the page**
   - ✅ Data persists from database!

---

## That's It!

From now on, every time you push to GitHub:
- Netlify automatically rebuilds
- Functions get redeployed
- Your site updates automatically

## Current Status:
- ✅ Code is committed and ready
- ✅ Database schema created in Neon
- ✅ Functions are ready
- ✅ App configured to use database
- ⏳ Just needs to be pushed to GitHub and connected to Netlify

---

## Alternative: Manual Deploy (If You Don't Want GitHub)

If you don't want to use GitHub, you can manually deploy via Netlify CLI, but you'll need access to a terminal. Let me know if you want instructions for that instead!
