/*
 * Pure content-strategy recommender. No React, no async, no external deps.
 *
 * Pipeline:
 *   1. build search text from product fields
 *   2. normalize category → lookup driverType (fallback-aware)
 *   3. driver → base strategy core
 *   4. keyword rules patch core (last hit wins on overlap)
 *   5. assemble reason
 * Always returns a valid RecommendedStrategy, even on null/empty input.
 */
import {
  CATEGORY_DRIVER_MAP,
  DRIVER_STRATEGY_MAP,
  FALLBACK_STRATEGY,
  STRATEGY_RULES,
  type StrategyCore,
} from "../config/contentStrategy";
import type {
  ProductInfoForRec,
  RecommendedStrategy,
} from "../types/contentStrategy";
import { normalizeCategory } from "./normalizeCategory";
import { getPresetById } from "../config/productCategoryPresets";

function collectSearchText(p: ProductInfoForRec): string {
  return [
    p.category,
    p.subcategory,
    p.productName,
    p.productDescription,
    ...(p.productKeywords ?? []),
    ...(p.sellingPoints ?? []),
    ...(p.targetAudience ?? []),
    ...(p.usageScenarios ?? []),
    p.priceRange,
  ]
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .join(" ");
}

export function recommendContentStrategy(
  info: ProductInfoForRec | null | undefined
): RecommendedStrategy {
  const p: ProductInfoForRec = info ?? {};
  const searchText = collectSearchText(p);

  // Step 1–3: resolve driverType.
  // Priority 1: stable preset id (from LLM or local fallback) → direct lookup.
  // Priority 2: normalize category string → CATEGORY_DRIVER_MAP.
  // Priority 3: scan searchText for any known category word.
  let driverType = p.matchedCategoryId
    ? getPresetById(p.matchedCategoryId)?.driverType
    : undefined;
  let matchedCategoryKey = driverType ? (p.matchedCategoryId ?? "") : "";

  const normalized = normalizeCategory(p.category, p.subcategory);
  if (!driverType) {
    driverType = normalized ? CATEGORY_DRIVER_MAP[normalized] : undefined;
    matchedCategoryKey = driverType ? (normalized ?? "") : "";
  }

  if (!driverType && searchText) {
    for (const [cat, driver] of Object.entries(CATEGORY_DRIVER_MAP)) {
      if (searchText.includes(cat)) {
        driverType = driver;
        matchedCategoryKey = cat;
        break;
      }
    }
  }

  const usingFallbackDriver = !driverType;
  const effectiveDriver = driverType ?? FALLBACK_STRATEGY.driverType;

  // Step 4: base strategy from driver, then keyword patches (last hit wins).
  const driverBase = DRIVER_STRATEGY_MAP[effectiveDriver];
  const base: StrategyCore = driverBase ?? {
    noteType: FALLBACK_STRATEGY.noteType,
    toneStyle: FALLBACK_STRATEGY.toneStyle,
    titleStyle: FALLBACK_STRATEGY.titleStyle,
    bodyStyle: FALLBACK_STRATEGY.bodyStyle,
  };
  let current: StrategyCore = { ...base };

  const hitSnippets: string[] = [];
  for (const rule of STRATEGY_RULES) {
    const hit =
      searchText && rule.keywords.some((k) => searchText.includes(k));
    if (hit) {
      current = { ...current, ...rule.patch };
      hitSnippets.push(rule.reasonSnippet);
    }
  }

  // Step 5: reason assembly.
  const reasonParts: string[] = [];
  if (usingFallbackDriver) {
    reasonParts.push(
      normalized
        ? `未识别品类「${normalized}」，按${effectiveDriver}方向兜底`
        : "商品信息较少，按体验分享方向兜底"
    );
  } else {
    reasonParts.push(
      `品类「${matchedCategoryKey}」偏${effectiveDriver}`
    );
  }
  if (hitSnippets.length > 0) {
    // Dedupe while preserving order.
    const uniq = Array.from(new Set(hitSnippets));
    reasonParts.push(uniq.join("+"));
  }
  const reason = reasonParts.join("，");

  return {
    driverType: effectiveDriver,
    noteType: current.noteType,
    toneStyle: current.toneStyle,
    titleStyle: current.titleStyle,
    bodyStyle: current.bodyStyle,
    reason,
  };
}
