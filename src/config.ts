import {readFile} from "node:fs/promises";
import {join, resolve} from "node:path";

type Config = {
  port: number;
  rootURL: string;
  vocab: string;
  aliases: Record<string, string>;
};

export const projectDir = resolve(import.meta.dirname, '..');
export const nodeModulesDir = resolve(projectDir, 'node_modules');
export const cacheDir = resolve(projectDir, 'tmp');
export const srcDir = resolve(projectDir, 'src');
export const apiDir = resolve(srcDir, 'api');
export const actionsDir = resolve(apiDir, 'actions');
export const appDir = resolve(srcDir, 'app');

const config = JSON.parse(await readFile(join(projectDir, 'occultist.config.json'), 'utf-8')) as Config;

export const port = config.port as number;
export const rootURL: string = config.rootURL as string;

if (!Number.isInteger(port))
  throw new Error('PORT is required');

if (typeof rootURL !== 'string')
  throw new Error('Root URL is required');


export const vocab: string = config.vocab;

export const aliases: Record<string, string> = config.aliases;

if (vocab != null && typeof vocab !== 'string')
  throw new Error(`Invalid rdf.vocab "${vocab}"`);

if (aliases != null) {
  for (const [alias, value] of Object.entries(aliases)) {
    if (alias == null || typeof alias != 'string' || alias.length === 0)
      throw new Error(`Invalid alias "${alias}"`);

    if (value == null || typeof value != 'string' || value.length === 0)
      throw new Error(`Invalid alias value "${value}"`);
  }
}

