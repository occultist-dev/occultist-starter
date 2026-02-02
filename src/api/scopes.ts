import {registry} from "./registry.ts";


export const rootScope = registry
  .scope('/actions')
  .public();
