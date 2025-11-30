import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

interface VerifyTokenResult {
  success: true;
  uid: string;
  email: string | undefined;
}

interface VerifyTokenError {
  success: false;
  response: NextResponse;
}

/*
 * Reusable function to verify Firebase token from cookies
 * Use this in all your API routes instead of repeating the same code
 * @returns Object with success status and either user data or error response
 */
export async function verifyToken(): Promise<
  VerifyTokenResult | VerifyTokenError
> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;

    if (!token) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, message: "Unauthorized - No token provided" },
          { status: 401 },
        ) as NextResponse<any>,
      };
    }

    // Verify token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);

    return {
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error) {
    console.error("Token verification error:", error);

    // Clear invalid token
    const cookieStore = await cookies();
    cookieStore.delete("firebase-token");

    return {
      success: false,
      response: NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 },
      ),
    };
  }
}

/**
 * Alternative version that throws an error instead of returning NextResponse
 * Useful if you prefer try-catch pattern
 */
export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) {
    throw new Error("Unauthorized - No token provided");
  }

  const decodedToken = await adminAuth.verifyIdToken(token);

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    token: decodedToken,
  };
}
