import {readdir} from "node:fs/promises";
import {actionsDir, port} from "../config.ts";
import {registry} from "./registry.ts";
import {resolve} from "node:path";


for (const file of await readdir(actionsDir)) {
  await import(resolve(actionsDir, file));
}

Deno.serve({
  port,
  onListen(addr) {
    console.log(`Listening on http://${addr.hostname}:${addr.port}`);

    registry.finalize();
  },
}, (req) => registry.handleRequest(req));

