import { recipeSchema } from "astro-cooklang";
import { defineCollection, z } from "astro:content";

export const collections = {
  recipes: defineCollection({
    schema: z.object({
      // Add recipe properties.
      ...recipeSchema,

      title: z.string().optional(),
      category: z.string().optional(),

      // TODO: How should metadata property object/array output work?
      // tags: z
      //   .array(z.string())
      //   // .any()
      //   .default([]),
    }),
  }),

  // recipesData: defineCollection({
  //   type: "data",
  //   schema: z.object({
  //     ...recipeSchema,

  //     title: z.string().optional(),
  //     category: z.string().optional(),
  //   }),
  // }),
};
