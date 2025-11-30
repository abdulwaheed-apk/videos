import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/verify-token";
import { BackendVideoSchema } from "@/schemas/video.schema";
import { adminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";
import { FirebaseError } from "firebase/app";
import { deleteFilesFromStorage } from "@/lib/firebase/firebase-delete";

// Define the structure for the dynamic route parameters
interface Params {
  params: Promise<{
    id: string;
  }>;
}

// ----------------------------------------------------
// GET /api/videos/[id] - Get a single video
// ----------------------------------------------------
export async function GET(request: Request, { params }: Params) {
  const auth = await verifyToken();
  if (!auth.success) return auth.response;

  const { id } = await params;

  try {
    const doc = await adminDb.collection("videos").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 },
      );
    }

    const video = {
      id: doc.id,
      ...doc.data(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Video fetched successfully",
        data: video,
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

// ----------------------------------------------------
// PATCH /api/videos/[id] - Update a single video
// ----------------------------------------------------
export async function PATCH(request: Request, { params }: Params) {
  const auth = await verifyToken();
  if (!auth.success) return auth.response;

  const { id } = await params;

  try {
    const body = await request.json();

    // Extract old asset URLs before validation (these are internal fields)
    const oldThumbnailUrl = (body as any)?._oldThumbnailUrl;
    const oldVideoUrl = (body as any)?._oldVideoUrl;

    // Remove internal fields before validation
    const { _oldThumbnailUrl, _oldVideoUrl, ...bodyForValidation } = body as any;

    // Validate the incoming body using a partial schema
    const validationResult = BackendVideoSchema().partial().safeParse(bodyForValidation);

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const updates = validationResult.data;

    // Check if the video exists before attempting to update
    const videoRef = adminDb.collection("videos").doc(id);
    const doc = await videoRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 },
      );
    }

    // Prepare update data, adding a server timestamp
    const updateData = {
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Perform the update
    await videoRef.update(updateData);

    // Delete old assets after successful update (if they were replaced)
    if (oldThumbnailUrl || oldVideoUrl) {
      // Delete asynchronously - don't wait for it to complete
      deleteFilesFromStorage([oldThumbnailUrl, oldVideoUrl]).catch((error) => {
        console.error("Error deleting old assets:", error);
        // Don't fail the request if asset deletion fails
      });
    }

    // Fetch the updated document to return the latest state
    const updatedDoc = await videoRef.get();
    const updatedVideo = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Video updated successfully",
        data: updatedVideo,
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

// ----------------------------------------------------
// DELETE /api/videos/[id] - Delete a single video
// ----------------------------------------------------
export async function DELETE(request: Request, { params }: Params) {
  const auth = await verifyToken();
  if (!auth.success) return auth.response;

  const { id } = await params;

  try {
    const videoRef = adminDb.collection("videos").doc(id);

    const doc = await videoRef.get();
    if (!doc.exists) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 },
      );
    }

    const videoData = doc.data();
    
    // Extract thumbnail and video URLs
    const thumbnailUrl = videoData?.thumbnail;
    const videoUrl = videoData?.video;

    // Delete files from Firebase Storage if they exist
    if (thumbnailUrl || videoUrl) {
      await deleteFilesFromStorage([thumbnailUrl, videoUrl]);
    }

    // Delete the Firestore document
    await videoRef.delete();

    return NextResponse.json(
      { success: true, message: "Video deleted successfully" },
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

