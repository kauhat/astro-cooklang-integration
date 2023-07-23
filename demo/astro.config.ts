import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cooklang from "astro-cooklang";

const baseUrl = import.meta.env.VITE_BASE_URL as string || undefined;

console.log({baseUrl, env: import.meta.env})

// https://astro.build/config
export default defineConfig({
  base: "https://kauhat.github.io/astro-cooklang-integration/", // baseUrl,
  integrations: [
    cooklang(),
    tailwind({ config: { path: "tailwind.config.cjs" } }),
  ],
});
