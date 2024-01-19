export interface GitSyncConfig {
  /** Remote name, defaults to origin */
  remoteName?: string;
  /** If remoteName is not added, fetch will be used as the parameter when adding remote */
  fetch?: string;
  /** Git urls that you want to push to */
  url?: string[];
  /** Git base dir. Can also pass from CLI. Dir from CLI has higher priority */
  gitBaseDir?: string;
}

export function defineConfig(config: GitSyncConfig) {
  return config;
}
