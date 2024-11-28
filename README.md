# Diagraph

A service tp draw cloud architecture diagrams using (modified) graph.viz/dot
notation.

```sh
# install deno
deno task install
deno task dev
deno task build
deno task prod
deno task deploy
```

## Stack

typescript + deno + husk + graphviz.js

- We only use `esm` module system.
  - Since we use `husk` that has a very primitive bundling (using deno native
    transpiler) avoid using any old js module system (CommonJS).
  - Prefer `jsr` modules if available
  - If not jsr, Use `mjs` or `esm` or `ts` version of the module on `unpkg` or
    `jsDelivr`. Do not forget to replace this esm url version instead of
    `npm:...` in `deno.json>import` section.
  - If you have to use CommonJS `<package>`, use `https://esm.sh/<package>`,
    which converts it to esm.
  - The last resort is to cdn it in `ui/index.html` header as the global
    variable.
- `./server.ts` serves both ui and api server.
  - When in dev mode (`deno task dev`:
    `deno run -A --watch server.ts --watch-ui`), deno watch for any change in
    api or ui files and serves from `ui/` directory.
  - In prod mode (`deno task prod`), deno serves `ui-dist/` since --watch-ui
    switch is not provided.

- No hard parameter anywhere: all in `config.ts`

## build and publish

We publish it on "deno deploy", which underlying uses gcp cloud run as the
service runner.

Since deno serves typescript natively, we only need to build ui and then publish
it using `deployctl`.

```sh
deno task deploy
```

## diagramming language

It follow DOT language (https://graphviz.com) with following modifications.

- using icons:
  - node1 [image="/gcp/Cloud-Run.svg"]
  - You can also use it in table labels.
  - to find gcp icon name: https://gcpicons.com/

- !/url becomes:
  - [image="url"] in nodes
  - <img src="url"> in tables
  - use this syntax as a sugar coat like !/gcp/Cloud-Run.svg

- variables:
  - definition is !id = `multiline value`
  - usage is !id which become the value
