# Frontend Deployment Guide - Vercel

This guide covers deploying the React frontend to Vercel.

## Prerequisites

- GitHub repository connected to Vercel
- Backend deployed to a hosting platform (Render, Railway, Fly.io, or Google Cloud Run)
- Backend URL ready (e.g., `https://your-backend.render.com`)

## Vercel Project Configuration

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `hack-four-social-impact/hack-for-social-impact`

### 2. Configure Build Settings

**Framework Preset**: Vite (auto-detected)

**Root Directory**: `frontend` ⚠️ **IMPORTANT**

**Build Command**: `npm run build` (auto-detected from package.json)

**Output Directory**: `dist` (auto-detected)

**Install Command**: `npm install` (default)

### 3. Environment Variables

Add the following environment variable in Vercel dashboard:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_API_BASE_URL` | `https://your-backend-url.com` | Your deployed backend API URL |

**How to add:**
1. Project Settings → Environment Variables
2. Add `VITE_API_BASE_URL`
3. Enter your backend URL (e.g., `https://your-backend.render.com`)
4. Select all environments (Production, Preview, Development)
5. Click "Save"

⚠️ **Important**: Must start with `VITE_` prefix to be exposed to the frontend

### 4. Deploy

Click "Deploy" and Vercel will:
1. Clone your repository
2. Install dependencies from `frontend/package.json`
3. Run `npm run build` with your environment variables
4. Deploy the `dist` folder to their CDN

## Configuration Files

### `vercel.json` (Already Created)

Located at `/frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**What it does:**
- Configures Vite build settings
- Enables SPA routing (all routes → index.html)
- Sets aggressive caching for assets (1 year)

### `.env` and `.env.production` (Already Created)

**`.env`** - Local development (localhost:8000)
**`.env.production`** - Placeholder for production (overridden by Vercel)

## Post-Deployment Steps

### 1. Get Your Vercel URL

After deployment, Vercel provides:
- **Production URL**: `https://your-app.vercel.app`
- **Custom domain** (optional): `https://your-domain.com`

### 2. Update Backend CORS

Add your Vercel URL to backend CORS allowed origins:

```python
# backend/api/core/config.py
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://your-app.vercel.app",
    "https://your-custom-domain.com"  # if using custom domain
]
```

Redeploy your backend after this change.

### 3. Test Integration

1. Visit your Vercel URL
2. Navigate to API Test page
3. Upload a test PDF
4. Verify successful processing

## Troubleshooting

### Build Fails with TypeScript Errors

Check the Vercel build logs. Common issues:
- Missing type imports (use `type` keyword for type-only imports)
- Ensure `tsc -b` passes locally first

### API Requests Fail (CORS Error)

- Verify `VITE_API_BASE_URL` is set correctly in Vercel
- Check backend CORS configuration includes Vercel URL
- Inspect browser DevTools → Network tab for exact error

### Environment Variable Not Working

- Must start with `VITE_` prefix
- Redeploy after adding/changing env vars
- Check build logs to verify variable is set

### 404 on Page Refresh

- Verify `vercel.json` includes the rewrite rule (already configured)
- Ensures SPA routing works correctly

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Update backend CORS to include custom domain

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **main branch** → Production deployment
- **other branches** → Preview deployments (unique URLs for testing)
- **Pull requests** → Automatic preview deployments with unique URLs

## Environment-Specific Deployments

| Environment | URL | Branch | Env Vars |
|------------|-----|--------|----------|
| Production | `your-app.vercel.app` | `main` | Production settings |
| Preview | `your-app-git-branch.vercel.app` | Feature branches | Production settings |
| Development | `localhost:5173` | Local | `.env` or `.env.local` |

## Cost Estimate

**Hobby Plan** (Free):
- 100GB bandwidth/month
- Unlimited projects
- Automatic HTTPS
- Perfect for this project's expected traffic

**Pro Plan** ($20/month):
- Required if you exceed free tier limits
- Advanced analytics
- Password protection
- Team collaboration

## Summary Checklist

- [ ] Root Directory set to `frontend`
- [ ] Framework preset: Vite
- [ ] Environment variable `VITE_API_BASE_URL` added
- [ ] First deployment successful
- [ ] Backend CORS updated with Vercel URL
- [ ] Test PDF upload working end-to-end
- [ ] Custom domain configured (optional)

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
