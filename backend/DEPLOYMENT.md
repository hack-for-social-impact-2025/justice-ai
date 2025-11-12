# Cloud Run Deployment Guide

## 🎉 Deployment Status: ✅ CI/CD OPERATIONAL

**Current Status**: Cloud Build CI/CD pipeline is **active and working**
- ✅ Automated deployments from GitHub to Cloud Run
- ✅ Backend API deployed and serving requests
- ✅ All core endpoints tested and verified
- ⏳ CORS configuration pending (needs frontend URL)

---

This guide covers deploying the backend API to Google Cloud Run, both manually and with automated CI/CD.

## Table of Contents

1. [Deployment Status](#deployment-status)
2. [Prerequisites](#prerequisites)
3. [Secret Manager Setup](#secret-manager-setup)
4. [Manual Deployment](#manual-deployment)
5. [Automated Deployment with Cloud Build](#automated-deployment-with-cloud-build)
6. [Environment Variables](#environment-variables)
7. [Updating Deployments](#updating-deployments)
8. [Viewing Logs](#viewing-logs)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have completed:

- ✅ Followed [GCP_SETUP.md](./GCP_SETUP.md) to set up your GCP project
- ✅ Enabled required APIs (Cloud Run, Cloud Build, Secret Manager, Artifact Registry)
- ✅ Installed and authenticated gcloud CLI
- ✅ Set default project and region
- ✅ Have your Gemini API key ready

Verify prerequisites:

```bash
# Check gcloud is authenticated
gcloud auth list

# Check project is set
gcloud config get-value project

# Check required APIs are enabled
gcloud services list --enabled | grep -E "(run|cloudbuild|secretmanager|artifactregistry)"
```

---

## Secret Manager Setup

Store your Gemini API key securely in Secret Manager instead of environment variables.

### 1. Enable Secret Manager API

```bash
gcloud services enable secretmanager.googleapis.com
```

### 2. Create Secret for Gemini API Key

```bash
# Create the secret (replace YOUR_GEMINI_API_KEY with your actual key)
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY \
  --data-file=- \
  --replication-policy="automatic"
```

### 3. Grant Cloud Run Access to the Secret

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

# Grant the Cloud Run service account access to the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 4. Verify Secret Was Created

```bash
# List all secrets
gcloud secrets list

# View secret metadata (not the value)
gcloud secrets describe GEMINI_API_KEY
```

### Update a Secret (If Needed)

```bash
# Add a new version of the secret
echo -n "NEW_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-
```

---

## Manual Deployment

Manual deployment is useful for testing before setting up automated CI/CD.

### 1. Build Docker Image Locally (Optional Test)

```bash
# Navigate to backend directory
cd backend

# Build the image
docker build -t backend-test .

# Test run locally (optional)
docker run -p 8000:8080 \
  -e GEMINI_API_KEY=your_key_here \
  -e ALLOWED_ORIGINS=http://localhost:5173 \
  backend-test
```

### 2. Deploy to Cloud Run

```bash
# Deploy from source (Cloud Run will build the Docker image for you)
gcloud run deploy backend-api \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60s \
  --set-env-vars DEBUG=False \
  --set-env-vars ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

**Important**: Replace `https://your-frontend-domain.vercel.app` with your actual Vercel frontend URL.

### 3. Get Service URL

After deployment, Cloud Run will display the service URL:

```
Service [backend-api] revision [backend-api-00001-abc] has been deployed and is serving 100 percent of traffic.
Service URL: https://backend-api-xxxxx-uc.a.run.app
```

**Save this URL** - you'll need it to configure your frontend.

### 4. Test the Deployment

```bash
# Test health endpoint
curl https://backend-api-xxxxx-uc.a.run.app/health

# Expected response:
# {"status":"healthy"}
```

---

## Automated Deployment with Cloud Build

Set up automatic deployments triggered by GitHub pushes.

### 1. Connect GitHub Repository to Cloud Build

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click **Connect Repository**
3. Select **GitHub** as the source
4. Authenticate with GitHub (if not already)
5. Select your repository: `your-username/hack-for-social-impact`
6. Click **Connect**

### 2. Create Build Trigger

1. Click **Create Trigger**
2. Configure the trigger:
   - **Name**: `deploy-backend-to-cloud-run`
   - **Description**: `Deploy backend to Cloud Run on push`
   - **Event**: `Push to a branch`
   - **Source**: Select your connected repository
   - **Branch**: `^main$` (⚠️ **IMPORTANT**: Only trigger on main branch to minimize build costs!)
   - **Configuration**: `Cloud Build configuration file (yaml or json)`
   - **Location**: `backend/cloudbuild.yaml`

3. Add **Substitution Variables**:
   - Click **Add Variable**
   - **Variable**: `_ALLOWED_ORIGINS`
   - **Value**: `https://your-frontend-domain.vercel.app`

4. Click **Create**

### 3. Grant Cloud Build Permissions

Cloud Build needs permissions to deploy to Cloud Run:

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")

# Grant Cloud Run Admin role to Cloud Build service account
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Grant Secret Manager access
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 4. Update Existing Trigger (If Already Created)

If you already have a trigger that builds on every branch, update it to save costs:

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Find your `deploy-backend-to-cloud-run` trigger
3. Click the **three dots** (⋮) → **Edit**
4. Under **Branch**, change the regex to: `^main$`
5. Click **Save**

**Cost impact**: This change alone can reduce your Cloud Build costs by 80-90% by avoiding builds on feature branches.

### 5. Test Automated Deployment

```bash
# Make a change and commit
git add .
git commit -m "test: trigger Cloud Build deployment"
git push origin main  # or your branch name
```

**Monitor the build**:
1. Go to [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
2. Watch the build progress
3. Check for errors if build fails

---

## Environment Variables

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key (from Secret Manager) | `AIzaSy...` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `https://app.vercel.app` |
| `DEBUG` | Enable debug mode (should be `False` in production) | `False` |
| `PORT` | Port to run on (auto-set by Cloud Run) | `8080` |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GCS_BUCKET_NAME` | Google Cloud Storage bucket for file uploads | `my-bucket` |

### Setting Environment Variables

#### Via gcloud CLI

```bash
# Update environment variables
gcloud run services update backend-api \
  --region us-central1 \
  --set-env-vars DEBUG=False,ALLOWED_ORIGINS=https://app.vercel.app
```

#### Via Google Cloud Console

1. Go to [Cloud Run Services](https://console.cloud.google.com/run)
2. Click on `backend-api`
3. Click **Edit & Deploy New Revision**
4. Scroll to **Variables & Secrets**
5. Add/update environment variables
6. Click **Deploy**

---

## Updating Deployments

### Update Code and Redeploy

```bash
# Manual update
gcloud run deploy backend-api \
  --source . \
  --region us-central1

# Automated (just push to GitHub)
git push origin main
```

### Update Environment Variables Only

```bash
gcloud run services update backend-api \
  --region us-central1 \
  --set-env-vars ALLOWED_ORIGINS=https://new-domain.vercel.app
```

### Update Secrets

```bash
# Add new version of secret
echo -n "NEW_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Redeploy to pick up new secret version
gcloud run deploy backend-api --source . --region us-central1
```

### Rollback to Previous Revision

```bash
# List revisions
gcloud run revisions list --service backend-api --region us-central1

# Rollback to specific revision
gcloud run services update-traffic backend-api \
  --region us-central1 \
  --to-revisions=backend-api-00001-abc=100
```

---

## Viewing Logs

### Via gcloud CLI

```bash
# Stream logs in real-time
gcloud run services logs tail backend-api --region us-central1

# View recent logs
gcloud run services logs read backend-api --region us-central1 --limit 50
```

### Via Google Cloud Console

1. Go to [Cloud Run Services](https://console.cloud.google.com/run)
2. Click on `backend-api`
3. Click **Logs** tab
4. Use filters to search logs:
   - Severity: Error, Warning, Info
   - Time range
   - Text search

### Via Cloud Logging

1. Go to [Cloud Logging](https://console.cloud.google.com/logs)
2. Use query:
   ```
   resource.type="cloud_run_revision"
   resource.labels.service_name="backend-api"
   ```

---

## Troubleshooting

### Common Issues

#### 1. "Permission denied" errors

**Problem**: Cloud Build or Cloud Run lacks permissions.

**Solution**:
```bash
# Grant permissions (see Automated Deployment section)
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"
```

#### 2. "Secret not found" errors

**Problem**: GEMINI_API_KEY secret not created or permissions not granted.

**Solution**:
```bash
# Create secret (see Secret Manager Setup section)
echo -n "YOUR_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### 3. CORS errors in frontend

**Problem**: ALLOWED_ORIGINS not configured correctly.

**Solution**:
```bash
# Update ALLOWED_ORIGINS with exact Vercel URL (including https://)
gcloud run services update backend-api \
  --region us-central1 \
  --set-env-vars ALLOWED_ORIGINS=https://your-app.vercel.app
```

#### 4. Container fails to start

**Problem**: Application error, missing dependencies, or port mismatch.

**Solution**:
```bash
# Check logs for errors
gcloud run services logs tail backend-api --region us-central1

# Common fixes:
# - Ensure Dockerfile uses $PORT environment variable
# - Check all dependencies are in pyproject.toml
# - Test Docker image locally first
```

#### 5. Build timeout errors

**Problem**: Cloud Build takes too long (default 10 min timeout).

**Solution**: Increase timeout in `cloudbuild.yaml`:
```yaml
timeout: '1200s'  # 20 minutes
```

#### 6. "Service not found" errors

**Problem**: Wrong region or service name.

**Solution**:
```bash
# List all services
gcloud run services list

# Use correct region and service name
gcloud run services describe backend-api --region us-central1
```

---

## Cost Optimization

### Free Tier Limits

**Cloud Run** (free tier includes):
- 2 million requests/month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds
- 1 GB network egress (North America)

**Cloud Build** (free tier includes):
- 120 build-minutes per day
- After that: $0.003 per build-minute

### Tips to Stay Within Free Tier

#### Cloud Run Optimization (Already Configured ✅)

1. **Scale to zero**: Set `--min-instances=0` (already configured)
2. **Optimize memory**: Use `512Mi` instead of 1Gi (already configured)
3. **Reduce cold starts**: Accept slower first request (or upgrade to paid tier)

#### Cloud Build Optimization (Cost-Saving Updates Applied ✅)

1. **Build only on main branch**: Avoid triggering builds on feature branches (configured)
2. **Use default E2 machine**: Default machine uses 1 build-minute per actual minute
   - Previous N1_HIGHCPU_8: Used 8 build-minutes per actual minute (8x more expensive)
3. **Batch commits**: Push multiple commits together instead of individually
4. **Test locally first**: Use `docker build` locally before pushing to main

**Estimated monthly cost with optimizations**: $0.00 (within free tier for typical usage of 1-3 builds/day)

#### Monitor Usage

Set up [budget alerts](https://console.cloud.google.com/billing/budgets) to get notified if you approach paid tier:
- Set alert at $0.50
- Set alert at $1.00
- Review Cloud Build usage in [billing reports](https://console.cloud.google.com/billing)

---

## Security Best Practices

1. ✅ **Use Secret Manager** for API keys (not environment variables)
2. ✅ **Set specific ALLOWED_ORIGINS** (not `*`)
3. ✅ **Run as non-root user** in Docker (already configured in Dockerfile)
4. ✅ **Enable Cloud Armor** for DDoS protection (optional, costs extra)
5. ✅ **Use HTTPS only** (Cloud Run enforces this automatically)
6. ✅ **Limit IAM permissions** to minimum required
7. ✅ **Enable audit logs** to track access

---

## Useful Commands Reference

```bash
# Service information
gcloud run services describe backend-api --region us-central1

# List all services
gcloud run services list

# Delete service
gcloud run services delete backend-api --region us-central1

# View service URL
gcloud run services describe backend-api --region us-central1 --format="value(status.url)"

# List secrets
gcloud secrets list

# View build history
gcloud builds list --limit=10

# Stream logs
gcloud run services logs tail backend-api --region us-central1

# Get service metrics
gcloud run services describe backend-api --region us-central1 --format="value(status.traffic)"
```

---

## Next Steps

After deploying:

1. **Test all endpoints** with your Cloud Run URL
2. **Update frontend** `VITE_API_BASE_URL` to point to Cloud Run URL
3. **Deploy frontend** to Vercel (see `/frontend/DEPLOYMENT.md`)
4. **Test end-to-end** from frontend to backend
5. **Set up monitoring** and budget alerts
6. **Configure custom domain** (optional)

---

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Troubleshooting Cloud Run](https://cloud.google.com/run/docs/troubleshooting)
