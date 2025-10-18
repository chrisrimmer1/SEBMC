# SEBMC Deployment Guide

Your application has been built successfully! The production files are in the `dist/` folder.

## Quick Deployment Options

### 1. Netlify (Recommended - Easiest)

#### Option A: Drag & Drop
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up/login
3. Drag the `dist` folder onto the Netlify dashboard
4. Your site will be live at `https://your-site-name.netlify.app`

#### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### 2. Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### 3. GitHub Pages

#### First-time setup:
1. Create a GitHub repository
2. Update `vite.config.ts` - add base path:
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/'  // Replace with your repo name
   })
   ```
3. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```
4. Add to `package.json` scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
5. Deploy:
   ```bash
   npm run deploy
   ```

Your site will be live at: `https://your-username.github.io/your-repo-name/`

### 4. Any Static Host

Upload the contents of the `dist/` folder to:
- AWS S3 + CloudFront
- DigitalOcean App Platform
- Cloudflare Pages
- Firebase Hosting
- Surge.sh

## Recommended: Netlify

**Why Netlify?**
- Free tier is generous
- Automatic HTTPS
- No configuration needed
- Instant deployments
- Custom domain support

**Steps:**
1. Visit [netlify.com](https://netlify.com)
2. Drag `dist` folder to dashboard
3. Done! ✅

## Custom Domain

After deploying to Netlify/Vercel:
1. Go to domain settings
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provided

## Environment Variables

If you need to change the password or other settings:
1. Update `src/hooks/useAuth.ts`
2. Rebuild: `npm run build`
3. Redeploy the new `dist` folder

## Continuous Deployment (Optional)

For automatic deployments on every git push:

**Netlify:**
1. Connect your GitHub repo in Netlify dashboard
2. Build command: `npm run build`
3. Publish directory: `dist`

**Vercel:**
1. Import project from GitHub
2. Vercel auto-detects Vite settings

## Need Help?

- Netlify docs: https://docs.netlify.com
- Vercel docs: https://vercel.com/docs
- Vite deployment: https://vite.dev/guide/static-deploy.html
