/*
 * Content strategy config: category→driver map, driver→strategy map,
 * keyword rules, and a global fallback. Keep this file declarative —
 * no page logic, no React imports.
 */
import type {
  BodyStyle,
  ContentDriverType,
  NoteType,
  RecommendedStrategy,
  TitleStyle,
  ToneStyle,
} from "../types/contentStrategy";

// Category (or normalized category) → content driver type.
// Ordering doesn't matter here; lookup is by exact key.
export const CATEGORY_DRIVER_MAP: Record<string, ContentDriverType> = {
  宠物: "场景种草型",
  宠物用品: "场景种草型",
  宠物服饰: "情绪共鸣型",
  家居: "场景种草型",
  家居小物: "场景种草型",
  家居装饰: "情绪共鸣型",
  护肤: "功能决策型",
  彩妆: "体验分享型",
  个护: "体验分享型",
  食品: "体验分享型",
  零食: "体验分享型",
  饮品: "体验分享型",
  穿搭: "场景种草型",
  配饰: "情绪共鸣型",
  数码: "功能决策型",
  家电: "功能决策型",
  礼物: "情绪共鸣型",
  节日礼品: "情绪共鸣型",
  日用品: "体验分享型",
  清洁: "功能决策型",
};

export interface StrategyCore {
  noteType: NoteType;
  toneStyle: ToneStyle;
  titleStyle: TitleStyle;
  bodyStyle: BodyStyle;
}

export const DRIVER_STRATEGY_MAP: Record<ContentDriverType, StrategyCore> = {
  功能决策型: {
    noteType: "攻略测评",
    toneStyle: "专业判断感",
    titleStyle: "信息决策型",
    bodyStyle: "对比分析式",
  },
  体验分享型: {
    noteType: "真实分享",
    toneStyle: "真实自述感",
    titleStyle: "结果种草型",
    bodyStyle: "体验叙述式",
  },
  场景种草型: {
    noteType: "场景安利",
    toneStyle: "温柔治愈感",
    titleStyle: "场景代入型",
    bodyStyle: "场景带入式",
  },
  情绪共鸣型: {
    noteType: "话题共鸣",
    toneStyle: "朋友安利感",
    titleStyle: "情绪共鸣型",
    bodyStyle: "情绪共振式",
  },
};

export const FALLBACK_STRATEGY: RecommendedStrategy = {
  driverType: "体验分享型",
  noteType: "真实分享",
  toneStyle: "真实自述感",
  titleStyle: "结果种草型",
  bodyStyle: "体验叙述式",
  reason: "信息较少，默认按真实分享方向推荐，可根据实际偏好手动调整",
};

export interface StrategyRule {
  id: string;
  keywords: string[];
  reasonSnippet: string;
  // Any subset of the strategy fields — unspecified fields are left untouched.
  patch: Partial<StrategyCore>;
}

// Keyword rules applied AFTER the driver base. Later rules override earlier ones
// when their patches overlap (deterministic "last hit wins" via shallow merge).
export const STRATEGY_RULES: StrategyRule[] = [
  {
    id: "scene",
    keywords: ["通勤", "出差", "遛狗", "宅家", "旅行", "约会", "送礼", "冬天", "办公室"],
    reasonSnippet: "场景属性强",
    patch: {
      noteType: "场景安利",
      titleStyle: "场景代入型",
      bodyStyle: "场景带入式",
    },
  },
  {
    id: "emotion",
    keywords: ["可爱", "治愈", "萌", "颜值", "氛围感", "高级感", "小众", "幸福感", "松弛感"],
    reasonSnippet: "情绪价值突出",
    patch: {
      noteType: "话题共鸣",
      toneStyle: "温柔治愈感",
      titleStyle: "情绪共鸣型",
      bodyStyle: "情绪共振式",
    },
  },
  {
    id: "rational",
    keywords: ["成分", "参数", "测评", "对比", "功效", "适合", "区别", "选购", "避坑", "续航"],
    reasonSnippet: "偏理性决策",
    patch: {
      noteType: "攻略测评",
      toneStyle: "专业判断感",
      titleStyle: "信息决策型",
      bodyStyle: "对比分析式",
    },
  },
  {
    id: "real",
    keywords: ["自用", "复购", "亲测", "最近在用", "真实感受", "空瓶", "日常"],
    reasonSnippet: "偏真实体验",
    patch: {
      noteType: "真实分享",
      toneStyle: "真实自述感",
      bodyStyle: "体验叙述式",
    },
  },
];
