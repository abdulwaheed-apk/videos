import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/verify-token";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { FirebaseError } from "firebase/app";

// Define the structure for the dynamic route parameters
interface Params {
  params: Promise<{
    id: string;
  }>;
}

// ----------------------------------------------------
// DELETE /api/users/[id] - Delete a single user
// ----------------------------------------------------
export async function DELETE(request: Request, { params }: Params) {
  const auth = await verifyToken();
  if (!auth.success) return auth.response;

  const { id } = await params;

  try {
    // Get user document from Firestore
    const userRef = adminDb.collection("users").doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const userData = doc.data();
    const uid = userData?.uid;

    // Delete user from Firebase Auth if uid exists
    if (uid) {
      try {
        await adminAuth.deleteUser(uid);
      } catch (authError) {
        console.error("Error deleting user from Auth:", authError);
        // Continue with Firestore deletion even if Auth deletion fails
      }
    }

    // Delete user document from Firestore
    await userRef.delete();

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
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

