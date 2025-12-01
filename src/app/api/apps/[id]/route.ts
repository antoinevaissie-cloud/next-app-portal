import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

const COLLECTION = "apps";

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

// Sanitize string input
function sanitizeString(str: string, maxLength: number = 500): string {
  return str.trim().slice(0, maxLength);
}

// Validate Firestore document ID (alphanumeric and some special chars)
function isValidDocId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id);
}

// PUT - Update an app
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Validate document ID
    if (!isValidDocId(id)) {
      return NextResponse.json({ error: "Invalid app ID" }, { status: 400 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.appName || typeof data.appName !== "string") {
      return NextResponse.json({ error: "App name is required" }, { status: 400 });
    }
    if (!data.description || typeof data.description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }
    if (!data.productionUrl || !isValidUrl(data.productionUrl)) {
      return NextResponse.json({ error: "Valid production URL is required" }, { status: 400 });
    }
    if (data.githubRepoUrl && !isValidUrl(data.githubRepoUrl)) {
      return NextResponse.json({ error: "Invalid GitHub repo URL" }, { status: 400 });
    }
    if (data.logoUrl && !isValidUrl(data.logoUrl)) {
      return NextResponse.json({ error: "Invalid logo URL" }, { status: 400 });
    }

    const updateData = {
      appName: sanitizeString(data.appName, 100),
      description: sanitizeString(data.description, 500),
      productionUrl: data.productionUrl,
      githubRepoUrl: data.githubRepoUrl || null,
      logoUrl: data.logoUrl || null,
      lastUsedAt: new Date().toISOString(),
    };

    await db.collection(COLLECTION).doc(id).update(updateData);

    return NextResponse.json({ id, ...updateData });
  } catch (error) {
    console.error("Error updating app:", error);
    return NextResponse.json({ error: "Failed to update app" }, { status: 500 });
  }
}

// DELETE - Delete an app
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Validate document ID
    if (!isValidDocId(id)) {
      return NextResponse.json({ error: "Invalid app ID" }, { status: 400 });
    }

    await db.collection(COLLECTION).doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting app:", error);
    return NextResponse.json({ error: "Failed to delete app" }, { status: 500 });
  }
}

// PATCH - Update lastUsedAt (when app is opened)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Validate document ID
    if (!isValidDocId(id)) {
      return NextResponse.json({ error: "Invalid app ID" }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db.collection(COLLECTION).doc(id).update({
      lastUsedAt: now,
    });

    return NextResponse.json({ success: true, lastUsedAt: now });
  } catch (error) {
    console.error("Error updating lastUsedAt:", error);
    return NextResponse.json({ error: "Failed to update app" }, { status: 500 });
  }
}
