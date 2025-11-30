// Server-side ONLY
import * as admin from "firebase-admin";

console.log(
  "🔐 FIREBASE_SERVICE_ACCOUNT:",
  !!process.env.FIREBASE_SERVICE_ACCOUNT,
);
console.log("🔐 FIREBASE_ENV_FILE:", !!process.env.FIREBASE_ENV_FILE);

let adminApp: admin.app.App | null = null;

// Prevent multiple inits in serverless environment
if (!admin.apps.length) {
  try {
    const rawCreds =
      process.env.FIREBASE_SERVICE_ACCOUNT ||
      process.env.FIREBASE_CREDENTIALS ||
      process.env.FIREBASE_ENV_FILE;

    if (!rawCreds) {
      console.warn(
        "⚠️ Firebase credentials not found — likely running during build phase. Skipping initialization.",
      );
    } else {
      const serviceAccount = JSON.parse(rawCreds);

      if (!serviceAccount.project_id || !serviceAccount.private_key) {
        throw new Error("Invalid Firebase service account configuration");
      }

      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );

      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });

      console.log("✅ Firebase Admin initialized successfully");
    }
  } catch (err: any) {
    console.error("🔥 Firebase Admin init failed:", err.message);
  }
} else {
  adminApp = admin.app();
}

// Return stubs instead of nulls to prevent type errors during build
const safeAuth: admin.auth.Auth = adminApp
  ? adminApp.auth()
  : ({
      verifyIdToken: async () => {
        console.warn("⚠️ Skipping verifyIdToken — adminAuth not initialized");
        return {} as admin.auth.DecodedIdToken;
      },
      createSessionCookie: async () => {
        console.warn(
          "⚠️ Skipping createSessionCookie — adminAuth not initialized",
        );
        return "";
      },
    } as unknown as admin.auth.Auth);

const safeFirestore: admin.firestore.Firestore = adminApp
  ? adminApp.firestore()
  : ({} as admin.firestore.Firestore);

const safeStorage: admin.storage.Storage = adminApp
  ? adminApp.storage()
  : ({} as admin.storage.Storage);

export const adminAuth = safeAuth;
export const adminDb = safeFirestore;
export const adminStorage = safeStorage;

export default adminApp;

export const ServerTimestamp = admin.firestore.FieldValue.serverTimestamp;
