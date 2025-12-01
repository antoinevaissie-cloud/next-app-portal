"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { App } from "@/lib/types";
import { AppCard } from "@/components/AppCard";
import { AppFormDialog } from "@/components/AppFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogOut, Loader2, RefreshCw } from "lucide-react";

interface ApiApp {
  id: string;
  appName: string;
  description: string;
  productionUrl: string;
  githubRepoUrl?: string | null;
  logoUrl?: string | null;
  lastUsedAt: string;
  createdAt: string;
}

export default function AppPortal() {
  const { data: session, status } = useSession();
  const [apps, setApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchApps = useCallback(async () => {
    try {
      const response = await fetch("/api/apps");
      if (response.ok) {
        const data: ApiApp[] = await response.json();
        const appsWithDates = data.map((app) => ({
          ...app,
          lastUsedAt: new Date(app.lastUsedAt),
          githubRepoUrl: app.githubRepoUrl || undefined,
          logoUrl: app.logoUrl || undefined,
        }));
        setApps(appsWithDates);
      }
    } catch (error) {
      console.error("Error fetching apps:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchApps();
    }
  }, [status, fetchApps]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  const filteredApps = apps.filter(
    (app) =>
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyUsed = [...apps]
    .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
    .slice(0, 3);

  const handleSaveApp = async (app: App) => {
    setIsSaving(true);
    try {
      if (editingApp) {
        // Update existing app
        const response = await fetch(`/api/apps/${app.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(app),
        });
        if (response.ok) {
          setApps(apps.map((a) => (a.id === app.id ? app : a)));
        }
      } else {
        // Create new app
        const response = await fetch("/api/apps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(app),
        });
        if (response.ok) {
          const newApp = await response.json();
          setApps([
            {
              ...newApp,
              lastUsedAt: new Date(newApp.lastUsedAt),
            },
            ...apps,
          ]);
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving app:", error);
    } finally {
      setIsSaving(false);
      setEditingApp(null);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setApps(apps.filter((a) => a.id !== appId));
      }
    } catch (error) {
      console.error("Error deleting app:", error);
    }
  };

  const handleOpenApp = async (app: App) => {
    // Update lastUsedAt in the background
    fetch(`/api/apps/${app.id}`, { method: "PATCH" }).catch(console.error);

    // Update local state
    setApps(
      apps.map((a) =>
        a.id === app.id ? { ...a, lastUsedAt: new Date() } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 sticky top-0 bg-slate-900/80 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="App Portal">🗂️</span>
            <h1 className="text-lg sm:text-xl font-bold">App Portal</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsLoading(true);
                fetchApps();
              }}
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs sm:text-sm text-slate-400 truncate max-w-[150px] sm:max-w-none">{session?.user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50 flex-shrink-0"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search apps..."
            className="pl-12 h-12 text-lg bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Empty State */}
        {apps.length === 0 && !searchQuery && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 mb-6">
              <svg
                className="w-10 h-10 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No apps yet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Add your first application to get started. You can link to production URLs and GitHub repositories.
            </p>
            <Button
              onClick={() => {
                setEditingApp(null);
                setIsFormOpen(true);
              }}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 h-12 rounded-xl font-medium"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add your first app
            </Button>
          </div>
        )}

        {/* Recently Used */}
        {recentlyUsed.length > 0 && !searchQuery && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300">Recently Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentlyUsed.map((app) => (
                <AppCard
                  key={`recent-${app.id}`}
                  app={app}
                  onEdit={(app) => {
                    setEditingApp(app);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteApp}
                  onOpen={handleOpenApp}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Apps */}
        {apps.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-300">
                {searchQuery ? "Search Results" : "All Apps"}
              </h2>
              <Button
                onClick={() => {
                  setEditingApp(null);
                  setIsFormOpen(true);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add App
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onEdit={(app) => {
                    setEditingApp(app);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteApp}
                  onOpen={handleOpenApp}
                />
              ))}
            </div>
            {filteredApps.length === 0 && searchQuery && (
              <div className="text-center py-12 text-slate-500">
                No apps found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </section>
        )}
      </main>

      <AppFormDialog
        app={editingApp}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
        isSaving={isSaving}
      />
    </div>
  );
}
