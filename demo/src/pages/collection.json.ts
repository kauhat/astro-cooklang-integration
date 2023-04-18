import { getCollection } from "astro:content";

export async function get() {
  const posts = await getCollection("recipes");

  return {
    body: JSON.stringify(posts.map(({ render, ...entry }) => entry)),
  };
}
