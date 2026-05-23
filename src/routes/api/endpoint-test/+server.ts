import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, fetch }) => {
  const { url } = await request.json().catch(() => ({ url: "" }));

  if (typeof url !== "string" || !url.trim()) {
    return json({ error: "URL is required." }, { status: 400 });
  }

  let endpointUrl: URL;
  try {
    endpointUrl = new URL(url);
  } catch {
    return json({ error: "URL is invalid." }, { status: 400 });
  }

  if (endpointUrl.protocol !== "https:" && endpointUrl.protocol !== "http:") {
    return json({ error: "Only HTTP(S) endpoints can be tested." }, { status: 400 });
  }

  try {
    const response = await fetch(endpointUrl, {
      headers: {
        accept: "application/json, text/plain;q=0.9, */*;q=0.8",
        "user-agent": "stipflip-oracle-endpoint-test",
      },
    });
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await response.json() : await response.text();

    return json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      contentType,
      body,
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Endpoint request failed.",
      },
      { status: 502 }
    );
  }
};
