import type { CompetitorInsightRequest, CompetitorInsightResponse, CompetitorInsightItem } from "../shared/types";

export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "MINIMAX_API_KEY not configured" }, { status: 500 });
  }

  const { competitorLinks, productName, sellingPoints }: CompetitorInsightRequest =
    await request.json();

  const prompt = `你是小红书内容分析专家。

商品：${productName}
卖点：${sellingPoints.join("、")}
竞品参考：${competitorLinks}

请基于该品类在小红书上的常见竞品特点，提炼5条有价值的内容创作洞察，帮助该商品写出更有竞争力的笔记。每条洞察要具体、可操作，直接指导文案创作。

只返回JSON数组，不要任何其他文字：
[
  {"label":"洞察类型","detail":"具体可操作的洞察内容（15-40字）"},
  ...
]
（共5条，label从以下选取：用户高频痛点/爆款热词/情感锚点/成分对比/价格锚点/使用场景/差异化亮点）`;

  const mmRes = await fetch("https://api.minimax.chat/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "MiniMax-Text-01",
      messages: [
        { role: "system", content: "只输出JSON数组，不输出任何其他文字。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!mmRes.ok) {
    return Response.json({ error: "MiniMax API error" }, { status: 502 });
  }

  const mmData: any = await mmRes.json();
  const content: string = mmData.choices?.[0]?.message?.content ?? "";

  let insights: CompetitorInsightItem[];
  try {
    const jsonStr = content.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "").trim();
    const raw: any[] = JSON.parse(jsonStr);
    insights = raw.slice(0, 5).map((item) => ({
      label: item.label ?? "洞察",
      detail: item.detail ?? "",
      status: "pending" as const,
    }));
  } catch {
    return Response.json({ error: "解析失败，请重试" }, { status: 500 });
  }

  return Response.json({ insights } as CompetitorInsightResponse);
}
