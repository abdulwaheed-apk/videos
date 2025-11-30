import { adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/verify-token";
import * as admin from "firebase-admin";
import { FirebaseError } from "firebase/app";
import { BackendVideoSchema } from "@/schemas/video.schema";

const COLLECTION = "videos";

export async function GET() {
  const auth = await verifyToken();
  if (!auth.success) return auth.response;
  try {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .limit(10)
      .orderBy("createdAt", "desc")
      .get();

    const videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (videos?.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Videos Not Found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Videos fetched successfully",
        data: videos,
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

export async function POST(request: Request) {
  const auth = await verifyToken();

  if (!auth.success) return auth.response;

  try {
    const body = await request.json();

    // 2. Server-side validation using Zod
    const validationResult = BackendVideoSchema().safeParse(body);

    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    console.log("validationResult", validationResult);
    const { title, thumbnail, video, duration, category } =
      validationResult.data;

    const categoryRef = adminDb.collection(COLLECTION).doc();
    const categoryData = {
      id: categoryRef.id,
      title: title,
      thumbnail: thumbnail || "",
      video: video,
      duration: duration,
      category: category,
      createdBy: auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await categoryRef.set(categoryData);

    return NextResponse.json(
      {
        success: true,
        message: "Video created successfully",
        data: categoryData,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/id-token-expired") {
        return NextResponse.json(
          { error: "Token expired. Please login again." },
          { status: 401 },
        );
      } else if (error.code === "auth/argument-error") {
        return NextResponse.json(
          { error: "Invalid authentication token" },
          { status: 401 },
        );
      } else
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
