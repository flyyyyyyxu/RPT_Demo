/*
 * Normalize user-entered category/subcategory strings to a canonical category
 * key. Returns the original value (or "") when nothing matches — never throws.
 */

const NORMALIZATION_RULES: Array<{ keywords: string[]; to: string }> = [
  { keywords: ["宠物", "狗", "猫"], to: "宠物用品" },
  { keywords: ["家居", "收纳", "摆件"], to: "家居小物" },
  { keywords: ["护肤", "面霜", "精华"], to: "护肤" },
  { keywords: ["零食", "食品", "饮料"], to: "食品" },
  { keywords: ["数码", "耳机", "手机"], to: "数码" },
];

export function normalizeCategory(
  category?: string | null,
  subcategory?: string | null
): string {
  const raw = [category, subcategory].filter(Boolean).join(" ").trim();
  if (!raw) return "";
  for (const rule of NORMALIZATION_RULES) {
    if (rule.keywords.some((k) => raw.includes(k))) return rule.to;
  }
  return (category || subcategory || "").trim();
}
