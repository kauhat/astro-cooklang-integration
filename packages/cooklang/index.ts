import type { AstroIntegration, AstroConfig } from 'astro';
import type { InlineConfig } from 'vite';
import cooklangVite from 'vite-plugin-cooklang';
import { Recipe } from '@cooklang/cooklang-ts';

export default function cooklang(cooklangConfig = {}): AstroIntegration {
	const entryBodyByFileIdCache = new Map<string, string>();
	return {
		name: '@astrojs/cooklang',
		hooks: {
			'astro:config:setup': async ({
				updateConfig,
				config,
				addContentEntryType,
				addPageExtension,
			}: any) => {
				function getEntryInfo({ fileUrl, contents }: { fileUrl: URL; contents: string }) {
					// Parse the recipe...
					const recipe = new Recipe(contents);

					// Extract parts.
					const { ingredients, cookwares, metadata, steps, shoppingList } = recipe;

					// TODO: Assemble parts into human-readable format and render (as Markdown?)
					// We'll just use the raw file contents for now.
					const body = contents

					entryBodyByFileIdCache.set(fileUrl.pathname, body);

					return {
						data: { ingredients, cookwares, metadata, steps, shoppingList },
						body,
						slug: metadata.slug,
						rawData: {
							recipe,
						},
					};
				}

				const contentEntryType = {
					extensions: ['.cook'],
					getEntryInfo,

					// I don't think we need this yet...
					// contentModuleTypes: await fs.promises.readFile(
					// 	new URL('../template/content-module-types.d.ts', import.meta.url),
					// 	'utf-8'
					// ),
				};

				addContentEntryType(contentEntryType);

				addPageExtension('.cook');

				// Using my vite plugin for now, but we probably want a custom
				// transformer so we can use `entryBodyByFileIdCache.get()`.
				const viteConfig: InlineConfig = {
					plugins: [cooklangVite()],
				};

				updateConfig({ vite: viteConfig });
			},
		},
	};
}
