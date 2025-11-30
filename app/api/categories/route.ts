import { adminDb } from "@/lib/firebase/admin";
import { CategorySchema } from "@/schemas/category.schema";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/verify-token";
import * as admin from "firebase-admin";
import { FirebaseError } from "firebase/app";

export async function GET() {
  const auth = await verifyToken();
  if (!auth.success) return auth.response;
  try {
    const snapshot = await adminDb
      .collection("categories")
      .limit(10)
      .orderBy("createdAt", "desc")
      .get();

    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (categories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Categories not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category fetched successfully",
        data: categories,
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
    const validationResult = CategorySchema().safeParse(body);

    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        { errors: validationResult.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { title, description, isActive } = validationResult.data;

    const categoryRef = adminDb.collection("categories").doc();
    const categoryData = {
      id: categoryRef.id,
      title: title,
      description: description || "",
      isActive: isActive ?? true, // Default to true if not provided
      createdBy: auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await categoryRef.set(categoryData);

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
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
