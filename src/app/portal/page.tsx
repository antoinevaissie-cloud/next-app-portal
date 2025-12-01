"use client";

import { useState, useEffect } from "react";
import { App } from "@/lib/types";
import { AppCard } from "@/components/AppCard";
import { AppFormDialog } from "@/components/AppFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LogIn, LogOut } from "lucide-react";

export default function AppPortal() {
  const [apps, setApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  // Mock data initialization
  useEffect(() => {
    const mockApps: App[] = [
      {
        id: "1",
        appName: "Task Master",
        description: "A simple yet powerful task management tool.",
        productionUrl: "https://example.com/task-master",
        githubRepoUrl: "https://github.com/example/task-master",
        lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: "2",
        appName: "Weather Dash",
        description: "Beautiful weather dashboard with 7-day forecast.",
        productionUrl: "https://example.com/weather-dash",
        lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
      {
        id: "3",
        appName: "Expense Tracker",
        description: "Track your daily expenses and visualize with charts.",
        productionUrl: "https://example.com/expense-tracker",
        lastUsedAt: new Date(), // Just now
      },
    ];
    setApps(mockApps);
  }, []);

  const filteredApps = apps.filter(
    (app) =>
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyUsed = [...apps]
    .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
    .slice(0, 3);

  const handleSaveApp = (app: App) => {
    if (editingApp) {
      setApps(apps.map((a) => (a.id === app.id ? app : a)));
    } else {
      setApps([...apps, app]);
    }
    setEditingApp(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold">App Portal</h1>
          <Button
            variant="ghost"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="flex items-center space-x-2"
          >
            {isLoggedIn ? (
              <>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search apps..."
            className="pl-10 h-12 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Recently Used */}
        {recentlyUsed.length > 0 && !searchQuery && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Recently Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentlyUsed.map((app) => (
                <AppCard
                  key={`recent-${app.id}`}
                  app={app}
                  onEdit={(app) => {
                    setEditingApp(app);
                    setIsFormOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Apps */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {searchQuery ? "Search Results" : "All Apps"}
            </h2>
            <Button onClick={() => {
              setEditingApp(null);
              setIsFormOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add App
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={(app) => {
                  setEditingApp(app);
                  setIsFormOpen(true);
                }}
              />
            ))}
          </div>
          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No apps found matching "{searchQuery}"
            </div>
          )}
        </section>
      </main>

      <AppFormDialog
        app={editingApp}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
      />
    </div>
  );
}
