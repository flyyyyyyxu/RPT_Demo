import type { CompetitorInsightRequest, CompetitorInsightResponse, CompetitorInsightItem } from "../shared/types";

export const config = { runtime: "edge" };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitizeJson(text: string): string {
  return (
    text
      // strip markdown fences
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      // Chinese/curly quotes → straight quotes
      .replace(/[\u201c\u201d\u2018\u2019\u300c\u300d\uff02]/g, '"')
      // Chinese colon → ASCII colon
      .replace(/\uff1a/g, ":")
      // Chinese comma → ASCII comma
      .replace(/\uff0c/g, ",")
      // remove trailing commas before } or ]
      .replace(/,\s*([}\]])/g, "$1")
      .trim()
  );
}

function extractJsonArray(text: string): any[] {
  const s = sanitizeJson(text);
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON array found. Raw: ${s.slice(0, 200)}`);
  }
  return JSON.parse(s.slice(start, end + 1));
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) return json({ error: "MINIMAX_API_KEY not configured" }, 500);

    const { competitorLinks, productName, sellingPoints }: CompetitorInsightRequest =
      await request.json();

    const prompt = `你是小红书内容分析专家。

商品：${productName}
卖点：${sellingPoints.join("、")}
竞品参考：${competitorLinks}

请基于该品类在小红书上的常见竞品特点，提炼5条有价值的内容创作洞察，帮助该商品写出更有竞争力的笔记。每条洞察要具体、可操作，直接指导文案创作。

只返回JSON数组，不要任何其他文字：
[{"label":"洞察类型","detail":"具体可操作的洞察内容（15-40字）"},...]
（共5条，label从以下选取：用户高频痛点/爆款热词/情感锚点/成分对比/价格锚点/使用场景/差异化亮点）`;

    const mmRes = await fetch("https://api.minimax.chat/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        messages: [
          { role: "system", content: "只输出JSON数组，不输出任何其他文字。" },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const mmText = await mmRes.text();

    if (!mmRes.ok) {
      return json({ error: `MiniMax API error: ${mmText}` }, 502);
    }

    let mmData: any;
    try {
      mmData = JSON.parse(mmText);
    } catch {
      return json({ error: `MiniMax returned non-JSON: ${mmText.slice(0, 300)}` }, 502);
    }

    const content: string =
      mmData.choices?.[0]?.message?.content ??
      mmData.choices?.[0]?.message?.reasoning_content ??
      "";

    if (!content) {
      return json({ error: `Empty content from model. Response: ${mmText.slice(0, 300)}` }, 500);
    }

    let raw: any[];
    try {
      raw = extractJsonArray(content);
    } catch (e: any) {
      return json({ error: `JSON parse failed: ${e.message}` }, 500);
    }

    const insights: CompetitorInsightItem[] = raw.slice(0, 5).map((item) => ({
      label: item.label ?? "洞察",
      detail: item.detail ?? "",
      status: "pending" as const,
    }));

    return json({ insights } as CompetitorInsightResponse);
  } catch (e: any) {
    return json({ error: e.message ?? "Unexpected error" }, 500);
  }
}
