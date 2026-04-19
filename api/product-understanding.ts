/*
 * Product understanding: LLM maps free-form product name/description onto
 * the fixed CATEGORY_PRESETS id set. Server-side validation enforces three
 * hard gates — JSON parseable, id in enum, confidence >= threshold — so the
 * client only ever sees {matched: true, result} or {matched: false, ...}.
 *
 * LLM does NOT decide strategy fields (noteType/titleStyle/...). It only
 * classifies. Strategy mapping stays in config/contentStrategy.ts.
 */
import type {
  ProductUnderstandingRequest,
  ProductUnderstandingResponse,
  ProductUnderstandingResult,
} from "../shared/types";
import {
  CATEGORY_PRESETS,
  CATEGORY_PRESET_IDS,
} from "../client/src/config/productCategoryPresets";
import { extractJsonObject } from "./_utils/parseInsightJson";

const CONFIDENCE_THRESHOLD = 0.6;
const MAX_KEYWORDS = 8;
const MAX_SCENARIOS = 4;

function buildPresetCatalog(): string {
  return CATEGORY_PRESETS.map((p) => {
    const kw = p.keywords.slice(0, 3).join("/");
    return `- ${p.id}: ${p.name} (${kw})`;
  }).join("\n");
}

function asStringArray(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim())
    .slice(0, limit);
}

function fallback(reason: string): ProductUnderstandingResponse {
  return { matched: false, result: null, fallbackReason: reason };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "MINIMAX_API_KEY not configured" });

    const {
      productName,
      productDescription,
      sellingPoints,
      targetAudience,
    }: ProductUnderstandingRequest = req.body ?? {};

    if (!productName || !productName.trim()) {
      return res.status(400).json({ error: "productName is required" });
    }

    const productInfoLines = [
      `名称：${productName.trim()}`,
      `描述：${productDescription?.trim() || "未填写"}`,
      `用户已选卖点：${(sellingPoints ?? []).join("、") || "未填写"}`,
      `用户已选目标人群：${(targetAudience ?? []).join("、") || "未填写"}`,
    ].join("\n");

    const prompt = `你是小红书商品品类归类助手。任务：基于商品信息，把它归到下表中**恰好一个**品类 id。只做归类，不生成任何内容策略。

【商品信息】
${productInfoLines}

【候选品类集合】（matchedCategoryId 必须严格从这里的 id 中选一个；若所有品类都明显不符合，填 null）
${buildPresetCatalog()}

【输出要求】
- 只返回一个 JSON 对象，不要任何解释、前后缀、代码块标记
- 字段必须齐全，不允许遗漏

【JSON 格式】
{
  "matchedCategoryId": "上表中的 id，找不到就填 null",
  "confidence": 0 到 1 之间的浮点数（越高越确定）,
  "productKeywords": ["从商品信息中提炼的关键词，3-8 个，去重"],
  "usageScenarios": ["商品典型使用场景，1-4 个，如：通勤/居家/熬夜/送礼"],
  "reason": "30 字内说明判断依据"
}`;

    const mmRes = await fetch("https://api.minimax.chat/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "MiniMax-M2.7",
        messages: [
          { role: "system", content: "只输出一个 JSON 对象，不输出任何其他文字。" },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    const mmText = await mmRes.text();

    if (!mmRes.ok) {
      return res.status(502).json({ error: `MiniMax API error: ${mmText.slice(0, 300)}` });
    }

    let mmData: any;
    try {
      mmData = JSON.parse(mmText);
    } catch {
      return res.status(502).json({ error: `MiniMax returned non-JSON envelope` });
    }

    const rawContent: string =
      mmData.choices?.[0]?.message?.content ??
      mmData.choices?.[0]?.message?.reasoning_content ??
      "";

    // Strip reasoning tags that thinking models may emit (<think>...</think>).
    const content = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    if (!content) {
      return res.status(200).json(fallback("LLM returned empty content"));
    }

    // Gate 1: JSON parse.
    let raw: Record<string, any>;
    try {
      raw = extractJsonObject(content);
    } catch (e: any) {
      return res.status(200).json(fallback(`JSON parse failed: ${e.message}`));
    }

    // Gate 2: matchedCategoryId ∈ enum.
    const idCandidate = raw.matchedCategoryId;
    if (typeof idCandidate !== "string" || !CATEGORY_PRESET_IDS.includes(idCandidate)) {
      return res.status(200).json(fallback(
        idCandidate == null
          ? "LLM could not match any preset"
          : `matchedCategoryId "${idCandidate}" not in preset enum`
      ));
    }

    // Gate 3: confidence threshold.
    const confidence = typeof raw.confidence === "number" ? raw.confidence : -1;
    if (!(confidence >= 0 && confidence <= 1)) {
      return res.status(200).json(fallback(`invalid confidence value: ${raw.confidence}`));
    }
    if (confidence < CONFIDENCE_THRESHOLD) {
      return res.status(200).json(fallback(`low confidence: ${confidence.toFixed(2)}`));
    }

    const result: ProductUnderstandingResult = {
      matchedCategoryId: idCandidate,
      confidence,
      productKeywords: asStringArray(raw.productKeywords, MAX_KEYWORDS),
      usageScenarios: asStringArray(raw.usageScenarios, MAX_SCENARIOS),
      reason: typeof raw.reason === "string" ? raw.reason.slice(0, 80) : "",
    };

    return res.status(200).json({ matched: true, result } as ProductUnderstandingResponse);
  } catch (e: any) {
    return res.status(500).json({ error: e.message ?? "Unexpected error" });
  }
}
