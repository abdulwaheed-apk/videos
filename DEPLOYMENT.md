# Firebase App Hosting Deployment Guide

This guide explains how to deploy your Next.js application to Firebase App Hosting using Google Cloud Build.

## Prerequisites

1. **Firebase Project**: Ensure you have a Firebase project set up
2. **Google Cloud Project**: Same as your Firebase project ID
3. **Service Account**: A Firebase service account with App Hosting permissions
4. **Cloud Build API**: Enabled in your GCP project
5. **Secret Manager or KMS**: For storing the Firebase service account key

## Quick Fix for "illegal base64 data" Error

If you're getting the error `illegal base64 data at input byte 8`, it means:
1. **KMS secret is not properly formatted** - The secret needs to be base64-encoded before storing in KMS
2. **KMS key path is incorrect** - Substitutions don't work in kmsKeyName

**Easiest Solution**: Use Secret Manager instead of KMS. Use `cloudbuild-simple.yaml` which uses Secret Manager.

**To switch to Secret Manager:**
```bash
# Store your service account JSON directly (no base64 encoding needed)
gcloud secrets create firebase_sa_key \
  --data-file=path/to/service-account.json \
  --project=ghost-money-world

# Grant Cloud Build access
gcloud secrets add-iam-policy-binding firebase_sa_key \
  --member=serviceAccount:YOUR_CLOUD_BUILD_SERVICE_ACCOUNT@ghost-money-world.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor \
  --project=ghost-money-world
```

Then use `cloudbuild-simple.yaml` instead of `cloudbuild.yaml`.

## Setup Steps

### 1. Create Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file securely

### 2. Store Service Account in Secret Manager (Recommended)

```bash
# Encode the service account JSON to base64
cat path/to/service-account.json | base64 -w 0

# Create secret in Secret Manager
gcloud secrets create firebase_sa_key \
  --data-file=path/to/service-account.json \
  --project=ghost-money-world

# Grant Cloud Build access to the secret
gcloud secrets add-iam-policy-binding firebase_sa_key \
  --member=serviceAccount:YOUR_CLOUD_BUILD_SERVICE_ACCOUNT@ghost-money-world.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor \
  --project=ghost-money-world
```

### 3. Alternative: Use KMS (If you prefer KMS over Secret Manager)

```bash
# Create a key ring (if it doesn't exist)
gcloud kms keyrings create cloud-build-secrets \
  --location=global \
  --project=ghost-money-world

# Create a crypto key
gcloud kms keys create firebase-service-account \
  --keyring=cloud-build-secrets \
  --location=global \
  --purpose=encryption \
  --project=ghost-money-world

# Encrypt and store the service account
echo -n "$(cat path/to/service-account.json | base64)" | \
  gcloud kms encrypt \
  --plaintext-file=- \
  --ciphertext-file=- \
  --key=firebase-service-account \
  --keyring=cloud-build-secrets \
  --location=global \
  --project=ghost-money-world
```

### 4. Update cloudbuild.yaml

Update the following in `cloudbuild.yaml`:

1. **KMS Key Path** (if using KMS):
   ```yaml
   kmsKeyName: projects/ghost-money-world/locations/global/keyRings/cloud-build-secrets/cryptoKeys/firebase-service-account
   ```

2. **Substitutions**: Set your Firebase configuration:
   ```yaml
   substitutions:
     _FIREBASE_PROJECT_ID: 'ghost-money-world'
     _FIREBASE_API_KEY: 'your-api-key'
     _FIREBASE_AUTH_DOMAIN: 'your-auth-domain'
     # ... etc
   ```

### 5. Create Cloud Build Trigger

#### Option A: Using gcloud CLI

```bash
gcloud builds triggers create github \
  --name="deploy-to-app-hosting" \
  --repo-name="YOUR_REPO_NAME" \
  --repo-owner="YOUR_GITHUB_USERNAME" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --project=ghost-money-world \
  --substitutions=_FIREBASE_PROJECT_ID=ghost-money-world,_FIREBASE_API_KEY=your-key,...
```

#### Option B: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to App Hosting
4. Click "Connect Repository"
5. Follow the setup wizard

### 6. Alternative: Simplified cloudbuild.yaml (Using Secret Manager)

If you prefer using Secret Manager instead of KMS, here's a simplified version:

```yaml
steps:
- id: 'Install pnpm'
  name: 'node:20'
  entrypoint: 'bash'
  args: ['-c', 'npm install -g pnpm@latest']

- id: 'Get Secret'
  name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: 'bash'
  args:
    - '-c'
    - |
      gcloud secrets versions access latest --secret=firebase_sa_key > sa-key.json

- id: 'Install Dependencies'
  name: 'node:20'
  entrypoint: 'pnpm'
  args: ['install', '--frozen-lockfile']
  waitFor: ['Install pnpm']

- id: 'Build'
  name: 'node:20'
  entrypoint: 'pnpm'
  args: ['run', 'build']
  waitFor: ['Install Dependencies', 'Get Secret']
  env:
    - 'NEXT_PUBLIC_FIREBASE_API_KEY=${_FIREBASE_API_KEY}'
    - 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${_FIREBASE_AUTH_DOMAIN}'
    - 'NEXT_PUBLIC_FIREBASE_PROJECT_ID=${_FIREBASE_PROJECT_ID}'
    - 'FIREBASE_SERVICE_ACCOUNT=$(cat sa-key.json | base64 -w 0)'
    - 'NODE_ENV=production'

- id: 'Deploy'
  name: 'firebase/cli'
  args: ['deploy', '--only', 'apphosting', '--project', '${_FIREBASE_PROJECT_ID}']
  waitFor: ['Build']
  env:
    - 'GOOGLE_APPLICATION_CREDENTIALS=sa-key.json'
```

## Environment Variables

Make sure to set all required environment variables in your Cloud Build trigger:

- `_FIREBASE_API_KEY`
- `_FIREBASE_AUTH_DOMAIN`
- `_FIREBASE_PROJECT_ID`
- `_FIREBASE_STORAGE_BUCKET`
- `_FIREBASE_MESSAGING_SENDER_ID`
- `_FIREBASE_APP_ID`
- `_FIREBASE_MEASUREMENT_ID`
- `_FIREBASE_SERVICE_ACCOUNT_JSON` (base64 encoded service account JSON)

## Manual Deployment

You can also trigger builds manually:

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_FIREBASE_PROJECT_ID=ghost-money-world,...
```

## Troubleshooting

### Build Fails with "Service Account Not Found"
- Ensure the service account JSON is properly encoded and stored
- Check that Cloud Build has access to the secret/KMS key

### Build Fails with "Permission Denied"
- Grant Cloud Build the necessary IAM roles:
  ```bash
  gcloud projects add-iam-policy-binding ghost-money-world \
    --member=serviceAccount:YOUR_BUILD_SERVICE_ACCOUNT \
    --role=roles/firebase.admin
  ```

### Token Expired Errors
- Ensure `FIREBASE_SERVICE_ACCOUNT` is set correctly during build
- Check that the service account has the correct permissions

## Notes

- The build uses `pnpm` as the package manager (as indicated by `pnpm-lock.yaml`)
- The service account is needed both during build (for server-side code) and deployment
- App Hosting automatically handles Next.js server-side rendering and API routes

