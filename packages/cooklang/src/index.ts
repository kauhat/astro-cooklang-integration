import { Recipe } from "@cooklang/cooklang-ts";
import type { LoadResult, SourceDescription } from "rollup";
import z from "zod";
import type {
  AstroConfig,
  AstroIntegration,
  ContentEntryModule,
  ContentEntryType,
  HookParameters,
} from "astro";

// TODO: Use template to render default content display.
type ContentTemplate = void;

export interface AstroCooklangConfig {
  contentTemplate?: ContentTemplate;
}

//
// Content schemas...
//

export const shoppingItemSchema = z.object({
  name: z.string(),
  synonym: z.string().optional(),
});

export const recipeSchema = {
  ingredients: z.array(z.any()).default([]),
  cookwares: z.array(z.any()).default([]),
  metadata: z.any().default({}),
  steps: z.array(z.array(z.any())).default([]),
  shoppingList: z.record(shoppingItemSchema).optional(),
};

//
type SetupHookParams = HookParameters<"astro:config:setup"> & {
  // See: https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/index.ts#L14
  // "`contentEntryType` is not a public API"
  addContentEntryType: (contentEntryType: ContentEntryType) => void;
  addPageExtension: (extension: string) => void;
};

//
// Setup entry data from files with .cook extension.
//

type EntryInfoInput = {
  fileUrl: URL;
  contents: string;
};

type EntryInfoOutput = {
  data: Record<string, unknown>;
  rawData: string;
  body: string;
  slug: string;
};

/**
 * Load recipe from file contents and extract data.
 *
 * Output is used to build the collection entry item.
 *
 * @see https://docs.astro.build/en/reference/api-reference/#collection-entry-type
 */
function getEntryInfo({ fileUrl, contents }: EntryInfoInput): EntryInfoOutput {
  // Parse the recipe...
  const recipe = new Recipe(contents);

  // Extract parts.
  const { ingredients, cookwares, metadata, steps, shoppingList } = recipe;

  return {
    data: {
      ingredients,
      cookwares,
      metadata,
      steps,
      shoppingList,
    },
    slug: metadata.slug,
    body: contents, // Should we use body or rawData for the recipe source?
    rawData: contents,
  };
}

//
// Using the data that was setup when handling the entry above, we generate a
// module will allow us to display recipes in pages.
//
// The module returns a `<Content />` component.
//
// TODO: Allow content component to be customized. (see `ContentTemplate`)
//

type RenderModuleInput = {
  entry: ContentEntryModule;
  viteId: string;
};

type RenderModuleOutput = SourceDescription & { [additonal: string]: any };

/**
 * Build a bundleable module from recipe entry data.
 *
 * Output is used to build the collection entry item.
 *
 * @see https://docs.astro.build/en/reference/api-reference/#collection-entry-type
 */
async function getRenderModule({
  viteId,
  entry,
}: RenderModuleInput): Promise<RenderModuleOutput> {
  const { body, data } = entry;
  const { steps, cookwares, ingredients } = data;
  // console.log({ viteId, entry });

  const code = `
import { jsx as h } from "astro/jsx-runtime";
import Renderer from 'astro-cooklang/Renderer.astro';

const {
  ingredients,
  cookwares,
  metadata,
  steps,
  shoppingList,
} = ${JSON.stringify(entry.data, null, 4)}

const raw = ${JSON.stringify(body, null, 4)}

/**
 * Use renderer component for file entry's <Content/> display.
 */
export async function Content (props) {
  return h(
    Renderer,
    {
      raw,

      ingredients,
      cookwares,
      metadata,
      steps,
      shoppingList,
    }
  );
}

export default Content
`;

  return {
    code,
    vite: {
      lang: "ts",
    },
  };
}

// Types for the render module's Content component.
const contentTypesTemplate = `
declare module 'astro:content' {
  interface Render {
    // '.cook': Promise<{
    //   Content(props: Record<string, any>): import('astro').MarkdownInstance<{}>['Content'];
    // }>;
  }
}`;

/**
 * Our main Astro integration...
 */
export default function cooklangIntegration(
  inputConfig: AstroCooklangConfig = {}
): AstroIntegration {
  return {
    name: "@astrojs/cooklang",
    hooks: {
      "astro:config:setup": async (params) => {
        const {
          addContentEntryType,
          //addPageExtension
          //updateConfig,
        } = params as SetupHookParams;

        addContentEntryType({
          extensions: [".cook"],
          getEntryInfo,
          getRenderModule,
          contentModuleTypes: contentTypesTemplate,
        });
      },
    },
  };
}
