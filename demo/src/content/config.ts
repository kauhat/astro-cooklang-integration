import { recipeSchema } from "astro-cooklang";
import { defineCollection, z } from "astro:content";

export const collections = {
  recipes: defineCollection({
    schema: z.object({
      // Add recipe properties.
      ...recipeSchema,

      title: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
    }),
  }),
};
