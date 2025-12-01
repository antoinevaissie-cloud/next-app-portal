import { useState, useEffect } from "react";
import { App } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AppFormDialogProps {
  app?: App | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: App) => void;
  isSaving?: boolean;
}

export function AppFormDialog({
  app,
  isOpen,
  onClose,
  onSave,
  isSaving = false,
}: AppFormDialogProps) {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-[95vw] sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">
            {app ? "Edit App" : "Add New App"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName" className="text-slate-300">
              App Name
            </Label>
            <Input
              id="appName"
              value={formData.appName || ""}
              onChange={(e) =>
                setFormData({ ...formData, appName: e.target.value })
              }
              required
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productionUrl" className="text-slate-300">
              Production URL
            </Label>
            <Input
              id="productionUrl"
              type="url"
              value={formData.productionUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, productionUrl: e.target.value })
              }
              required
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubRepoUrl" className="text-slate-300">
              GitHub Repo URL (Optional)
            </Label>
            <Input
              id="githubRepoUrl"
              type="url"
              value={formData.githubRepoUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, githubRepoUrl: e.target.value })
              }
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl" className="text-slate-300">
              Logo URL (Optional)
            </Label>
            <Input
              id="logoUrl"
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logoUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500"
            />
            {formData.logoUrl && (
              <div className="mt-2">
                <img
                  src={formData.logoUrl}
                  alt="Logo preview"
                  className="w-16 h-16 object-cover rounded-lg bg-slate-700"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
