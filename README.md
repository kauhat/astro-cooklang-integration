<div align="center">
  <img width="100%" src="./banner.svg" alt="Astro Cooklang Banner"/>
</div>

# Astro Cooklang Integration

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]

This integration adds support to load `.cook` format files as [content collections](https://docs.astro.build/en/guides/content-collections/).

## Setup

### Install this package

```bash
npm install --save-dev astro-cooklang
# OR
yarn add -D astro-cooklang
```

### Update your config

Add the plugin to your Astro site's config.

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

## Usage

Extend the base recipe schema as a data collection in your collections [configuration file](https://docs.astro.build/en/guides/content-collections/#defining-collections).

```ts
// ./src/content/config.js
import { recipeSchema } from "astro-cooklang";
import { defineCollection, z } from "astro:content";

export const collections = {
  recipes: defineCollection({
    type: "data",
    schema: z.object({
      // Add recipe properties.
      ...recipeSchema,

      // Metadata is top level.
      title: z.string().optional(),
    }),
  }),
};
```

Recipe entries are loaded using the [Cooklang-TS](https://github.com/cooklang/cooklang-ts) library and have the properties shown below.

```astro
---
// ./src/pages/[...recipe].astro
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const recipeEntries = await getCollection("recipes");

  return recipeEntries.map((entry) => {
    return {
      params: {
        // e.g `spec/fried-rice`
        recipe: entry.slug,
      },
      props: { entry },
    };
  });
}

const { entry } = Astro.props;

// You can access recipe data like this...
const { ingredients, cookwares, metadata, steps, shoppingList } = entry.data;

// But metadata is also top level...
const title = entry.data.title || entry.slug;
---
```

See the [demo site](https://astro-cooklang.kauh.at/) [(source)](./demo) for an example of an Astro site using this integration.

## TODO

- [x] Write a readme
- [ ] Support content collections
  - [ ] Allow renderer component to be customized [#2](https://github.com/kauhat/astro-cooklang-integration/issues/2)
- [ ] Find and display recipe images [#3](https://github.com/kauhat/astro-cooklang-integration/issues/3)
- [ ] Properly handle conflicting filenames [#5](https://github.com/kauhat/astro-cooklang-integration/issues/5)
- [ ] Add test fixtures [#4](https://github.com/kauhat/astro-cooklang-integration/issues/4)
- [ ] Setup deploy action [#6](https://github.com/kauhat/astro-cooklang-integration/issues/6)
- [ ] Show how to use categories in demo project
- [ ] Show how to use tags in demo project

## Thanks

- The [Cooklang-TS](https://github.com/cooklang/cooklang-ts) TypeScript library
- The [Cooklang](https://github.com/cooklang) project and it's contributors

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/astro-cooklang?style=flat-square
[npm-version-href]: https://npmjs.com/package/astro-cooklang
[npm-downloads-src]: https://img.shields.io/npm/dm/astro-cooklang?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/astro-cooklang
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/kauhat/astro-cooklang-integration/publish.yml?branch=main&style=flat-square
[github-actions-href]: https://github.com/kauhat/astro-cooklang-integration/actions?query=workflow%3Aci
