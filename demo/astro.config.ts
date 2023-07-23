import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cooklang from "astro-cooklang";

const baseUrl = import.meta.env.PUBLIC_BASE_URL as string || undefined;

// https://astro.build/config
export default defineConfig({
  base: baseUrl,
  integrations: [
    cooklang(),
    tailwind({ config: { path: "tailwind.config.cjs" } }),
  ],
});
