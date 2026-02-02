import {Registry} from "@occultist/occultist";
import {rootURL} from "../config.ts";


export const registry = new Registry({
  rootIRI: rootURL,
  cacheHitHeader: true,
  autoRouteParams: true,
});

