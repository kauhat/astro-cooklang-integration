![Astro Cooklang Banner](./demo/src/components/Banner.svg)

# Astro Cooklang Integration

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]

This integration adds support for `.cook` format files to be loaded as [content collections](https://docs.astro.build/en/guides/content-collections/).

## Setup

### Install this package

```bash
npm install --save-dev astro-cooklang
# OR
yarn add -D astro-cooklang
```

### Update your config

Add the plugin to your Astro site's config as below:

```ts
// ./astro.config.js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cooklang from "astro-cooklang";

// https://astro.build/config
export default defineConfig({
  integrations: [cooklang()],
});
```

Extend the base recipe schema in your content collections [configuration file](https://docs.astro.build/en/guides/content-collections/#defining-collections).

```ts
// ./src/content/config.js
import { recipeSchema } from "astro-cooklang";
import { defineCollection, z } from "astro:content";

export const collections = {
  recipes: defineCollection({
    schema: z.object({
      // Add recipe properties.
      ...recipeSchema,

      title: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
    }),
  }),
};
```

## Usage

Recipe entries are loaded using the [Cooklang-TS](https://github.com/cooklang/cooklang-ts) library.

```astro
---
import recipe from "./test/example/recipes/Easy Pancakes.cook";

const { entry } = Astro.props;
const { Content } = await entry.render();

const {
  //
  ingredients,
  cookwares,
  metadata,
  steps,
  shoppingList,
} = entry.data;
---

<!-- Render the recipe in your page template -->
<Content />
```

See the [test project](./test/example) for an example of using this plugin.

## TODO

- [x] Write a readme.
- [ ] Add vitest tests to demo project.
- [ ] Allow renderer component to be customized.

## Thanks

- The [Cooklang-TS](https://github.com/cooklang/cooklang-ts) TypeScript library
- The [Cooklang](https://github.com/cooklang) project and it's contributors

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/astro-cooklang?style=flat-square
[npm-version-href]: https://npmjs.com/package/astro-cooklang
[npm-downloads-src]: https://img.shields.io/npm/dm/astro-cooklang?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/astro-cooklang
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/kauhat/astro-cooklang/ci.yml?branch=main&style=flat-square
[github-actions-href]: https://github.com/kauhat/astro-cooklang/actions?query=workflow%3Aci
