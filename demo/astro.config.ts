import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cooklang from "astro-cooklang";
import { never } from "astro/zod";

const baseUrlPath = import.meta.env.VITE_BASE_PATH as string;

console.log({ baseUrlPath, env: import.meta.env });

// https://astro.build/config
export default defineConfig({
  base: baseUrlPath,

  integrations: [
    cooklang(),
    tailwind({ config: { path: "tailwind.config.cjs" } }),
  ],
});
