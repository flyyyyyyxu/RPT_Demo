/*
 * Offline fallback for /api/product-understanding.
 *
 * Pure function: scans CATEGORY_PRESETS[*].keywords as substrings in the
 * concatenated product text, picks the highest-scoring preset, and returns a
 * result with the SAME shape as the server endpoint.
 *
 * Returns null when no preset keyword hits — caller should then use
 * FALLBACK_PRESET. Never throws.
 *
 * Confidence is intentionally capped below LLM-typical values so callers that
 * prefer LLM results on ties will do the right thing.
 */
import type { ProductUnderstandingResult } from "../../../shared/types";
import {
  CATEGORY_OVERRIDES,
  CATEGORY_PRESETS,
  type CategoryPreset,
} from "../config/productCategoryPresets";

const LOCAL_CONFIDENCE_CAP = 0.7;
const MAX_KEYWORDS = 8;

export interface LocalUnderstandingInput {
  productName: string;
  productDescription?: string;
  sellingPoints?: string[];
  targetAudience?: string[];
}

function buildSearchText(input: LocalUnderstandingInput): string {
  return [
    input.productName,
    input.productDescription ?? "",
    ...(input.sellingPoints ?? []),
    ...(input.targetAudience ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

interface Scored {
  preset: CategoryPreset;
  hits: string[];
}

function weight(hits: string[]): number {
  // Long keywords are more specific (e.g. "空气炸锅" beats "锅"); weight by
  // total hit length so longer, more specific keywords dominate tie-breaks.
  return hits.reduce((sum, h) => sum + h.length, 0);
}

function scorePresets(text: string): Scored[] {
  const scored: Scored[] = [];
  for (const preset of CATEGORY_PRESETS) {
    const hits = preset.keywords.filter((k) => text.includes(k));
    if (hits.length > 0) scored.push({ preset, hits });
  }
  // Primary: weighted hit length. Secondary: raw hit count. Stable sort keeps
  // declaration order as a final tie-break.
  scored.sort((a, b) => {
    const w = weight(b.hits) - weight(a.hits);
    if (w !== 0) return w;
    return b.hits.length - a.hits.length;
  });
  return scored;
}

function collectOverrideHits(text: string): string[] {
  const out: string[] = [];
  for (const ov of CATEGORY_OVERRIDES) {
    for (const m of ov.match) {
      if (text.includes(m)) out.push(m);
    }
  }
  return out;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function inferProductUnderstandingLocal(
  input: LocalUnderstandingInput
): ProductUnderstandingResult | null {
  if (!input.productName || !input.productName.trim()) return null;

  const text = buildSearchText(input);
  const scored = scorePresets(text);
  if (scored.length === 0) return null;

  const top = scored[0];
  // Confidence: 1 hit → 0.45, 2 → 0.60, 3+ → 0.70 (capped).
  const confidence = Math.min(LOCAL_CONFIDENCE_CAP, 0.3 + top.hits.length * 0.15);

  const productKeywords = unique([
    ...top.hits,
    ...collectOverrideHits(text),
  ]).slice(0, MAX_KEYWORDS);

  return {
    matchedCategoryId: top.preset.id,
    confidence,
    productKeywords,
    usageScenarios: [],
    reason: `本地关键词命中「${top.preset.name}」${top.hits.length} 个：${top.hits.slice(0, 3).join("、")}`,
  };
}
