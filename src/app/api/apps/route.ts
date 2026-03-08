import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";

const COLLECTION = "apps";

// GET - Fetch all apps
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("lastUsedAt", "desc")
      .get();

    const apps = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching apps:", error);
    return NextResponse.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}

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

// Validate hex color
function isValidHexColor(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

// Validate icon slug
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

// POST - Create a new app
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
    if (data.iconColor && !isValidHexColor(data.iconColor)) {
      return NextResponse.json({ error: "Invalid icon color (must be #RRGGBB)" }, { status: 400 });
    }
    if (data.iconSlug && !isValidSlug(data.iconSlug)) {
      return NextResponse.json({ error: "Invalid icon slug (lowercase alphanumeric and hyphens only)" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const appData = {
      appName: sanitizeString(data.appName, 100),
      description: sanitizeString(data.description, 500),
      productionUrl: data.productionUrl,
      githubRepoUrl: data.githubRepoUrl || null,
      logoUrl: data.logoUrl || null,
      iconSlug: data.iconSlug || null,
      iconColor: data.iconColor || null,
      sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
      lastUsedAt: now,
      createdAt: now,
      createdBy: session.user.email,
    };

    const docRef = await db.collection(COLLECTION).add(appData);

    return NextResponse.json({ id: docRef.id, ...appData }, { status: 201 });
  } catch (error) {
    console.error("Error creating app:", error);
    return NextResponse.json({ error: "Failed to create app" }, { status: 500 });
  }
}
