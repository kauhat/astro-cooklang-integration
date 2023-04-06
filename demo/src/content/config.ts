import { z, defineCollection } from "astro:content";

const recipesCollection = defineCollection({
  schema: z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  recipes: recipesCollection,
};
