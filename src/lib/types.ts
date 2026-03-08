export interface App {
  id: string;
  appName: string;
  description: string;
  productionUrl: string;
  githubRepoUrl?: string;
  logoUrl?: string;
  iconSlug?: string;
  iconColor?: string;
  sortOrder?: number;
  lastUsedAt: Date;
}

export interface WidgetApp {
  id: string;
  appName: string;
  productionUrl: string;
  iconUrl: string;
  iconColor: string;
}
