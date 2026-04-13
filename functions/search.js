export default async (request) => {
  // Only allow POST
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Optional: shared password check
  const body = await request.json();
  if (body.password !== process.env.SITE_PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Forward to Anthropic with your key injected server-side
  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body.payload),
  });

  const data = await anthropicResponse.json();
  return new Response(JSON.stringify(data), {
    status: anthropicResponse.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = { path: "/api/search" };