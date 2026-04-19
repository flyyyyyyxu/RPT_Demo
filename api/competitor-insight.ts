import type { CompetitorInsightRequest, CompetitorInsightResponse, CompetitorInsightItem } from "../shared/types";
import { extractJsonArray } from "./_utils/parseInsightJson";

const STEP1_ANALYSIS_RULES = [
  "从小红书商业化内容视角分析竞品，重点判断其在信息流/搜索场景中为什么容易吸引点击与转化",
  "优先拆解竞品的核心卖点表达、目标人群指向、种草钩子、场景包装与行动引导方式",
  "结合小红书用户决策链路，提炼哪些内容更容易建立真实感、降低广告感、提升购买意愿",
  "分析竞品内容与我方商品之间的可借鉴点和差异化机会，但重点仍放在指导我方文案怎么写",
  "每条洞察都要落到可直接复用的文案建议，避免空泛评价，尽量指出建议强化或规避的表达方式",
  "不要输出抓取状态、技术异常、HTTP状态码、无法访问等提示，不要写成技术分析报告",
];

const STEP1_OUTPUT_EXAMPLE =
  '[{"label":"洞察类型","detail":"具体可操作的洞察（20-45字）"},...]';

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
    if (!res.ok) return `无法访问：HTTP ${res.status}`;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html") && !contentType.includes("text")) {
      return "非文本内容，跳过";
    }
    const html = await res.text();
    const text = htmlToText(html).slice(0, 6000);
    return text || "页面内容为空";
  } catch (e: any) {
    return `抓取失败：${e.message}`;
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

    const prompt = `你是小红书商业化内容策略专家，任务不是泛泛点评竞品，而是站在“小红书广告内容产品/商家投放辅助工具”的视角，输出能直接指导我方生成文案的竞品洞察。

【我方商品】
名称：${productName}
卖点：${sellingPoints.join("、")}

${urlSection ? `【竞品内容】\n${urlSection}` : "（未提供竞品链接，请基于品类通用内容表现分析）"}

你的分析目标：
1. 判断竞品内容为什么更容易在小红书信息流/搜索场景中被点击、被信任、被转化
2. 识别竞品在卖点表达、标题钩子、场景带入、口吻真实感、种草节奏、行动引导上的有效写法
3. 输出的每条洞察都必须能反向指导“我方文案该怎么写、该强调什么、该避免什么”

分析要求：
${STEP1_ANALYSIS_RULES.map((rule, i) => `${i + 1}. ${rule}`).join("\n")}

输出要求：
- 只返回 JSON 数组，不要任何解释、标题、前后缀
- 共返回 5 条
- 每条都包含 label 和 detail 两个字段
- label 必须优先从以下分类中选择：点击钩子/卖点表达/人群指向/场景包装/真实感来源/转化引导/差异化机会
- detail 必须是具体、可执行的内容策略建议，直接服务于我方后续文案生成
- 不要写“竞品做得很好”“可以参考”这类空话
- 不要复述链接抓取失败、网页异常、无法访问等技术信息

返回格式示例：
${STEP1_OUTPUT_EXAMPLE}`;

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
