import { resolve } from "node:path";
import { loadConfig } from "c12";
import simpleGit from "simple-git";
import { cac } from "cac";
import { version } from "../package.json";
import { log } from "./log";
import type { GitSyncConfig } from ".";

interface GitSyncOptions {
  cwd?: string;
  gitBaseDir?: string;
}

function run() {
  const cli = cac("git-sync");
  cli.option("--config <path>", "git-sync config path")
    .option("--git <path>", "Git base dir")
    .help()
    .version(version);
  const { options } = cli.parse();
  gitSync({ cwd: options.cwd, gitBaseDir: options.gitBaseDir });
}

async function gitSync(options: GitSyncOptions) {
  const cwd = typeof options.cwd === "string" ? resolve(process.cwd(), options.cwd) : process.cwd();
  const { config } = await loadConfig<GitSyncConfig>({
    name: "gitsync",
    cwd,
    defaultConfig: {
      remoteName: "origin",
    },
  });
  if (!config) {
    log.error("[git-sync] No config found. Pass");
    process.exit();
  }
  if (!config.url || config.url.length === 0) {
    log.error("[git-sync] No url found.");
    process.exit(1);
  }
  log.message("[git-sync: start]");
  const gitBaseDir = typeof options.gitBaseDir === "string"
    ? resolve(process.cwd(), options.gitBaseDir)
    : config.gitBaseDir
      ? resolve(process.cwd(), config.gitBaseDir)
      : process.cwd();
  const git = simpleGit({
    baseDir: gitBaseDir,
  });
  await git.init();
  if (config.fetch) {
    await git.addRemote(config.remoteName!, config.fetch).catch(() => {
      // remote exits, ignore
    });
  }
  const remote = await git.remote(["-v"]) || "";
  for (const url of config.url) {
    const regex = new RegExp(`^${config.remoteName}\\s+${url}`, "m");
    if (regex.test(remote)) {
      continue;
    }
    await git.remote(["set-url", "--add", config.remoteName!, url]);
  }
  console.log("git remote -v");
  console.log(await git.remote(["-v"]));
  log.message("[git-sync: complete]");
}

run();
