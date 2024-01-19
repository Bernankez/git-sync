export interface GitSyncConfig {
  /** Remote name, defaults to origin */
  remoteName?: string;
  /** If remoteName is not added, fetch will be used as the parameter when adding remote  */
  fetch?: string;
  /** Git urls that you want to push to */
  url?: string[];
}

export function defineConfig(config: GitSyncConfig) {
  return config;
}
