import { defineCollection, z } from "astro:content";

const shoppingItemSchema = z.object({
  name: z.string(),
  synonym: z.string().optional(),
});

const recipeSchema = {
  ingredients: z.array(z.any()).default([]),
  cookwares: z.array(z.any()).default([]),
  metadata: z.any().default({}),
  steps: z.array(z.array(z.any())).default([]),
  shoppingList: z.record(shoppingItemSchema).optional(),
};

export const collections = {
  recipes: defineCollection({
    schema: z.object({
      ...recipeSchema,

      title: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
    }),
  }),
};
