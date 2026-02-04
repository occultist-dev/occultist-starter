import {DevExtension, StaticExtension} from "@occultist/extensions";
import {resolve} from "node:path";
import {aliases, appDir, nodeModulesDir, vocab} from "../config.ts";
import {memoryCache} from "./cache.ts";
import {registry} from "./registry.ts";

export const staticExtension = new StaticExtension({
  registry: registry,
  cache: memoryCache,
});

export const dev = new DevExtension({
  registry,
  vocab,
  aliases,
  appDir,
  nodeModulesDir,
  directories: [
    {
      alias: 'utils',
      path: resolve(appDir, 'utils'),
    },
  ],
  deps: {
    scripts: {
      'uri-templates': resolve(appDir, 'vendor/uri-templates.js'),
      'mithril': resolve(appDir, 'vendor/mithril.js'),
    },
  },
  groups: [
   // {
   //   name: 'todos',
   //   layout: 'todos',
   // },
  ],
});

await registry.setupExtensions();

