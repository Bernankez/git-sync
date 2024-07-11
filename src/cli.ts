import { resolve } from "node:path";
import process from "node:process";
import { loadConfig } from "c12";
import simpleGit from "simple-git";
import { cac } from "cac";
import ci from "ci-info";
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
  gitSync({ cwd: options.config, gitBaseDir: options.gitBaseDir });
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
    log.error("[git-sync] No config found. Skipped");
    process.exit();
  }
  if (!config.url || config.url.length === 0) {
    log.error("[git-sync] No url found. Please refer to https://github.com/Bernankez/git-sync?tab=readme-ov-file#configuration-file for config details");
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

if (ci.isCI) {
  log.message("[git-sync] skip in CI");
  process.exit();
}
run();
