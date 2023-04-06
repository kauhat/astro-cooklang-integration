import type {
  AstroConfig,
  AstroIntegration,
  ContentEntryType,
  HookParameters,
} from "astro";
import type { InlineConfig } from "vite";
import cooklangVite from "vite-plugin-cooklang";
import { Recipe } from "@cooklang/cooklang-ts";

type SetupHookParams = HookParameters<"astro:config:setup"> & {
  // See: https://github.com/withastro/astro/blob/main/packages/integrations/markdoc/src/index.ts#L14
  // "`contentEntryType` is not a public API"
  addContentEntryType: (contentEntryType: ContentEntryType) => void;
};

// TODO: Use template to render default content display.
type ContentTemplate = void;

export interface AstroCooklangConfig {
  contentTemplate?: ContentTemplate;
}

const contentTypesTemplate = `declare module 'astro:content' {
	interface Render {
		'.cook': Promise<{
			Content(props: Record<string, any>): import('astro').MarkdownInstance<{}>['Content'];
		}>;
	}
}`;

export default function cooklangIntegration(
  inputConfig: AstroCooklangConfig = {}
): AstroIntegration {
  const entryBodyByFileIdCache = new Map<string, string>();
  return {
    name: "@astrojs/cooklang",
    hooks: {
      "astro:config:setup": async (params) => {
        const { updateConfig, config, addContentEntryType } =
          params as SetupHookParams;

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
          const { ingredients, cookwares, metadata, steps, shoppingList } =
            recipe;

          // TODO: Assemble parts into human-readable format and render (as Markdown?)
          // We'll just use the raw file contents for now.
          const body = contents;

          entryBodyByFileIdCache.set(fileUrl.pathname, body);

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

        addContentEntryType({
          extensions: [".cook"],
          getEntryInfo,
          contentModuleTypes: contentTypesTemplate,

          // I don't think we need this yet...
          // contentModuleTypes: await fs.promises.readFile(
          // 	new URL('../template/content-module-types.d.ts', import.meta.url),
          // 	'utf-8'
          // ),
        });

        // Using my vite plugin for now, but we probably want a custom
        // transformer so we can use `entryBodyByFileIdCache.get()`.
        const viteConfig: InlineConfig = {
          plugins: [cooklangVite()],
        };

        // updateConfig({ vite: viteConfig });
      },
    },
  };
}
