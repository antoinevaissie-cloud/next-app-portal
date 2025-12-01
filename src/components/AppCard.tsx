import { App } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Edit, Trash2 } from "lucide-react";

interface AppCardProps {
  app: App;
  onEdit: (app: App) => void;
  onDelete?: (appId: string) => void;
  onOpen?: (app: App) => void;
}

export function AppCard({ app, onEdit, onDelete, onOpen }: AppCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {app.logoUrl ? (
            <img
              src={app.logoUrl}
              alt={app.appName}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 font-bold text-base sm:text-lg flex-shrink-0">
              {app.appName.charAt(0)}
            </div>
          )}
          <CardTitle className="text-sm sm:text-base font-semibold text-white truncate">
            {app.appName}
          </CardTitle>
        </div>
        <div className="flex gap-0.5 sm:gap-1 flex-shrink-0 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(app)}
            className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(app.id)}
              className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">{app.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 px-4 pb-4 gap-2">
        <Button
          size="sm"
          asChild
          className="bg-emerald-600 hover:bg-emerald-500 text-white border-0"
          onClick={() => onOpen?.(app)}
        >
          <a href={app.productionUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </a>
        </Button>
        {app.githubRepoUrl && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <a
              href={app.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              Repo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
