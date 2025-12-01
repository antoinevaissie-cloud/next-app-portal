import { App } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Edit } from "lucide-react";

interface AppCardProps {
  app: App;
  onEdit: (app: App) => void;
}

export function AppCard({ app, onEdit }: AppCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          {app.logoUrl ? (
            <img src={app.logoUrl} alt={app.appName} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {app.appName.charAt(0)}
            </div>
          )}
          <CardTitle className="text-lg font-bold">{app.appName}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onEdit(app)}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={app.productionUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </a>
        </Button>
        {app.githubRepoUrl && (
          <Button variant="ghost" size="sm" asChild>
            <a href={app.githubRepoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Repo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
