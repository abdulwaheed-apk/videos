# Fix "illegal base64 data" Error in Cloud Build

## The Problem

The error `illegal base64 data at input byte 8` occurs when:
1. The secret stored in KMS is not properly base64-encoded
2. The KMS key path is incorrect or uses substitutions (which don't work)

## Solution 1: Use Secret Manager (Recommended - Easiest)

**Switch to `cloudbuild-simple.yaml` which uses Secret Manager:**

```bash
# 1. Store your service account JSON directly (no encoding needed)
gcloud secrets create firebase_sa_key \
  --data-file=path/to/service-account.json \
  --project=ghost-money-world

# 2. Grant Cloud Build service account access
# Find your Cloud Build service account email:
# Format: PROJECT_NUMBER@cloudbuild.gserviceaccount.com
PROJECT_NUMBER=$(gcloud projects describe ghost-money-world --format="value(projectNumber)")
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud secrets add-iam-policy-binding firebase_sa_key \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role=roles/secretmanager.secretAccessor \
  --project=ghost-money-world

# 3. Update your Cloud Build trigger to use cloudbuild-simple.yaml
```

## Solution 2: Fix KMS Secret Storage

If you want to use KMS, you must store the secret correctly:

```bash
# 1. Base64 encode your service account JSON
cat service-account.json | base64 -w 0 > sa-base64.txt

# 2. Create KMS key ring and key (if not exists)
gcloud kms keyrings create cloud-build-secrets \
  --location=global \
  --project=ghost-money-world

gcloud kms keys create firebase-service-account \
  --keyring=cloud-build-secrets \
  --location=global \
  --purpose=encryption \
  --project=ghost-money-world

# 3. Encrypt the base64-encoded data
gcloud kms encrypt \
  --plaintext-file=sa-base64.txt \
  --ciphertext-file=sa-encrypted.enc \
  --key=firebase-service-account \
  --keyring=cloud-build-secrets \
  --location=global \
  --project=ghost-money-world

# 4. Create the secret in Cloud Build with the encrypted file
# Note: You'll need to do this through the Cloud Console or API
# The secret name should be: firebase_sa_key
```

## Solution 3: Update KMS Key Path

Make sure the `kmsKeyName` in `cloudbuild.yaml` uses your actual project ID (not a substitution):

```yaml
secrets:
  - kmsKeyName: projects/ghost-money-world/locations/global/keyRings/cloud-build-secrets/cryptoKeys/firebase-service-account
    secretEnv:
      FIREBASE_SERVICE_ACCOUNT: firebase_sa_key
```

**Important**: Replace `ghost-money-world` with your actual project ID, and update the keyring/key names if different.

## Verify Your Setup

```bash
# For Secret Manager:
gcloud secrets versions access latest --secret=firebase_sa_key --project=ghost-money-world

# For KMS (check if key exists):
gcloud kms keys list --keyring=cloud-build-secrets --location=global --project=ghost-money-world
```

## Recommended Approach

**Use Secret Manager (`cloudbuild-simple.yaml`)** because:
- ✅ No base64 encoding needed
- ✅ Simpler setup
- ✅ Easier to update secrets
- ✅ Better error messages
- ✅ No KMS key management needed

