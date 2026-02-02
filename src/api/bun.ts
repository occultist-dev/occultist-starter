
import {readdir} from "node:fs/promises";
import {actionsDir, port} from "../config.ts";
import {registry} from "./registry.ts";
import {resolve} from "node:path";


for (const file of await readdir(actionsDir)) {
  await import(resolve(actionsDir, file));
}

const server = Bun.serve({
  port,
  fetch(req) {
    return registry.handleRequest(req);
  },
});

console.log(`Listening on http://${server.hostname}:${server.port}`);

registry.finalize();
