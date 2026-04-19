/*
 * Step 2: 内容策略设置
 * Includes strategy selection, custom strategy notes, recommended strategy placeholder,
 * preview title/opening, and selectable competitor insights.
 */
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Search,
  Save,
  Zap,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext, type InsightItem } from "@/contexts/CreateContext";
import { FALLBACK_STRATEGY } from "@/config/contentStrategy";
import { toast } from "sonner";

const NOTE_TYPES = [
  { id: "直接种草", title: "直接种草", desc: "直接突出产品亮点、适合人群和购买理由，适合快速推荐与新品曝光。" },
  { id: "真实分享", title: "真实分享", desc: "从个人使用感受和真实体验出发，更像用户自然分享，适合建立信任感。" },
  { id: "场景安利", title: "场景安利", desc: "从具体使用场景切入，自然带出产品，适合宠物、家居、穿搭、礼物等品类。" },
  { id: "攻略测评", title: "攻略测评", desc: "围绕功能、差异、优缺点或选购建议展开，适合帮助用户做判断。" },
  { id: "话题共鸣", title: "话题共鸣", desc: "从情绪、态度、身份认同或生活方式切入，适合容易引发共鸣的内容。" },
];

const TONE_OPTIONS = [
  { id: "朋友安利感", desc: "像朋友真心推荐，轻松亲近，不刻意推销。" },
  { id: "真实自述感", desc: "像自己用过后的真实分享，更有生活感。" },
  { id: "专业判断感", desc: "表达更理性清楚，适合讲依据和判断。" },
  { id: "轻松有梗感", desc: "更活泼有记忆点，适合年轻化表达。" },
  { id: "温柔治愈感", desc: "偏生活方式和情绪价值，氛围更柔和。" },
];
const TITLE_STYLE_OPTIONS = [
  { id: "结果种草型", desc: "直接表达值得买、很好用、买对了。" },
  { id: "场景代入型", desc: "从使用场景切入，让用户快速代入。" },
  { id: "情绪共鸣型", desc: "突出“这说的不就是我”的感觉。" },
  { id: "信息决策型", desc: "更适合总结、测评、对比、避坑。" },
  { id: "反差悬念型", desc: "通过意外感或反差感提升点击欲。" },
];
const BODY_STYLE_OPTIONS = [
  { id: "亮点展开式", desc: "先给推荐结论，再展开亮点与适合人群。" },
  { id: "体验叙述式", desc: "按购买原因、使用感受、推荐理由展开。" },
  { id: "场景带入式", desc: "先写场景画面，再自然引出商品。" },
  { id: "对比分析式", desc: "通过差异、优缺点和适合对象展开说明。" },
  { id: "情绪共振式", desc: "从感受、吐槽或共鸣切入，再引出产品。" },
];
const STRATEGY_TEMPLATES = ["爆款种草", "真实测评", "平替对比", "口碑复购", "场景带入", "促转化"];
const CUSTOM_FIELD_MAX_LENGTH = 50;

// Ultimate UI fallback used when the user navigated straight to Step2 without
// going through Step1 (so context.recommendedStrategy is null). Values come
// from FALLBACK_STRATEGY so fallback logic stays in one place.
const UI_FALLBACK_STRATEGY = FALLBACK_STRATEGY;

const hasOption = (options: Array<{ id: string }>, value: string) =>
  options.some((option) => option.id === value);

// Preview templates: driven entirely by productInfo so output adapts to any category.
// Title varies by titleStyle; opening = hook(bodyStyle) + tail(noteType) — 5×5 combinations.
type PreviewCtx = {
  name: string;
  point1: string;
  point2: string;
  audience: string;
  audience2: string;
};

const buildPreviewCtx = (p: {
  name: string;
  sellingPoints: string[];
  targetAudience: string[];
}): PreviewCtx => {
  const point1 = p.sellingPoints[0] || "核心卖点";
  const audience = p.targetAudience[0] || "需要的朋友";
  return {
    name: p.name || "这款产品",
    point1,
    point2: p.sellingPoints[1] || point1,
    audience,
    audience2: p.targetAudience[1] || audience,
  };
};

const TITLE_TEMPLATES: Record<string, (c: PreviewCtx) => string> = {
  "结果种草型": (c) => `${c.name}真的买对了，${c.point1}这点太加分`,
  "场景代入型": (c) => `每次${c.audience}日常，我都会先想到${c.name}`,
  "情绪共鸣型": (c) => `这说的不就是${c.audience}吗？${c.name}真的太懂了`,
  "信息决策型": (c) => `${c.name}到底适合谁？这 3 点先看清楚`,
  "反差悬念型": (c) => `本来没抱期待，结果被${c.name}的${c.point1}拿捏了`,
};

