import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection("recipes");

  return {
    body: JSON.stringify(posts.map(({ render = null, ...entry }) => entry)),
  };
}
