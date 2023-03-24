import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import cooklang from 'astro-cooklang';

// https://astro.build/config
export default defineConfig({
	integrations: [
		cooklang(),
		tailwind()
	]
});
