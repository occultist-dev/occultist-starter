# Occultist.dev starter

This is a starter repo for building projects using the Occultist.dev framework.

This is a WIP and is not ready for use as documented.

## Getting started

1. Clone this repo
2. Install dependencies
   `pnpm install # or use deno / bun`.
3. Run the project
   `pnpm dev # see package.json for other options`.

## API folder structure

The API is where all routes and most business rules are defined. Unlike other
fullstack server rendered JS frameworks, Occultist.dev defines routes more

### /src/api/registry.ts

Defines the Occultist registry. The registry is like a router in Koa or Express.js,
but it also has APIs for querying endpoints and static file info. Extensions can
use these APIs to scaffold up further endpoints from the endpoints defined in userland.

### /src/api/extensions.ts

Instantiates all Occultist extensions.

The static extension does more than just serve up a directory of files. It scans the
available files, hashes the contents to create a URL fixed to the content, serves files
using immutable HTTP headers, pre-processes typescript and updates and referencing URLs
in other files to reference the new URL.

The dev extension ties the Mithril, Octiron, Occultist and Longform projects together into
an opinionated fullstack framework. The dev extension can be configured to group
SSR rendered pages into render groups, the client will only navigate on the client
side if the route it is navigating to is within its render group. Render groups offer
a way to limit the amount of javascript that goes over the wire.

### /src/api/actions

This is where Occultist endpoints are setup. These are just typescript files that are
imported into `/src/api/api.ts` to bring them into the program.

## App folder structure

The app directory is where all files are stored which serve the base for server
side rendering.

### /src/app

All files related to the SSR rendered app. Typescript / Javascript files
located in this module can be imported into other modules with the '#' number
sign prefix. Files are only served if they are picked up by the static or dev extensions.

### /src/app/globals

Includes globally present files which are used in all SSR page renders. Any css file present
here will be added to all SSR rendered pages.

- `*.css`: Optional global site-wide styles.
- `type-handlers.ts`: Optional globally present Octiron type handlers.
- `content-handlers.ts`: Optional globally present Octiron content handlers.

### /src/app/defaults

Default files which will not be used if a render group or page defines their own defaults.

- `favicon.ico`: The sites favicon.
- `default.lf`: Optional default Longform layout.
- `default.css`: Optional default styles.
- `default.ts|js`: Optional module to render into the default layout mountpoints, if not overridden.
- `type-handlers.ts|js`: Optional globally present Octiron type handlers.
- `content-handlers.ts|js`: Optional globally present Octiron content handlers.

### /src/app/layouts

Render groups can use custom layouts. Each layout is in Longform and must set mountpoints
for the Mithril / Octiron app. If defining a layout make sure to make the `head` element
empty and mountable using the name `head`.

A layout usually looks like so:
- `{layoutName}.lf`: The Longform layout file.
- `{layoutName}.css`: Optional css file for the layout, this overrides the `default.css`.
- `{layoutName}.ts|js`: Optional module that exports functions to render in the layout's
  mount points if not overridden. 

For a layout to be used, a render group must be added to the dev extension that uses the
layout.

### /src/app/pages

A Longform page consists of a javascript or typescript file that exports functions using
the same name as the mount points in the layout being used. The default layout implements
the `head` and `body` mount points and so pages using this layout will export functions of
those names that return Mithril VDOM.

A page usually looks like so:
- `{pageName}.ts|js`: Module that exports functions to render. Overrides layout functions if defined.
- `{pageName}.{locale?}.lf`: Optional Longform markup which can be translated to many locales / languages.

### /src/app/type-handlers

A type handler is a special component that Octiron can use to present or edit values it selects.

### /src/app/components

General purpose Mithril components.
