# Cloud Run Service URL

## Production Service

**Service Name**: `backend-api`
**Region**: `us-central1`
**Service URL**: https://backend-api-375767705771.us-central1.run.app

## Deployment Status

✅ **Successfully Deployed** - 2025-11-09
✅ **CI/CD Pipeline Active** - 2025-11-11

### Automated Deployment

- **Method**: GitHub → Cloud Build → Cloud Run
- **Trigger**: Automatic on push to `main` branch
- **Build Config**: `cloudbuild.yaml`
- **Container**: `Dockerfile` (Python 3.13 + UV)
- **Status**: Fully operational ✅

### Verified Endpoints

- **Root**: https://backend-api-375767705771.us-central1.run.app
  - Response: `{"message":"PDF Processing API with Gemini Integration"}`

- **Health Check**: https://backend-api-375767705771.us-central1.run.app/health
  - Response: `{"status":"healthy","gemini_configured":true}`

- **API Documentation**: https://backend-api-375767705771.us-central1.run.app/docs
  - Interactive Swagger UI

## Configuration

- **Memory**: 512Mi
- **CPU**: 1
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10
- **Timeout**: 60s
- **Authentication**: Public (unauthenticated access allowed)

## Environment Variables

- `GEMINI_API_KEY`: Configured via Secret Manager
- `ALLOWED_ORIGINS`: Set to frontend domain(s)
- `DEBUG`: False
- `PORT`: 8080 (auto-set by Cloud Run)

## Usage

### For Frontend Integration

Update your frontend's `.env` file:

```bash
VITE_API_BASE_URL=https://backend-api-375767705771.us-central1.run.app
```

### Example API Calls

```bash
# Health check
curl https://backend-api-375767705771.us-central1.run.app/health

# Process PDF
curl -X POST https://backend-api-375767705771.us-central1.run.app/api/pdf/process \
  -F "file=@document.pdf" \
  -F "custom_prompt=Summarize this document"
```

## Deployment Workflow

### Automatic Deployment (Recommended)

**Every push to `main` branch automatically:**

1. Triggers Cloud Build
2. Builds Docker image from `Dockerfile`
3. Pushes image to Container Registry (tagged with commit SHA)
4. Deploys to Cloud Run
5. Zero-downtime rolling update

**To deploy**: Simply push/merge to `main`:
```bash
git push origin main
```

**Monitor deployment**:
```bash
# View Cloud Build history
gcloud builds list --limit=5

# View specific build
gcloud builds log <BUILD_ID>
```

### Manual Deployment (If Needed)

```bash
# Deploy from local directory
gcloud run deploy backend-api \
  --source . \
  --region us-central1
```

## Management Commands

```bash
# View service details
gcloud run services describe backend-api --region us-central1

# View logs
gcloud run services logs tail backend-api --region us-central1

# Update environment variable
gcloud run services update backend-api \
  --region us-central1 \
  --update-env-vars ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Delete service
gcloud run services delete backend-api --region us-central1
```

## Next Steps

1. ✅ Backend deployed to Cloud Run
2. ✅ Update frontend `VITE_API_BASE_URL` to this URL
3. ⏳ Deploy frontend to Vercel (or verify deployment)
4. ⏳ Update `ALLOWED_ORIGINS` in Cloud Run to Vercel URL
5. ⏳ Test end-to-end integration

---

**Last Updated**: 2025-11-11 (CI/CD Pipeline Operational)
