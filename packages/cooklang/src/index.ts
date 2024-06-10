import { Recipe, getImageURL } from "@cooklang/cooklang-ts";
// import type { LoadResult, SourceDescription, TransformResult } from "rollup";
import z from "zod";
import type {
  AstroIntegration,
  ContentEntryModule,
  ContentEntryType,
  DataEntryType,
  HookParameters,
} from "astro";

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
  metadata: z.any().optional(),
  steps: z.array(z.array(z.any())).default([]),
  shoppingList: z.record(shoppingItemSchema).optional(),
};

//
// Unoffical Astro API types...
//

type SetupHookParams = HookParameters<"astro:config:setup"> & {
  // See: https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/index.ts#L14
  // "`contentEntryType` is not a public API"
  addPageExtension: (extension: string) => void;
  addContentEntryType: (contentEntryType: ContentEntryType) => void;
  addDataEntryType: (dataEntryType: DataEntryType) => void;
};

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

//
// Cooklang integration...
//

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

  // TODO: Attempt to deserialize metadata into collection's schema format as
  //       defined in the content config.
  //
  // https://github.com/kauhat/astro-cooklang-integration/issues/7

  // TODO: Find images matching recipe name fitting spec conventions.
  //
  // I don't think we'll be able to use `getImageURL()` here, we probably need
  // to search the content directory for multiple image extensions.
  //
  // https://cooklang.org/docs/spec/#adding-pictures
  // https://cooklang.github.io/cooklang-ts/modules.html#getImageURL.
  //
  // https://github.com/kauhat/astro-cooklang-integration/issues/3

  const data = {
    // Add recipe metadata properties as top level.
    ...metadata,

    cookwares,
    ingredients,
    metadata,
    shoppingList,
    steps,
  };

  return {
    slug: metadata.slug,
    data,
    body: "", // Should we use body or rawData for the recipe source?
    rawData: contents,
  };
}

/**
 * Integration settings...
 */
export interface AstroCooklangConfig {}

/**
 * Our main Astro integration...
 */
export default function cooklangIntegration(
  inputConfig: AstroCooklangConfig = {},
): AstroIntegration {
  return {
    name: "@astrojs/cooklang",
    hooks: {
      "astro:config:setup": async (params) => {
        const {
          addContentEntryType,
          addPageExtension,
          addDataEntryType,
          updateConfig,
        } = params as SetupHookParams;

        addPageExtension(".cook");

        addDataEntryType({
          extensions: [".cook"],
          getEntryInfo,
        });

        // updateConfig({
        //   vite: {
        //     /** @type {import('vite').Plugin[]} */
        //     plugins: [
        //       {
        //         name: "cooklang-loader",
        //         enforce: "pre",

        //         transform(source: string, id: string): TransformResult | null {
        //           // Check the file name contains ".cook" extension.
        //           if (!id.endsWith(".cook")) {
        //             return null;
        //           }

        //           // Resolve the imported path.
        //           const [path, _query] = id.split("?", 2);

        //           const code = "";
        //           // const code = sourceToJSONTransform(source, path, true);
        //           // const code = sourceToRecipeTransform(source, path, true)

        //           //
        //           return {
        //             code,
        //             map: null,
        //             // deps: ['@cooklang/cooklang-ts'],
        //             // dynamicDeps: ['@cooklang/cooklang-ts'],
        //           };
        //         },
        //       },
        //     ],
        //   },
        // });
      },
    },
  };
}
