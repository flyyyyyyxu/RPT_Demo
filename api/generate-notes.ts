import type { GenerateNotesRequest, GenerateNotesResponse, NoteVersion } from "../shared/types";

export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "MINIMAX_API_KEY not configured" }, { status: 500 });
  }

  const { productInfo, contentStrategy }: GenerateNotesRequest = await request.json();

  const prompt = `请为以下商品生成3个不同风格的小红书笔记：

商品名称：${productInfo.name}
核心卖点：${productInfo.sellingPoints.join("、")}
目标人群：${productInfo.targetAudience.join("、") || "通用"}
价格区间：${productInfo.priceRange || "未填写"}
字数要求：${productInfo.wordCount || "300-450字"}
笔记类型：${contentStrategy.noteType}
语气风格：${contentStrategy.toneStyle}
标题风格：${contentStrategy.titleStyle}
正文风格：${contentStrategy.articleStyle}
情绪浓度：${contentStrategy.emotionLevel}/100（越高越感性）
节奏感：${contentStrategy.rhythmLevel}/100（越高越有节奏感）

风格要求：
- V1：主风格（${contentStrategy.toneStyle} + ${contentStrategy.noteType}）
- V2：干货科普风（加入成分/数据/原理分析，理性为主）
- V3：真实日记风（使用前后对比或时间线叙述，情感真实）

注意：笔记内容要贴合商品实际，不要使用"XX品牌"等占位符，直接用商品名称。

只返回JSON数组，不要任何其他文字：
[{"label":"V1","style":"风格名（4-6字）","stars":5,"title":"标题（15-28字）","body":"正文（分段落，符合字数要求）","tags":["#话题1","#话题2","#话题3","#话题4","#话题5"],"metrics":{"hotWords":4,"sentiment":90,"predictLikes":"1.2k","riskWords":0},"suggestion":"一句优化建议（不超过40字）"},{"label":"V2","style":"...","stars":4,...},{"label":"V3","style":"...","stars":5,...}]`;

  const mmRes = await fetch("https://api.minimax.chat/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "MiniMax-Text-01",
      messages: [
        {
          role: "system",
          content: "你是专业的小红书内容创作者。请只输出JSON，不输出任何其他文字或解释。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 4000,
    }),
  });

  if (!mmRes.ok) {
    const err = await mmRes.text();
    return Response.json({ error: `MiniMax API error: ${err}` }, { status: 502 });
  }

  const mmData: any = await mmRes.json();
  const content: string = mmData.choices?.[0]?.message?.content ?? "";

  let versions: NoteVersion[];
  try {
    const jsonStr = content.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "").trim();
    const raw: any[] = JSON.parse(jsonStr);
    versions = raw.slice(0, 3).map((v, i) => ({
      id: `v${i + 1}`,
      label: v.label ?? `V${i + 1}`,
      style: v.style ?? "种草笔记",
      stars: Number(v.stars) || 4,
      title: v.title ?? "",
      wordCount: typeof v.body === "string" ? v.body.replace(/\s/g, "").length : 0,
      topicCount: Array.isArray(v.tags) ? v.tags.length : 0,
      body: v.body ?? "",
      tags: Array.isArray(v.tags) ? v.tags : [],
      metrics: {
        hotWords: Number(v.metrics?.hotWords) || 3,
        sentiment: Number(v.metrics?.sentiment) || 85,
        predictLikes: v.metrics?.predictLikes ?? "800",
        riskWords: Number(v.metrics?.riskWords) || 0,
      },
      suggestion: v.suggestion ?? "",
    }));
  } catch {
    return Response.json(
      { error: "解析生成结果失败，请重试", raw: content },
      { status: 500 },
    );
  }

  return Response.json({ versions } as GenerateNotesResponse);
}
