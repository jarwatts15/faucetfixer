export default {
  async fetch(request: Request, env: { OPENAI_API_KEY: string }) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response("", { headers: cors });

    const url = new URL(request.url);

    if (request.method === "GET") {
      if (url.pathname === "/health") {
        return new Response(JSON.stringify({ ok: true }), {
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (url.pathname === "/" || url.pathname === "") {
        const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Faucet Fixer API</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;line-height:1.5;padding:24px}code{background:#f4f4f5;padding:2px 6px;border-radius:4px}</style></head><body><h1>Faucet Fixer API</h1><p>POST <code>/chat</code> with JSON: <code>{"question":"..."}</code></p><pre>curl -s -X POST "${url.origin}/chat" -H "Content-Type: application/json" --data '{"question":"My faucet drips"}'</pre><p>Health: <a href="/health">/health</a></p></body></html>`;
        return new Response(html, { headers: { ...cors, "Content-Type": "text/html; charset=utf-8" } });
      }
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (request.method !== "POST") {
      return new Response("Use POST /chat", { status: 405, headers: cors });
    }

    if (!(url.pathname === "/" || url.pathname === "/chat")) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { question } = await request.json();

    const system = `You are Faucet Fixer, a friendly pro who helps beginners fix faucet issues safely.
- Always start with: shut off water if disassembling.
- Ask 1-2 clarifying questions before deep steps.
- Keep steps short and simple.
- If a repair is risky or advanced, say so and suggest a pro.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: String(question || "") },
        ],
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const answer = data.choices?.[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";
    return new Response(JSON.stringify({ answer }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};


