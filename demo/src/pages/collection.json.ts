import { getCollection } from "astro:content";

export async function GET(): Promise<Response> {
  const posts = await getCollection("recipesData");

  return Response.json({
    body: JSON.stringify(posts.map(({ render = null, ...entry }) => entry)),
  });
}
