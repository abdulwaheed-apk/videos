import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/auth/verify-token";
import { CategorySchema } from "@/schemas/category.schema";
import { adminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";
import { FirebaseError } from "firebase/app";

// Define the structure for the dynamic route parameters
interface Params {
    params: Promise<{
        id: string;
    }>;
}

// ----------------------------------------------------
// GET /api/categories/[id] - Get a single category
// ----------------------------------------------------
export async function GET(request: Request, { params }: Params) {
    const auth = await verifyToken();
    if (!auth.success) return auth.response;

    const { id } = await params;

    try {
        const doc = await adminDb.collection("categories").doc(id).get();

        if (!doc.exists) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 },
            );
        }

        const category = {
            id: doc.id,
            ...doc.data(),
        };

        return NextResponse.json(
            {
                success: true,
                message: "Category fetched successfully",
                data: category,
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
// PATCH /api/categories/[id] - Update a single category
// ----------------------------------------------------
export async function PATCH(request: Request, { params }: Params) {
    const auth = await verifyToken();
    if (!auth.success) return auth.response;

    const { id } = await params;

    try {
        const body = await request.json();

        // 1. Validate the incoming body using a partial schema (only allow fields that can be updated)
        // NOTE: CategorySchema().partial() creates a schema where all fields are optional.
        const validationResult = CategorySchema().partial().safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { errors: validationResult.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        const updates = validationResult.data;

        // Check if the category exists before attempting to update
        const categoryRef = adminDb.collection("categories").doc(id);
        const doc = await categoryRef.get();

        if (!doc.exists) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 },
            );
        }

        // 2. Prepare update data, adding a server timestamp
        const updateData = {
            ...updates,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // 3. Perform the update
        await categoryRef.update(updateData);

        // 4. Fetch the updated document to return the latest state
        const updatedDoc = await categoryRef.get();
        const updatedCategory = {
            id: updatedDoc.id,
            ...updatedDoc.data(),
        };

        return NextResponse.json(
            {
                success: true,
                message: "Category updated successfully",
                data: updatedCategory,
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
// DELETE /api/categories/[id] - Delete a single category
// ----------------------------------------------------
export async function DELETE(request: Request, { params }: Params) {
    const auth = await verifyToken();
    if (!auth.success) return auth.response;

    const { id } = await params;

    try {
        const categoryRef = adminDb.collection("categories").doc(id);

        const doc = await categoryRef.get();
        if (!doc.exists) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 },
            );
        }

        // Find all videos associated with this category
        const videosSnapshot = await adminDb
            .collection("videos")
            .where("category", "==", id)
            .get();

        // Delete all associated videos (this will trigger their asset deletion via the video DELETE endpoint)
        const videoDeletePromises = videosSnapshot.docs.map(async (videoDoc) => {
            const videoData = videoDoc.data();
            const thumbnailUrl = videoData?.thumbnail;
            const videoUrl = videoData?.video;

            // Import delete utility
            const { deleteFilesFromStorage } = await import("@/lib/firebase/firebase-delete");

            // Delete assets from storage
            if (thumbnailUrl || videoUrl) {
                await deleteFilesFromStorage([thumbnailUrl, videoUrl]);
            }

            // Delete the video document
            return videoDoc.ref.delete();
        });

        await Promise.all(videoDeletePromises);

        // Delete the category document
        await categoryRef.delete();

        const deletedVideosCount = videosSnapshot.docs.length;
        const message = deletedVideosCount > 0
            ? `Category and ${deletedVideosCount} associated video(s) deleted successfully`
            : "Category deleted successfully";

        return NextResponse.json(
            { success: true, message },
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

