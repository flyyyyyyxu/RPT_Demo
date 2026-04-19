export interface ProductSemanticResult {
  category: string;
  subcategory: string;
  usageScenarios: string[];
  productKeywords: string[];
  priceRange: string;
  priceMin: string;
  priceMax: string;
}

interface CategoryRule {
  category: string;
  subcategory: string;
  keywords: string[];
  priceMin: number;
  priceMax: number;
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "护肤",
    subcategory: "洁面/基础护肤",
    keywords: ["护肤", "洁面", "洗面奶", "面霜", "精华", "爽肤水", "乳液", "氨基酸", "敏感肌", "保湿", "控油"],
    priceMin: 59,
    priceMax: 199,
  },
  {
    category: "彩妆",
    subcategory: "美妆",
    keywords: ["彩妆", "口红", "粉底", "眼影", "腮红", "眉笔", "睫毛膏", "唇釉", "遮瑕"],
    priceMin: 49,
    priceMax: 169,
  },
  {
    category: "食品",
    subcategory: "零食/饮品",
    keywords: ["零食", "食品", "饼干", "饮料", "咖啡", "茶", "代餐", "坚果", "低卡", "速食"],
    priceMin: 19,
    priceMax: 89,
  },
  {
    category: "家居",
    subcategory: "家居小物",
    keywords: ["家居", "收纳", "香薰", "杯子", "摆件", "床品", "清洁", "厨房", "浴室"],
    priceMin: 29,
    priceMax: 159,
  },
  {
    category: "数码",
    subcategory: "数码配件",
    keywords: ["数码", "耳机", "充电", "手机", "键盘", "鼠标", "支架", "音箱", "续航", "参数"],
    priceMin: 99,
    priceMax: 499,
  },
  {
    category: "宠物",
    subcategory: "宠物用品",
    keywords: ["宠物", "猫", "狗", "猫砂", "狗粮", "猫粮", "牵引", "玩具", "罐头"],
    priceMin: 39,
    priceMax: 199,
  },
  {
    category: "穿搭",
    subcategory: "服饰配饰",
    keywords: ["穿搭", "衣服", "外套", "裙", "裤", "鞋", "包", "项链", "耳环", "配饰"],
    priceMin: 79,
    priceMax: 399,
  },
];

const SCENARIO_RULES: Array<{ keywords: string[]; scenario: string }> = [
  { keywords: ["通勤", "上班", "办公室"], scenario: "通勤办公" },
  { keywords: ["旅行", "出差", "便携"], scenario: "旅行出差" },
  { keywords: ["学生", "宿舍", "开学"], scenario: "学生日常" },
  { keywords: ["宝妈", "亲子", "宝宝"], scenario: "亲子家庭" },
  { keywords: ["送礼", "礼物", "生日"], scenario: "送礼场景" },
  { keywords: ["熬夜", "夜间", "晚安"], scenario: "夜间修护" },
  { keywords: ["油皮", "控油", "出油"], scenario: "油皮护理" },
  { keywords: ["敏感肌", "温和", "泛红"], scenario: "敏感肌护理" },
];

const TOKEN_SPLIT_RE = /[\s,，.。;；、/|｜:：()（）【】\[\]{}]+/;

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function collectKeywordHits(text: string): string[] {
  const explicitTokens = text
    .split(TOKEN_SPLIT_RE)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && token.length <= 12);

  const ruleHits = CATEGORY_RULES.flatMap((rule) =>
    rule.keywords.filter((keyword) => text.includes(keyword))
  );
  const scenarioHits = SCENARIO_RULES.flatMap((rule) =>
    rule.keywords.filter((keyword) => text.includes(keyword))
  );

  return unique([...ruleHits, ...scenarioHits, ...explicitTokens]).slice(0, 10);
}

function pickCategory(text: string): CategoryRule | null {
  let best: { rule: CategoryRule; score: number } | null = null;

  for (const rule of CATEGORY_RULES) {
    const score = rule.keywords.reduce(
      (sum, keyword) => sum + (text.includes(keyword) ? 1 : 0),
      0
    );
    if (score > 0 && (!best || score > best.score)) {
      best = { rule, score };
    }
  }

  return best?.rule ?? null;
}

export function inferProductSemantics(
  productName: string,
  productDescription: string,
  sellingPoints: string[] = [],
  targetAudience: string[] = []
): ProductSemanticResult {
  const text = [productName, productDescription, ...sellingPoints, ...targetAudience]
    .filter(Boolean)
    .join(" ");
  const categoryRule = pickCategory(text);
  const usageScenarios = SCENARIO_RULES
    .filter((rule) => rule.keywords.some((keyword) => text.includes(keyword)))
    .map((rule) => rule.scenario);
  const productKeywords = collectKeywordHits(text);
  const priceMin = categoryRule ? String(categoryRule.priceMin) : "";
  const priceMax = categoryRule ? String(categoryRule.priceMax) : "";

  return {
    category: categoryRule?.category ?? "",
    subcategory: categoryRule?.subcategory ?? "",
    usageScenarios: unique(usageScenarios),
    productKeywords,
    priceMin,
    priceMax,
    priceRange: priceMin && priceMax ? `¥${priceMin} – ${priceMax}` : "",
  };
}

export function formatPriceRange(priceMin: string, priceMax: string): string {
  if (priceMin && priceMax) return `¥${priceMin} – ${priceMax}`;
  if (priceMin) return `¥${priceMin} 起`;
  if (priceMax) return `¥${priceMax} 内`;
  return "";
}

export function parsePriceRange(priceRange: string): { priceMin: string; priceMax: string } {
  const numbers = priceRange.match(/\d+(?:\.\d+)?/g) ?? [];
  return {
    priceMin: numbers[0] ?? "",
    priceMax: numbers[1] ?? "",
  };
}
