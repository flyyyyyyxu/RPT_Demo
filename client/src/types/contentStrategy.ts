/*
 * Content strategy types shared across config / utils / pages.
 * Values must match the `id` strings used in CreateStep2.tsx option arrays.
 */

export type NoteType =
  | "直接种草"
  | "真实分享"
  | "场景安利"
  | "攻略测评"
  | "话题共鸣";

export type ToneStyle =
  | "朋友安利感"
  | "真实自述感"
  | "专业判断感"
  | "轻松有梗感"
  | "温柔治愈感";

export type TitleStyle =
  | "结果种草型"
  | "场景代入型"
  | "情绪共鸣型"
  | "信息决策型"
  | "反差悬念型";

export type BodyStyle =
  | "亮点展开式"
  | "体验叙述式"
  | "场景带入式"
  | "对比分析式"
  | "情绪共振式";

export type ContentDriverType =
  | "功能决策型"
  | "体验分享型"
  | "场景种草型"
  | "情绪共鸣型";

// Loose input shape — most fields optional so recommender tolerates partial data.
export interface ProductInfoForRec {
  matchedCategoryId?: string; // preset id; takes priority over category string
  category?: string;
  subcategory?: string;
  productName?: string;
  productDescription?: string;
  productKeywords?: string[];
  sellingPoints?: string[];
  targetAudience?: string[];
  usageScenarios?: string[];
  priceRange?: string;
}

export interface RecommendedStrategy {
  noteType: NoteType;
  toneStyle: ToneStyle;
  titleStyle: TitleStyle;
  bodyStyle: BodyStyle;
  driverType: ContentDriverType;
  reason: string;
}
