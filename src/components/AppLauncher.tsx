"use client";

import { App } from "@/lib/types";
import { AppTile } from "@/components/AppTile";

interface AppLauncherProps {
  apps: App[];
  searchQuery: string;
  onOpen: (app: App) => void;
  onEditApp: (app: App) => void;
}

export function AppLauncher({ apps, searchQuery, onOpen, onEditApp }: AppLauncherProps) {
  const sortedApps = [...apps].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const filteredApps = sortedApps.filter(
    (app) =>
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredApps.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16 text-slate-500">
        No apps found matching &quot;{searchQuery}&quot;
      </div>
    );
  }

  if (filteredApps.length === 0) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex flex-wrap justify-center gap-2">
        {filteredApps.map((app) => (
          <AppTile
            key={app.id}
            app={app}
            onOpen={onOpen}
            onContextMenu={onEditApp}
          />
        ))}
      </div>
    </div>
  );
}
