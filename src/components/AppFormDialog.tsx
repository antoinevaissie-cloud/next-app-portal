import { useState, useEffect } from "react";
import { App } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AppFormDialogProps {
  app?: App | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: App) => void;
}

export function AppFormDialog({ app, isOpen, onClose, onSave }: AppFormDialogProps) {
  const [formData, setFormData] = useState<Partial<App>>({});

  useEffect(() => {
    if (app) {
      setFormData(app);
    } else {
      setFormData({});
    }
  }, [app, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: app?.id || Math.random().toString(36).substr(2, 9),
      lastUsedAt: app?.lastUsedAt || new Date(),
      ...formData,
    } as App);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{app ? "Edit App" : "Add New App"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName">App Name</Label>
            <Input
              id="appName"
              value={formData.appName || ""}
              onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productionUrl">Production URL</Label>
            <Input
              id="productionUrl"
              type="url"
              value={formData.productionUrl || ""}
              onChange={(e) => setFormData({ ...formData, productionUrl: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubRepoUrl">GitHub Repo URL (Optional)</Label>
            <Input
              id="githubRepoUrl"
              type="url"
              value={formData.githubRepoUrl || ""}
              onChange={(e) => setFormData({ ...formData, githubRepoUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo (Optional)</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, logoUrl: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {formData.logoUrl && (
              <div className="mt-2">
                <img src={formData.logoUrl} alt="Logo preview" className="w-16 h-16 object-cover rounded" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
