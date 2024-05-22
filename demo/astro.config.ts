import Inspect from "vite-plugin-inspect";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cooklang from "astro-cooklang";

const baseUrlPath = import.meta.env.VITE_BASE_PATH as string;

// https://astro.build/config
export default defineConfig({
  base: baseUrlPath,

  integrations: [cooklang(), tailwind({ configFile: "tailwind.config.cjs" })],

  vite: {
    plugins: [Inspect()],
  },
});
