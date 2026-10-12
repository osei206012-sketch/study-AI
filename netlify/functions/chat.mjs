const ALLOWED_MODELS = new Set([
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
]);
const VISION_MODEL = "qwen/qwen3.8-27b";
const MAX_BODY_CHARS = 8_000_000;
const MAX_MESSAGES = 24;
const MAX_TEXT_CHARS = 120_000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-content-type-options": "nosniff",
    },
  });
}

export default async (request) => {
  if (request.method !== "POST") {
    return json({ error: "Use POST to send a chat message." }, 405);
  }

  // The key is only read in the server environment, never from browser input.
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return json({
      error: "The Groq API key is not configured on the server. Add GROQ_API_KEY in Netlify environment variables, then redeploy.",
    }, 503);
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "Could not read the request." }, 400);
  }
  if (raw.length > MAX_BODY_CHARS) {
    return json({ error: "This request is too large. Please attach fewer or smaller files." }, 413);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return json({ error: "The request was not valid JSON." }, 400);
  }

  if (!Array.isArray(input.messages) || input.messages.length === 0) {
    return json({ error: "Please enter a question and try again." }, 400);
  }
  if (input.messages.length > MAX_MESSAGES) {
    return json({ error: "This conversation is too long for one request. Start a new chat and try again." }, 413);
  }

  let totalText = 0;
  let hasImage = false;
  const messages = [];
  for (const message of input.messages) {
    if (!message || !["system", "user", "assistant"].includes(message.role)) continue;
    let content = message.content;
    if (typeof content === "string") {
      totalText += content.length;
    } else if (Array.isArray(content)) {
      content = content.filter((part) => {
        if (!part || typeof part !== "object") return false;
        if (part.type === "text" && typeof part.text === "string") {
          totalText += part.text.length;
          return true;
        }
        if (part.type === "image_url" && part.image_url && typeof part.image_url.url === "string") {
          // Accept only base64 data URLs; do not let the model fetch arbitrary remote URLs.
          if (!/^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(part.image_url.url)) return false;
          hasImage = true;
          return true;
        }
        return false;
      });
    } else {
      continue;
    }
    messages.push({ role: message.role, content });
  }

  if (!messages.length || totalText > MAX_TEXT_CHARS) {
    return json({ error: "The message or attached text is too large. Please shorten it and try again." }, 413);
  }

  const requestedModel = typeof input.model === "string" ? input.model : "openai/gpt-oss-120b";
  const model = hasImage ? VISION_MODEL : (ALLOWED_MODELS.has(requestedModel) ? requestedModel : "openai/gpt-oss-120b");
  const maxTokens = Number.isFinite(input.max_tokens)
    ? Math.max(128, Math.min(Math.floor(input.max_tokens), 2500))
    : 1800;
  const payload = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature: Number.isFinite(input.temperature)
      ? Math.max(0, Math.min(input.temperature, 1))
      : 0.4,
  };

  let upstream;
  try {
    upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(50_000),
    });
  } catch (error) {
    const timeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    return json({ error: timeout ? "Groq took too long to respond. Please try again." : "Could not connect to Groq. Please try again shortly." }, 502);
  }

  let result;
  try {
    result = await upstream.json();
  } catch {
    return json({ error: `Groq returned an unreadable response (HTTP ${upstream.status}).` }, 502);
  }

  if (!upstream.ok) {
    const status = upstream.status === 429 ? 429 : (upstream.status >= 500 ? 502 : 400);
    const message = result?.error?.message || "Groq could not complete this request.";
    // Never return request headers or the API key to the browser.
    return json({ error: upstream.status === 401
      ? "Groq rejected the server API key. Replace GROQ_API_KEY in Netlify and redeploy."
      : upstream.status === 429
        ? "The AI service is busy or its rate limit was reached. Wait a moment and try again."
        : `AI request failed: ${String(message).slice(0, 240)}` }, status);
  }

  const answer = result?.choices?.[0]?.message?.content;
  if (typeof answer !== "string" || !answer.trim()) {
    return json({ error: "Groq returned an empty answer. Please try again." }, 502);
  }

  return json({ content: [{ type: "text", text: answer.replace(/<think>[\s\S]*?<\/think>/g, "").trim() || answer }] });
};