const OPENING_HOOKS: Record<string, (c: PreviewCtx) => string> = {
  "亮点展开式": (c) =>
    `先说结论：${c.name}值得冲，核心就是 <strong>${c.point1}</strong>。`,
  "体验叙述式": (c) =>
    `最近一直在用 ${c.name}，说说真实感受——<strong>${c.point1}</strong> 这点确实打动了我。`,
  "场景带入式": (c) =>
    `想象一下${c.audience}的日常，需要一点恰到好处的 <strong>${c.point1}</strong>，${c.name}就很自然地出现了。`,
  "对比分析式": (c) =>
    `把几款热门放在一起对比，${c.name}在 <strong>${c.point1}</strong> 这点上明显更稳。`,
  "情绪共振式": (c) =>
    `有时候买东西不是看参数，是那种"终于懂我了"的感觉——${c.name}给我的第一印象就是 <strong>${c.point1}</strong>。`,
};

const OPENING_TAILS: Record<string, (c: PreviewCtx) => string> = {
  "直接种草": (c) => `我会直接推荐给${c.audience}，理由就是这么简单——`,
  "真实分享": (c) => `不是硬夸，是真觉得它把${c.point2}做得挺舒服。`,
  "场景安利": (c) => `特别是${c.audience}常遇到的那些场景，它都接得住。`,
  "攻略测评": (c) => `如果你也在纠结怎么选，${c.name}的几个关键点值得先看清楚。`,
  "话题共鸣": (c) => `相信不止我一个${c.audience}会被戳中，这种感觉真的很难得。`,
};

