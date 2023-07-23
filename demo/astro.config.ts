import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cooklang from "astro-cooklang";

const baseUrlPath = import.meta.env.PUBLIC_BASE_PATH as string;

console.log({baseUrlPath, env: import.meta.env})

// https://astro.build/config
export default defineConfig({
  base: baseUrlPath,
  trailingSlash: 'never',

  integrations: [
    cooklang(),
    tailwind({ config: { path: "tailwind.config.cjs" } }),
  ],
});
