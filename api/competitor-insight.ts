import type { CompetitorInsightRequest, CompetitorInsightResponse, CompetitorInsightItem } from "../shared/types";

function sanitizeJson(text: string): string {
  return text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/[\u201c\u201d\u2018\u2019\u300c\u300d\uff02]/g, '"')
    .replace(/\uff1a/g, ":")
    .replace(/\uff0c/g, ",")
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
  return JSON.parse(s.slice(start, end + 1));
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchUrlContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) return `[无法访问，HTTP ${res.status}]`;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html") && !contentType.includes("text")) {
      return "[非文本内容，跳过]";
    }
    const html = await res.text();
    const text = htmlToText(html).slice(0, 2500);
    return text || "[页面内容为空]";
  } catch (e: any) {
    return `[抓取失败：${e.message}]`;
  }
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s，。；\n]+/g;
  return (text.match(urlRegex) ?? []).slice(0, 3); // max 3 URLs
}

// Node.js runtime (default) — avoids Edge Runtime URL pattern quirks
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "MINIMAX_API_KEY not configured" });

    const { competitorLinks, productName, sellingPoints }: CompetitorInsightRequest = req.body;

    // Actually fetch the competitor URLs to get real content
    const urls = extractUrls(competitorLinks);
    let urlSection = "";

    if (urls.length > 0) {
      const fetched = await Promise.all(urls.map(fetchUrlContent));
      urlSection = urls
        .map((url, i) => `【竞品链接${i + 1}】${url}\n【内容摘录】${fetched[i]}`)
        .join("\n\n");
    } else if (competitorLinks.trim()) {
      // No valid URLs, treat as keyword/description
      urlSection = `【竞品关键词/描述】${competitorLinks}`;
    }

    const prompt = `你是小红书内容竞品分析专家。

【我方商品】
名称：${productName}
卖点：${sellingPoints.join("、")}

${urlSection ? `【竞品内容】\n${urlSection}` : "（未提供竞品链接，请基于品类通用知识分析）"}

分析要求：
1. 主要分析竞品内容本身（用户痛点、爆款话术、情感锚点、内容结构）
2. 少量分析竞品与我方商品的关系（差异化机会、可借鉴点）
3. 每条洞察都要具体、可操作，直接指导文案创作

只返回JSON数组，不要任何其他文字：
[{"label":"洞察类型","detail":"具体可操作的洞察（20-45字）"},...]
（共5条，label优先从：用户高频痛点/爆款话术/情感锚点/竞品差异/可借鉴结构/价格话术/场景共鸣 中选取）`;

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
        max_tokens: 1000,
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
        error: `Empty content from model. Response: ${mmText.slice(0, 300)}`,
      });
    }

    let raw: any[];
    try {
      raw = extractJsonArray(content);
    } catch (e: any) {
      return res.status(500).json({ error: `JSON parse failed: ${e.message}` });
    }

    const insights: CompetitorInsightItem[] = raw.slice(0, 5).map((item) => ({
      label: item.label ?? "洞察",
      detail: item.detail ?? "",
      status: "pending" as const,
    }));

    return res.status(200).json({ insights } as CompetitorInsightResponse);
  } catch (e: any) {
    return res.status(500).json({ error: e.message ?? "Unexpected error" });
  }
}
