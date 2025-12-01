import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Note: Wildcard hostname allows user-provided logo URLs.
    // This is intentional for this admin-only portal with restricted access.
    // For public apps, restrict to specific domains.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