export default function CreateStep2() {
  const [, navigate] = useLocation();
  const { productInfo, setProductInfo, contentStrategy, setContentStrategy } = useCreateContext();

  // Prefer the strategy recommended from Step1; fall back to global defaults
  // when user navigates directly to Step2 with no recommendation in context.
  const activeRecommended = contentStrategy.recommendedStrategy ?? UI_FALLBACK_STRATEGY;

  const initialBodyStyle = contentStrategy.bodyStyle || contentStrategy.articleStyle;
  const [noteType, setNoteType] = useState(
    hasOption(NOTE_TYPES, contentStrategy.noteType) ? contentStrategy.noteType : activeRecommended.noteType
  );
  const [tone, setTone] = useState(
    hasOption(TONE_OPTIONS, contentStrategy.toneStyle) ? contentStrategy.toneStyle : activeRecommended.toneStyle
  );
  const [titleStyle, setTitleStyle] = useState(
    hasOption(TITLE_STYLE_OPTIONS, contentStrategy.titleStyle) ? contentStrategy.titleStyle : activeRecommended.titleStyle
  );
  const [bodyStyle, setBodyStyle] = useState(
    hasOption(BODY_STYLE_OPTIONS, initialBodyStyle) ? initialBodyStyle : activeRecommended.bodyStyle
  );
  const [customHighlights, setCustomHighlights] = useState(contentStrategy.customHighlights);
  const [customToneNotes, setCustomToneNotes] = useState(contentStrategy.customToneNotes);
  const [customAvoidances, setCustomAvoidances] = useState(contentStrategy.customAvoidances);
  const [emotionLevel, setEmotionLevel] = useState(contentStrategy.emotionLevel);
  const [rhythmLevel, setRhythmLevel] = useState(contentStrategy.rhythmLevel);
  const [autoTags, setAutoTags] = useState(contentStrategy.autoTags);

  // Single source of truth is productInfo.competitorInsight. Local state
  // mirrors it for UI responsiveness; every mutation writes back to context
  // so Step1 ↔ Step2 navigation preserves both the items and the user's
  // adoption choices.
  const [insights, setInsights] = useState<InsightItem[]>(
    productInfo.competitorInsight?.items ?? []
  );
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    if (productInfo.competitorInsight?.items) {
      setInsights(productInfo.competitorInsight.items);
    }
  }, [productInfo.competitorInsight]);

  const persistInsights = (next: InsightItem[]) => {
    setInsights(next);
    setProductInfo({
      ...productInfo,
      competitorInsight: { generated: true, items: next },
    });
  };

  const handleGenerateInferredInsight = async () => {
    if (!productInfo.name.trim() || productInfo.sellingPoints.length === 0) {
      toast.error("请先在上一步填写商品名称和核心卖点");
      return;
    }
    setInsightLoading(true);
    try {
      const res = await fetch("/api/competitor-insight-inferred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productInfo.name,
          productDescription: productInfo.description,
          productKeywords: productInfo.productKeywords,
          sellingPoints: productInfo.sellingPoints,
          targetAudience: productInfo.targetAudience,
          category: productInfo.category,
          subcategory: productInfo.subcategory,
          usageScenarios: productInfo.usageScenarios,
          priceRange: productInfo.priceRange,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "生成失败");
      persistInsights(data.insights);
      toast.success("竞品洞察生成完成");
    } catch (e: any) {
      toast.error(e.message ?? "竞品洞察生成失败，请重试");
    } finally {
      setInsightLoading(false);
    }
  };

  // Preview driven by productInfo + selected styles. Templates live outside the component.
  const previewTitle = useMemo(() => {
    const ctx = buildPreviewCtx(productInfo);
    const fn = TITLE_TEMPLATES[titleStyle];
    return fn ? fn(ctx) : `${ctx.name}，${ctx.point1}，值得认识一下`;
  }, [titleStyle, productInfo]);

  const previewOpening = useMemo(() => {
    const ctx = buildPreviewCtx(productInfo);
    const hook = OPENING_HOOKS[bodyStyle]?.(ctx);
    const tail = OPENING_TAILS[noteType]?.(ctx);
    if (hook && tail) return `${hook} ${tail}`;
    return hook || tail || `${ctx.name}，${ctx.point1}，值得认识一下。`;
  }, [noteType, bodyStyle, productInfo]);

  const handleNext = () => {
    setContentStrategy({
      noteType,
      toneStyle: tone,
      titleStyle,
      articleStyle: bodyStyle,
      bodyStyle,
      customHighlights,
      customToneNotes,
      customAvoidances,
      emotionLevel,
      rhythmLevel,
      generateCount: contentStrategy.generateCount,
      autoTags,
      selectedInsights: insights.filter((i) => i.status === "adopted"),
      recommendedStrategy: contentStrategy.recommendedStrategy,
    });
    navigate("/create/images");
  };

  const toggleInsight = (index: number) => {
    const updated = [...insights];
    updated[index] = {
      ...updated[index],
      status: updated[index].status === "adopted" ? "pending" : "adopted",
    };
    persistInsights(updated);
    toast.success(updated[index].status === "adopted" ? "已融入正文" : "已取消融入");
  };

  return (
    <CreateLayout currentStep={2}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">内容策略设置</h1>
          <p className="text-sm text-muted-foreground">
            已根据商品信息，预选适合该商品的表达方式，可手动调整，AI 将据此生成专业标题和正文。可随时返回上一步修改商品信息。
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Config (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Note type */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                笔记类型 <span className="text-primary">*</span>
              </label>
              <div className="space-y-2.5">
                {NOTE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNoteType(type.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      noteType === type.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/60 bg-white hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          noteType === type.id ? "border-primary" : "border-border"
                        }`}
                      >
                        {noteType === type.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{type.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{type.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title style */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">标题风格</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TITLE_STYLE_OPTIONS.map((opt) => (
                  <ChoiceChip
                    key={opt.id}
                    label={opt.id}
                    selected={titleStyle === opt.id}
                    onClick={() => setTitleStyle(opt.id)}
                  />
                ))}
              </div>
            </div>

            {/* Tone style */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">语气风格</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TONE_OPTIONS.map((opt) => (
                  <ChoiceChip
                    key={opt.id}
                    label={opt.id}
                    selected={tone === opt.id}
                    onClick={() => setTone(opt.id)}
                  />
                ))}
              </div>
            </div>

            {/* Article style (was 叙述视角) */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">文章样式</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BODY_STYLE_OPTIONS.map((opt) => (
                  <ChoiceChip
                    key={opt.id}
                    label={opt.id}
                    selected={bodyStyle === opt.id}
                    onClick={() => setBodyStyle(opt.id)}
                  />
                ))}
              </div>
            </div>

            {/* Custom strategy notes */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <label className="text-sm font-semibold text-foreground block">自定义补充（可选）</label>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  如果默认选项不完全符合你的想法，可以补充你希望强调的表达重点。系统会在生成标题和正文时参考这些关键词。
                </p>
              </div>
              <div className="space-y-3.5">
                <CustomStrategyInput
                  label="想强调的感觉 / 卖点"
                  value={customHighlights}
                  onChange={setCustomHighlights}
                  placeholder="如：可爱、松弛感、送礼有面子、很适合冬天遛狗"
                />
                <CustomStrategyInput
                  label="希望呈现的表达氛围"
                  value={customToneNotes}
                  onChange={setCustomToneNotes}
                  placeholder="如：像养狗人之间的暗号、像朋友聊天、不要太像广告"
                />
                <CustomStrategyInput
                  label="不希望出现的表达方式"
                  value={customAvoidances}
                  onChange={setCustomAvoidances}
                  placeholder="如：不要太夸张、不要太专业说教、不要像直播话术"
                />
              </div>
            </div>

            {/* Emotion level + Rhythm level (was single heat slider) */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-foreground">情绪浓度</label>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">
                    {emotionLevel < 33 ? "克制" : emotionLevel < 66 ? "适中" : "夸张"}
                  </span>
                </div>
                <Slider
                  value={[emotionLevel]}
                  onValueChange={([v]) => setEmotionLevel(v)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                  <span>克制</span>
                  <span>夸张</span>
                </div>
                <p className="text-[11px] text-muted-foreground/60 mt-1">影响用词的情感强度</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-foreground">节奏感</label>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">
                    {rhythmLevel < 33 ? "长段叙述" : rhythmLevel < 66 ? "适中" : "短句切割"}
                  </span>
                </div>
                <Slider
                  value={[rhythmLevel]}
                  onValueChange={([v]) => setRhythmLevel(v)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                  <span>长段叙述</span>
                  <span>短句切割</span>
                </div>
                <p className="text-[11px] text-muted-foreground/60 mt-1">影响排版结构和阅读节奏</p>
              </div>
            </div>

          </div>

          {/* Right: Preview + Insight (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-5 lg:pt-8"
          >
            {/* Live preview - now shows title + opening */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview · 标题与开头预览
                </span>
              </div>
              <div className="space-y-3">
                {/* Title preview */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-[11px] text-muted-foreground mb-1.5 font-medium">标题</div>
                  <p className="text-sm font-bold text-foreground leading-snug">{previewTitle}</p>
                </div>
                {/* Opening preview */}
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/40">
                  <div className="text-[11px] text-muted-foreground mb-1.5 font-medium">开头</div>
                  <p
                    className="text-sm leading-relaxed text-foreground"
                    dangerouslySetInnerHTML={{ __html: previewOpening }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[noteType, tone, titleStyle, bodyStyle].map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Auto tags */}
            <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-foreground">是否加入话题标签</div>
                  <p className="text-xs text-muted-foreground mt-1">自动推荐热门标签</p>
                </div>
                <Switch checked={autoTags} onCheckedChange={setAutoTags} />
              </div>
            </div>

            {/* Competitor insight with selectable items */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  竞品洞察 · 选择融入正文
                </span>
              </div>
              {insights.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-5 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    还未生成竞品洞察。基于商品信息快速生成，无需竞品链接。
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white"
                    onClick={handleGenerateInferredInsight}
                    disabled={insightLoading}
                  >
                    {insightLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        正在生成…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        一键生成竞品洞察
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {insights.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        item.status === "adopted"
                          ? "border-primary/20 bg-primary/5"
                          : "border-border/50 bg-white hover:border-primary/15 hover:bg-primary/[0.02]"
                      }`}
                      onClick={() => toggleInsight(i)}
                    >
                      <div className="flex items-center gap-2.5 flex-1">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          item.status === "adopted" ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {item.status === "adopted" && (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                          <span className="text-sm text-foreground ml-1.5 font-medium">{item.detail}</span>
                        </div>
                      </div>
                      {item.status !== "adopted" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInsight(i);
                          }}
                          className="shrink-0 text-[11px] px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          融入
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strategy templates */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  一键套用策略模板
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STRATEGY_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl}
                    onClick={() => toast.info("功能暂未上线")}
                    className="px-4 py-2 rounded-xl text-sm font-medium border border-border/60 bg-white hover:border-primary/20 hover:bg-primary/5 transition-all"
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => navigate("/create")}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                返回上一步
              </Button>
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => toast.success("草稿已保存")}
              >
                <Save className="w-4 h-4 mr-1.5" />
                保存草稿
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                onClick={handleNext}
              >
                下一步：图片生成
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </CreateLayout>
  );
}

/* --- Sub-components --- */

function ChoiceChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
        selected
          ? "bg-primary/10 text-primary border-primary/25 shadow-sm"
          : "bg-white text-foreground/70 border-border hover:border-primary/20 hover:bg-primary/5"
      }`}
    >
      {label}
    </button>
  );
}

function CustomStrategyInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-foreground">{label}</label>
        <span className="text-[10px] text-muted-foreground">
          {value.length}/{CUSTOM_FIELD_MAX_LENGTH}
        </span>
      </div>
      <Input
        value={value}
        maxLength={CUSTOM_FIELD_MAX_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 bg-secondary/30 border-border/60 text-sm"
      />
    </div>
  );
}
