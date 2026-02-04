import {registry} from "../registry.ts";
import {dev} from "../extensions.ts";
import {memoryCache} from "../cache.ts";
import {contextBuilder} from "@occultist/occultist";
import {schemas, typeDefs} from "../typeDefs.ts";
import {rootScope} from "../scopes.ts";
import {readFile} from "node:fs/promises";
import {join} from "node:path";
import {appDir} from "../../config.ts";
import {todoListing} from "./todos.ts";

export const getContext = registry.http.get('/context')
  .public()
  .cache(memoryCache.etag())
  .handle('application/ld+json', ctx => {
    ctx.body = JSON.stringify({
      '@id': ctx.url,
      '@context': contextBuilder({
        vocab: schemas.app,
        aliases: {
          scm: schemas.scm,
          oct: schemas.oct,
        },
        typeDefs: typeDefs,
      }),
    });
  })

registry.http.get('/')
  .public()
  .cache(memoryCache.etag())
  .handle(dev.html('home'))
  .handle('text/longform', async (ctx) => {
    ctx.body = await readFile(join(appDir, 'pages/home.lf'));
  })
  .handle(dev.jsonld({
    name: 'Example API',
    description: 'This is a linked data API.',
    todoListing: todoListing.url(),
    actions: rootScope.url(),
  }))
  .handle(['application/ld+json', 'application/json'], (ctx) => {
    ctx.body = JSON.stringify({
      '@context': getContext.url(),
      '@id': ctx.url,
      name: 'Example API',
      description: 'This is a linked data API.',
      todoListing: todoListing.url(),
      actions: rootScope.url(),
    });
  });

/**
 * Utility endpoint that redirects requests to a javascript module
 * by its es6 import name and returns a 302 redirect to the immutable
 * URL of the javascript resource.
 */
registry.http.get('/scripts/{scriptName}', { autoRouteParams: false })
  .public()
  .define({
    spec: {
      scriptName: {
        dataType: 'string',
        valueName: 'scriptName',
        valueRequired: true,
      },
    },
  })
  .handle('application/javascript', async (ctx) => {
    const asset = registry.getStaticAsset(ctx.payload.scriptName);

    if (asset == null || asset.contentType !== 'application/javascript') {
      ctx.status = 404;

      return;
    }

    ctx.status = 302;
    ctx.headers.set('Location', asset.url);
  });

