"use client";

import { useState, useEffect } from "react";
import { App } from "@/lib/types";

interface AppTileProps {
  app: App;
  onOpen?: (app: App) => void;
  onContextMenu?: (app: App) => void;
}

function AppIcon({ iconSlug, iconColor, appName }: { iconSlug?: string; iconColor?: string; appName: string }) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const color = iconColor || "#64748b";
  const slug = iconSlug || "default";

  useEffect(() => {
    fetch(`/icons/${slug}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then((svg) => setSvgContent(svg))
      .catch(() => setSvgContent(null));
  }, [slug]);

  if (svgContent) {
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  // Fallback: letter icon
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
      style={{ backgroundColor: color }}
    >
      {appName.charAt(0)}
    </div>
  );
}

export function AppTile({ app, onOpen, onContextMenu }: AppTileProps) {
  return (
    <a
      href={app.productionUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onOpen) {
          onOpen(app);
        }
      }}
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          onContextMenu(app);
        }
      }}
      className="group flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-800/60 transition-colors cursor-pointer"
    >
      <AppIcon iconSlug={app.iconSlug} iconColor={app.iconColor} appName={app.appName} />
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors text-center leading-tight max-w-[80px] truncate">
        {app.appName}
      </span>
    </a>
  );
}
