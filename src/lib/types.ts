export interface App {
  id: string;
  appName: string;
  description: string;
  productionUrl: string;
  githubRepoUrl?: string;
  logoUrl?: string;
  lastUsedAt: Date;
}
