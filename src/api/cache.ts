import {FileCache, MemoryCache} from "@occultist/occultist";
import {resolve} from "node:path";
import {registry} from "./registry.ts";
import {cacheDir} from "../config.ts";


export const memoryCache = new MemoryCache(registry, {
  allowLocking: true,
});

export const fileCache = new FileCache(
  registry,
  resolve(cacheDir, 'meta.json'),
  cacheDir,
);

