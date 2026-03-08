import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { headers } from "next/headers";

const COLLECTION = "apps";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("sortOrder", "asc")
      .get();

    const apps = snapshot.docs.map((doc) => {
      const data = doc.data();
      const iconSlug = data.iconSlug || "default";
      return {
        id: doc.id,
        appName: data.appName,
        productionUrl: data.productionUrl,
        iconUrl: `${baseUrl}/icons/${iconSlug}.svg`,
        iconColor: data.iconColor || "#64748b",
      };
    });

    return NextResponse.json(apps, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching widget apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
