import { defineConfig } from 'astro/config';
import cooklang from 'astro-cooklang';

// https://astro.build/config
export default defineConfig({
	integrations: [cooklang()],
});
