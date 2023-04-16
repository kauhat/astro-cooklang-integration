import type {
  AstroConfig,
  AstroIntegration,
  ContentEntryType,
  HookParameters,
  ContentEntryModule,
} from "astro";
import type { InlineConfig } from "vite";
import cooklangVite from "vite-plugin-cooklang";
import { Recipe } from "@cooklang/cooklang-ts";

type SetupHookParams = HookParameters<"astro:config:setup"> & {
  // See: https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/index.ts#L14
  // "`contentEntryType` is not a public API"
  addContentEntryType: (contentEntryType: ContentEntryType) => void;
  addPageExtension: (extension: string) => void;
};

// TODO: Use template to render default content display.
type ContentTemplate = void;

export interface AstroCooklangConfig {
  contentTemplate?: ContentTemplate;
}

const contentTypesTemplate = `
declare module 'astro:content' {
  interface Render {
    '.cook': Promise<{
      Content(props: Record<string, any>): import('astro').MarkdownInstance<{}>['Content'];
    }>;
  }
}`;


/**
 *
 */
function getEntryInfo({
  fileUrl,
  contents,
}: {
  fileUrl: URL;
  contents: string;
}) {
  // Parse the recipe...
  const recipe = new Recipe(contents);

  // Extract parts.
  const { ingredients, cookwares, metadata, steps, shoppingList } = recipe;

  // TODO: Assemble parts into human-readable format and render (as Markdown?)
  // We'll just use the raw file contents for now.
  const body = contents;

  return {
    data: {
      ingredients,
      cookwares,
      metadata,
      steps,
      shoppingList,
    },
    body,
    slug: metadata.slug,
    rawData: "",
  };
}

/**
 *
 */
async function getRenderModule({
  viteId,
  entry,
}: {
  entry: ContentEntryModule;
  viteId: string;
}) {
  const { body, data } = entry;
  const { steps, cookwares, ingredients } = data
  // console.log({ viteId, entry });

  const code = `
import { jsx as h } from "astro/jsx-runtime";

const recipeRaw = ${JSON.stringify(body, null, 4)}

export async function Content (props) {
  return h('div', { children: [recipeRaw] });
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

/**
 *
 */
const contentTypesTemplate = `
declare module 'astro:content' {
  interface Render {
    // '.cook': Promise<{
    //   Content(props: Record<string, any>): import('astro').MarkdownInstance<{}>['Content'];
    // }>;
  }
}`;

export default function cooklangIntegration(
  inputConfig: AstroCooklangConfig = {}
): AstroIntegration {
  return {
    name: "@astrojs/cooklang",
    hooks: {
      "astro:config:setup": async (params) => {
        const { updateConfig, addContentEntryType, addPageExtension } =
          params as SetupHookParams;

        // Register Vite plugin...
        // Using my vite plugin for now, but we probably want a custom
        // transformer later.
        // const viteConfig: InlineConfig = {
        //   plugins: [cooklangVite()],
        // };

        // updateConfig({ vite: viteConfig });

        // TODO: Try disabling.
        addPageExtension(".cook");

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
