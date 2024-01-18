import { resolve } from "node:path";
import { loadConfig } from "c12";
import simpleGit from "simple-git";
import { resolvePath } from "@bernankez/utils/node";
import { log } from "./log";
import type { GitSyncConfig } from ".";

const { __dirname } = resolvePath(import.meta.url);

async function run() {
  const { config } = await loadConfig<GitSyncConfig>({
    name: "gitsync",
    // TODO defaults to process.cwd()
    // pass from cli
    cwd: resolve(__dirname, "..", "fixtures"),
    defaultConfig: {
      remoteName: "origin",
    },
  });
  if (!config) {
    log.error("No config found.");
    process.exit();
  }
  if (!config.url || config.url.length === 0) {
    log.error("No url found.");
    process.exit();
  }
  log.message("[git-sync: start]");
  log.success("Config loaded.");
  for (const prop in config) {
    const value = config[prop as keyof GitSyncConfig];
    if (typeof value === "string") {
      log.info(`${prop}: ${value}`);
    } else if (Array.isArray(value)) {
      value.forEach((v) => {
        log.info(`${prop}: ${v}`);
      });
    }
  }
  // TODO set cwd
  // pass from cli or config file
  const git = simpleGit();
  await git.init();
  try {
    await git.addRemote(config.remoteName!, config.fetch || config.url[0]);
  } catch (e) {
    // already exits, ignore
  }
  for (const url of config.url) {
    try {
      await git.remote(["set-url", "--add", config.remoteName!, url]);
    } catch (e) {
      // already exits, ignore
    }
  }
  console.log("git remote -v");
  console.log(await git.remote(["-v"]));
  log.message("[git-sync: complete]");
}

run();
