import type { GenerateNotesRequest, GenerateNotesResponse, NoteVersion } from "../shared/types";

function sanitizeJson(text: string): string {
  return text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

function extractJsonArray(text: string): any[] {
  const s = sanitizeJson(text);
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`No JSON array found. Raw: ${s.slice(0, 300)}`);
  }
  const jsonText = s.slice(start, end + 1);

  try {
    return JSON.parse(jsonText);
  } catch (firstError) {
    // Fallback for the rarer case where the model used full-width punctuation for JSON syntax.
    // Do this only after the untouched parse fails, because normalizing quotes inside body text
    // can corrupt otherwise-valid note content such as “洗完不紧绷”.
    const normalized = jsonText
      .replace(/[\u201c\u201d\u2018\u2019\u300c\u300d\uff02]/g, '"')
      .replace(/\uff1a/g, ":")
      .replace(/\uff0c/g, ",")
      .replace(/,\s*([}\]])/g, "$1");

    try {
      return JSON.parse(normalized);
    } catch {
      throw firstError;
    }
  }
}

// Node.js runtime (default) — avoids Edge Runtime URL pattern quirks
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "MINIMAX_API_KEY not configured" });

    const { productInfo, contentStrategy }: GenerateNotesRequest = req.body;

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
情绪浓度：${contentStrategy.emotionLevel}/100
节奏感：${contentStrategy.rhythmLevel}/100

风格要求：
- V1：主风格（${contentStrategy.toneStyle} + ${contentStrategy.noteType}）
- V2：干货科普风（加入成分/数据/原理分析，理性为主）
- V3：真实日记风（使用前后对比或时间线叙述，情感真实）

注意：直接用商品名称，不要使用"XX品牌"等占位符。
注意：正文里避免使用英文双引号，强调词请使用中文书名号或括号。

只返回JSON数组，不要任何其他文字：
[{"label":"V1","style":"风格名（4-6字）","stars":5,"title":"标题（15-28字）","body":"正文（分段落，符合字数要求）","tags":["#话题1","#话题2","#话题3","#话题4","#话题5"],"metrics":{"hotWords":4,"sentiment":90,"predictLikes":"1.2k","riskWords":0},"suggestion":"一句优化建议（不超过40字）"},{"label":"V2",...},{"label":"V3",...}]`;

    const mmRes = await fetch("https://api.minimax.chat/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        messages: [
          {
            role: "system",
            content: "你是专业的小红书内容创作者。请只输出JSON数组，不输出任何其他文字或解释。",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.85,
        max_tokens: 4000,
      }),
    });

    const mmText = await mmRes.text();

    if (!mmRes.ok) {
      return res.status(502).json({ error: `MiniMax API error: ${mmText}` });
    }

    let mmData: any;
    try {
      mmData = JSON.parse(mmText);
    } catch {
      return res.status(502).json({ error: `MiniMax returned non-JSON: ${mmText.slice(0, 300)}` });
    }

    const content: string =
      mmData.choices?.[0]?.message?.content ??
      mmData.choices?.[0]?.message?.reasoning_content ??
      "";

    if (!content) {
      return res.status(500).json({
        error: `Empty content from model. Full response: ${mmText.slice(0, 500)}`,
      });
    }

    let raw: any[];
    try {
      raw = extractJsonArray(content);
    } catch (e: any) {
      return res.status(500).json({ error: `JSON parse failed: ${e.message}` });
    }

    const versions: NoteVersion[] = raw.slice(0, 3).map((v, i) => ({
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

    return res.status(200).json({ versions } as GenerateNotesResponse);
  } catch (e: any) {
    return res.status(500).json({ error: e.message ?? "Unexpected error" });
  }
}
