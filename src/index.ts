export interface GitSyncConfig {
  /** remote name, defaults to origin */
  remoteName?: string;
  /** this will set to origin url if git not init. If not set, will use the first item in url */
  fetch?: string;
  /** git urls that you want to push to */
  url?: string[];
}

export function defineConfig(config: GitSyncConfig) {
  return config;
}
