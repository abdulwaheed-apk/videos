import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/session - Create session cookie
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 },
      );
    }

    // Verify the ID token
    console.log("idToken", idToken);
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Set session cookie (expires in 14 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days in milliseconds

    const cookieStore = await cookies();
    cookieStore.set("firebase-token", idToken, {
      maxAge: expiresIn / 1000, // maxAge is in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      },
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 },
    );
  }
}

// DELETE /api/auth/session - Clear session cookie (logout)
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebase-token");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}

// GET /api/auth/session - Verify current session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Verify token
    const decodedToken = await adminAuth.verifyIdToken(token);

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);

    // Clear invalid token
    const cookieStore = await cookies();
    cookieStore.delete("firebase-token");

    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
