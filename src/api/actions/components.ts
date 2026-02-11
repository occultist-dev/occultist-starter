  import {readFile} from "node:fs/promises";
import {resolve} from 'node:path';
import {registry} from "../registry.ts";
import {componentsDir} from "../../config.ts";


registry.http.get('/components/site-search')
  .public()
  .handle('text/longform', await readFile(resolve(componentsDir, 'site-search-dialog.lf')))

