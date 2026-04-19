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

    const { productInfo, contentStrategy, competitorInsights = [], selectedInsights = [] }: GenerateNotesRequest & any = req.body;
    const bodyStyle = contentStrategy.bodyStyle || contentStrategy.articleStyle || "";

    const usableInsights = Array.isArray(selectedInsights) && selectedInsights.length > 0
      ? selectedInsights
      : Array.isArray(competitorInsights)
        ? competitorInsights
        : [];

    const competitorInsightText = usableInsights.length > 0
      ? usableInsights
          .slice(0, 5)
          .map((item: any, index: number) => {
            const label = item?.label ? String(item.label) : `洞察${index + 1}`;
            const detail = item?.detail ? String(item.detail) : "";
            return `${index + 1}. 【${label}】${detail}`;
          })
          .join("\n")
      : "（未提供竞品洞察）";

    const dynamicVersionRules = [
      `- V1：严格以用户选择为主，组合“${contentStrategy.toneStyle} + ${contentStrategy.noteType} + ${contentStrategy.titleStyle} + ${bodyStyle}”生成主版本，作为最贴近用户预期的成稿`,
      `- V2：在不脱离用户选择的前提下，优先吸收竞品洞察里最值得借鉴的一类表达方式，强化真实感、说服力或转化效率，形成第二种写法，不要写成固定的“干货科普风”`,
      `- V3：基于另一种差异化表达路径生成，例如切换叙述视角、开头钩子、场景结构、情绪浓度或节奏感，形成第三种写法，不要写成固定的“真实日记风”`,
      `- 三个版本都必须围绕同一商品事实，不得捏造功效、成分实验、用户评价、品牌背景或价格优惠信息`,
      `- 三个版本要有明显区分，区分点优先来自：标题切口、开头方式、场景包装、论证顺序、情绪强弱、行动引导，而不是只替换同义词`,
    ].join("\n");

    const prompt = `你是小红书商业化内容创作助手。请基于商品事实、用户选择的内容偏好，以及竞品洞察，生成3个可直接预览的小红书笔记版本。

【任务目标】
不是随意生成3篇文案，而是：
1. 先吸收用户选择的语气风格、标题风格、正文风格、情绪浓度、节奏感
2. 再结合竞品洞察中值得借鉴的表达方式，提升内容的真实感、可信度和转化潜力
3. 最终输出3个“方向不同但都成立”的版本，便于用户在预览页比较与选择

【商品信息】
商品名称：${productInfo.name}
核心卖点：${productInfo.sellingPoints.join("、")}
目标人群：${productInfo.targetAudience.join("、") || "通用"}
价格区间：${productInfo.priceRange || "未填写"}
字数要求：${productInfo.wordCount || "300-450字"}

【用户选择的内容偏好】
笔记类型：${contentStrategy.noteType}
语气风格：${contentStrategy.toneStyle}
标题风格：${contentStrategy.titleStyle}
正文风格：${bodyStyle}
自定义强调：${contentStrategy.customHighlights || "无"}
自定义氛围：${contentStrategy.customToneNotes || "无"}
避免表达：${contentStrategy.customAvoidances || "无"}
情绪浓度：${contentStrategy.emotionLevel}/100
节奏感：${contentStrategy.rhythmLevel}/100

【竞品洞察】
${competitorInsightText}

【生成策略】
- 参考优先级：商品真实信息 > 用户选择的内容偏好 > 竞品洞察 > 平台常见表达
- 竞品洞察的作用不是让你模仿竞品，而是帮助你判断：哪些表达更容易建立真实感、降低广告感、提升点击和转化
- 如果竞品洞察与商品事实冲突，以商品事实为准
- 如果竞品洞察为空，则主要依据商品信息和用户选择生成

【三版本生成规则】
${dynamicVersionRules}

【真实性要求】
- 不要编造具体实验数据、医生背书、权威认证、销量排名、用户评价截图、使用天数等不存在的信息
- 不要把普通卖点写成绝对化承诺，如“根治”“100%有效”“谁用都适合”
- 可以增强表达，但必须保持像真实用户会写的话，不要过度营销、不要悬浮夸张
- 注意：直接用商品名称，不要使用“XX品牌”等占位符
- 注意：正文里避免使用英文双引号，强调词请使用中文书名号或括号

【输出要求】
- 只返回JSON数组，不要任何其他文字
- 返回3条，分别对应V1、V2、V3
- 每条都包含 label、style、stars、title、body、tags、metrics、suggestion
- style 要概括该版本的表达路线，控制在4-6字
- title 要和该版本策略一致，避免三个标题只是轻微改写
- body 要分段，符合字数要求，并体现版本差异
- tags 保持5个，贴近小红书常见话题表达
- suggestion 要写这一版还能怎么优化，不超过40字

只返回以下格式：
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
