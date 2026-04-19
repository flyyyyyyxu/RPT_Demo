/*
 * Step2 "无链接快速生成" competitor insights.
 * Separate from /api/competitor-insight so the link-based Step1 flow
 * stays untouched. Output shape is identical so downstream code
 * (selectedInsights → generate-notes) does not need to know the source.
 */
import type {
  CompetitorInsightInferredRequest,
  CompetitorInsightResponse,
  CompetitorInsightItem,
} from "../shared/types";
import { extractJsonArray } from "./_utils/parseInsightJson";

const OUTPUT_EXAMPLE =
  '[{"label":"洞察类型","detail":"具体可操作的洞察（20-45字）"},...]';

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "MINIMAX_API_KEY not configured" });

    const {
      productName,
      sellingPoints,
      targetAudience,
      category,
      subcategory,
      usageScenarios,
      priceRange,
    }: CompetitorInsightInferredRequest = req.body;

    const productInfoLines = [
      `名称：${productName || "未填写"}`,
      `卖点：${(sellingPoints ?? []).join("、") || "未填写"}`,
      `目标人群：${(targetAudience ?? []).join("、") || "未填写"}`,
      category ? `品类：${category}${subcategory ? ` / ${subcategory}` : ""}` : "",
      usageScenarios && usageScenarios.length > 0
        ? `使用场景：${usageScenarios.join("、")}`
        : "",
      priceRange ? `价格区间：${priceRange}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `你是小红书商业化内容策略专家。你的任务是产出与 Step1 竞品洞察完全一致的输出格式、分析维度与颗粒度；区别只在于：当用户未提供竞品链接时，洞察来源不是具体链接内容，而是基于商品信息，对小红书同类内容的常见写法、用户决策关注点和内容竞争格局进行推断。

【我方商品】
${productInfoLines}

【洞察来源】未提供竞品链接，请仅基于商品信息，按照 Step1 相同维度生成竞品洞察；不要改变输出结构，不要额外新增模块。

你的目标不是做行业分析，而是生成与 Step1 完全同结构的竞品洞察，供后续内容生成直接使用。

请严格按照以下要求分析：
- 沿用 Step1 相同的分析维度：点击钩子、卖点表达、人群指向、场景包装、真实感来源、转化引导、差异化机会
- 不要输出"缺少竞品""建议补充链接""无法准确判断"之类的话，而是直接基于商品信息推断同类内容常见策略，并转成可指导我方文案的洞察
- 每条洞察都必须能直接指导我方文案该怎么写，而不是停留在描述层
- 保持与 Step1 一致的表达风格：简洁、明确、可落地，不空泛，不写技术信息，不写无效建议

输出要求：
- 只返回 JSON 数组，不要任何解释、标题、前后缀
- 共返回 5 条
- 每条都包含 label 和 detail 两个字段
- label 必须优先从以下分类中选择：点击钩子/卖点表达/人群指向/场景包装/真实感来源/转化引导/差异化机会
- detail 必须是具体、可执行的内容策略建议，直接服务于我方后续文案生成

返回格式示例：
${OUTPUT_EXAMPLE}`;

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
