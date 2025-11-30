import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/verify-token";
import { FirebaseError } from "firebase/app";

const COLLECTION = "users";

export async function GET() {
  const auth = await verifyToken();
  if (!auth.success) return auth.response;
  
  try {
    // Get all users from Firestore users collection
    // Try to order by createdAt, but if the field doesn't exist, just get all users
    let snapshot;
    try {
      snapshot = await adminDb
        .collection(COLLECTION)
        .orderBy("createdAt", "desc")
        .get();
    } catch (orderError) {
      // If ordering fails (field doesn't exist), just get all users
      snapshot = await adminDb
        .collection(COLLECTION)
        .get();
    }

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Users not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Users fetched successfully",
        data: users,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

