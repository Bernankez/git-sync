import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/index",
  ],
  // TODO export only one declaration file
  // export cli file
  // set bin
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});
