/*
 * Step 1: 商品信息
 * Layout: 左60% 表单 + 右40% 竞品洞察面板
 * Changes:
 * - "写作信息" → "商品信息"
 * - "5/6已填" → "本次预计消耗2额度" (moved to CreateLayout)
 * - Added 商品描述 and inferred product semantics for downstream generation
 * - Competitor links with right-aligned "一键生成竞品洞察" button
 * - Tips moved inline as gray hint text after labels
 * - Right panel: competitor insight results (or placeholder)
 */
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  X,
  Plus,
  Search,
  Loader2,
  Clock,
  Sparkles,
  FileText,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext, type InsightItem } from "@/contexts/CreateContext";
import { recommendContentStrategy } from "@/utils/recommendStrategy";
import {
  formatPriceRange,
  inferProductSemantics,
  parsePriceRange,
} from "@/utils/productSemantics";
import { inferProductUnderstandingLocal } from "@/utils/localProductUnderstanding";
import {
  CATEGORY_OVERRIDES,
  FALLBACK_PRESET,
  getPresetById,
  type CategoryPreset,
} from "@/config/productCategoryPresets";
import { toast } from "sonner";

function applyOverrides(
  basePoints: string[],
  baseAudiences: string[],
  text: string
): { sellingPoints: string[]; audiences: string[] } {
  const extraPoints: string[] = [];
  const extraAudiences: string[] = [];
  for (const ov of CATEGORY_OVERRIDES) {
    if (!ov.match.some((m) => text.includes(m))) continue;
    if (ov.addSellingPoints) extraPoints.push(...ov.addSellingPoints);
    if (ov.addAudiences) extraAudiences.push(...ov.addAudiences);
  }
  return {
    sellingPoints: Array.from(new Set([...basePoints, ...extraPoints])),
    audiences: Array.from(new Set([...baseAudiences, ...extraAudiences])),
  };
}


export default function CreateStep1() {
  const [, navigate] = useLocation();
  const { productInfo, setProductInfo, contentStrategy, setContentStrategy } = useCreateContext();

  const [name, setName] = useState(productInfo.name);
  const [description, setDescription] = useState(productInfo.description);
  const [sellingPoints, setSellingPoints] = useState<string[]>(productInfo.sellingPoints);
  const [audience, setAudience] = useState<string[]>(productInfo.targetAudience);
  const [wordCount, setWordCount] = useState(productInfo.wordCount);
  const initialPrice = parsePriceRange(productInfo.priceRange);
  const [priceMin, setPriceMin] = useState(initialPrice.priceMin);
  const [priceMax, setPriceMax] = useState(initialPrice.priceMax);
  const [priceEdited, setPriceEdited] = useState(Boolean(productInfo.priceRange));
  const [competitorLinks, setCompetitorLinks] = useState(productInfo.competitorLinks);
  const [customPoint, setCustomPoint] = useState("");
  const [customAudience, setCustomAudience] = useState("");
  const [insightGenerated, setInsightGenerated] = useState(productInfo.competitorInsight?.generated ?? false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [insights, setInsights] = useState<InsightItem[]>(productInfo.competitorInsight?.items ?? []);
  const inferredSemantics = useMemo(
    () => inferProductSemantics(name, description, sellingPoints, audience),
    [name, description, sellingPoints, audience]
  );

  // Local-only preset match for realtime candidate switching. LLM understanding
  // is deferred to Step1 handleNext (Step E) — this preview stays free and instant.
  const matchedPreset = useMemo<CategoryPreset | null>(() => {
    const r = inferProductUnderstandingLocal({
      productName: name,
      productDescription: description,
      sellingPoints,
      targetAudience: audience,
    });
    if (!r) return null;
    return getPresetById(r.matchedCategoryId) ?? null;
  }, [name, description, sellingPoints, audience]);

  const { sellingPointCandidates, audienceCandidates } = useMemo(() => {
    const preset = matchedPreset ?? FALLBACK_PRESET;
    const text = [name, description, ...sellingPoints, ...audience].join(" ");
    const merged = applyOverrides(preset.sellingPoints, preset.audiences, text);
    return {
      sellingPointCandidates: merged.sellingPoints,
      audienceCandidates: merged.audiences,
    };
  }, [matchedPreset, name, description, sellingPoints, audience]);

  const priceRange = formatPriceRange(priceMin, priceMax);

  useEffect(() => {
    if (priceEdited || !name.trim() || !description.trim()) return;
    if (!inferredSemantics.priceMin || !inferredSemantics.priceMax) return;
    setPriceMin(inferredSemantics.priceMin);
    setPriceMax(inferredSemantics.priceMax);
  }, [description, inferredSemantics.priceMax, inferredSemantics.priceMin, name, priceEdited]);

  const toggleTag = (tag: string, list: string[], setList: (v: string[]) => void, max: number) => {
    if (list.includes(tag)) {
      setList(list.filter((t) => t !== tag));
    } else if (list.length < max) {
      setList([...list, tag]);
    } else {
      toast.error(`最多选择 ${max} 个`);
    }
  };

  const addCustomPoint = () => {
    const trimmed = customPoint.trim();
    if (!trimmed) return;
    if (sellingPoints.length >= 5) {
      toast.error("最多 5 个卖点");
      return;
    }
    if (sellingPoints.includes(trimmed)) {
      toast.error("已存在该卖点");
      return;
    }
    setSellingPoints([...sellingPoints, trimmed]);
    setCustomPoint("");
  };

  const addCustomAudience = () => {
    const trimmed = customAudience.trim();
    if (!trimmed) return;
    if (audience.length >= 3) {
      toast.error("最多 3 个目标人群");
      return;
    }
    if (audience.includes(trimmed)) {
      toast.error("已存在该人群");
      return;
    }
    setAudience([...audience, trimmed]);
    setCustomAudience("");
  };

  const handleGenerateInsight = async () => {
    if (!competitorLinks.trim()) {
      toast.error("请先粘贴竞品链接");
      return;
    }
    setInsightLoading(true);
    try {
      const res = await fetch("/api/competitor-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorLinks,
          productName: name,
          productDescription: description,
          productKeywords: inferredSemantics.productKeywords,
          sellingPoints,
          category: inferredSemantics.category || productInfo.category,
          subcategory: inferredSemantics.subcategory || productInfo.subcategory,
          usageScenarios: inferredSemantics.usageScenarios,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "生成失败");
      setInsights(data.insights);
      setInsightGenerated(true);
      toast.success("竞品洞察生成完成");
    } catch (e: any) {
      toast.error(e.message ?? "竞品洞察生成失败，请重试");
    } finally {
      setInsightLoading(false);
    }
  };

  const handleNext = async () => {
    if (!name.trim()) { toast.error("请填写商品名称"); return; }
    if (!description.trim()) { toast.error("请填写商品描述"); return; }
    if (sellingPoints.length === 0) { toast.error("请至少选择一个核心卖点"); return; }

    setNextLoading(true);
    let matchedCategoryId: string | undefined;
    let llmKeywords: string[] = [];
    let llmScenarios: string[] = [];

    // 1. Try LLM understanding.
    try {
      const res = await fetch("/api/product-understanding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: name, productDescription: description, sellingPoints, targetAudience: audience }),
      });
      const data = await res.json();
      if (res.ok && data.matched && data.result) {
        matchedCategoryId = data.result.matchedCategoryId;
        llmKeywords = data.result.productKeywords ?? [];
        llmScenarios = data.result.usageScenarios ?? [];
      }
    } catch {
      // Network error → fall through to local
    }

    // 2. Local fallback when LLM didn't match.
    if (!matchedCategoryId) {
      const local = inferProductUnderstandingLocal({ productName: name, productDescription: description, sellingPoints, targetAudience: audience });
      if (local) {
        matchedCategoryId = local.matchedCategoryId;
        llmKeywords = local.productKeywords;
      }
    }

    // 3. Merge semantics: LLM/local enriches inferredSemantics (existing price logic unchanged).
    const mergedKeywords = Array.from(new Set([...llmKeywords, ...inferredSemantics.productKeywords])).slice(0, 10);
    const mergedScenarios = llmScenarios.length > 0
      ? llmScenarios
      : inferredSemantics.usageScenarios.length > 0
        ? inferredSemantics.usageScenarios
        : productInfo.usageScenarios ?? [];

    setProductInfo({
      name,
      description,
      sellingPoints,
      targetAudience: audience,
      wordCount,
      priceRange,
      competitorLinks,
      importFromLibrary: false,
      productImages: productInfo.productImages,
      competitorInsight: insightGenerated ? { generated: true, items: insights } : null,
      productKeywords: mergedKeywords,
      category: inferredSemantics.category || productInfo.category,
      subcategory: inferredSemantics.subcategory || productInfo.subcategory,
      usageScenarios: mergedScenarios,
      matchedCategoryId,
    });

    // 4. Recommend strategy — matchedCategoryId lets recommender skip normalize.
    const recommended = recommendContentStrategy({
      matchedCategoryId,
      category: inferredSemantics.category || productInfo.category,
      subcategory: inferredSemantics.subcategory || productInfo.subcategory,
      productName: name,
      productDescription: description,
      productKeywords: mergedKeywords,
      sellingPoints,
      targetAudience: audience,
      usageScenarios: mergedScenarios,
      priceRange,
    });
    const prev = contentStrategy.recommendedStrategy;
    const recommendationChanged =
      !prev ||
      prev.noteType !== recommended.noteType ||
      prev.toneStyle !== recommended.toneStyle ||
      prev.titleStyle !== recommended.titleStyle ||
      prev.bodyStyle !== recommended.bodyStyle;

    setContentStrategy({
      ...contentStrategy,
      recommendedStrategy: recommended,
      ...(recommendationChanged && {
        noteType: recommended.noteType,
        toneStyle: recommended.toneStyle,
        titleStyle: recommended.titleStyle,
        articleStyle: recommended.bodyStyle,
        bodyStyle: recommended.bodyStyle,
      }),
    });

    setNextLoading(false);
    navigate("/create/strategy");
  };

  return (
    <CreateLayout currentStep={1}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">填写商品信息</h1>
          <p className="text-sm text-muted-foreground">
            告诉 AI 你要推荐什么，AI 会据此撰写笔记。必填项 3 个，预计 1 分钟。
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Import entry */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">从商品库导入</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">推荐 · 省时</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white"
                onClick={() => toast.info("功能暂未上线")}
              >
                导入
              </Button>
            </div>

            {/* Product name */}
            <FormField label="商品名称" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：XX 品牌温和氨基酸洁面 100ml"
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
              />
            </FormField>

            {/* Product description */}
            <FormField label="商品描述" required hint="用于消除名称歧义，AI 会据此理解品类、场景和关键词">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：适合敏感肌早晚使用的温和洁面，主打氨基酸配方，洗后不紧绷，适合学生党和日常通勤。"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-muted-foreground/50"
              />
            </FormField>

            {/* Selling points */}
            <FormField label="核心卖点" required hint="最多 5 个，卖点越具体生成效果越好">
              <div className="flex flex-wrap gap-2 mb-3">
                {sellingPointCandidates.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    selected={sellingPoints.includes(tag)}
                    onClick={() => toggleTag(tag, sellingPoints, setSellingPoints, 5)}
                  />
                ))}
              </div>
              {sellingPoints.filter((t) => !sellingPointCandidates.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {sellingPoints
                    .filter((t) => !sellingPointCandidates.includes(t))
                    .map((tag) => (
                      <TagChip
                        key={tag}
                        label={tag}
                        selected
                        onClick={() => setSellingPoints(sellingPoints.filter((t) => t !== tag))}
                      />
                    ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={customPoint}
                  onChange={(e) => setCustomPoint(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomPoint()}
                  placeholder="+ 自定义卖点"
                  className="w-[124px] h-9 px-3.5 rounded-full border border-dashed border-border bg-white text-sm focus:outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/50"
                />
                {customPoint.trim() && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addCustomPoint}
                    className="h-9 w-9 shrink-0 rounded-full bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </FormField>

            {/* Target audience */}
            <FormField label="目标人群" hint="选填，不超过 3 个效果最好">
              <div className="flex flex-wrap gap-2 mb-3">
                {audienceCandidates.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    selected={audience.includes(tag)}
                    onClick={() => toggleTag(tag, audience, setAudience, 3)}
                  />
                ))}
              </div>
              {audience.filter((t) => !audienceCandidates.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {audience
                    .filter((t) => !audienceCandidates.includes(t))
                    .map((tag) => (
                      <TagChip
                        key={tag}
                        label={tag}
                        selected
                        onClick={() => setAudience(audience.filter((t) => t !== tag))}
                      />
                    ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomAudience()}
                  placeholder="+ 自定义人群"
                  className="w-[124px] h-9 px-3.5 rounded-full border border-dashed border-border bg-white text-sm focus:outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/50"
                />
                {customAudience.trim() && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={addCustomAudience}
                    className="h-9 w-9 shrink-0 rounded-full bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </FormField>

            {/* Word count + Price */}
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="期望字数" hint="选填">
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value.replace(/\D/g, ""))}
                  placeholder="例如 400"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                />
              </FormField>
              <FormField label="价格区间" hint="选填 · 填写名称和描述后自动推荐">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={priceMin}
                    onChange={(e) => {
                      setPriceEdited(true);
                      setPriceMin(e.target.value.replace(/[^\d.]/g, ""));
                    }}
                    placeholder="最低价"
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                  />
                  <span className="text-muted-foreground/60">-</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={priceMax}
                    onChange={(e) => {
                      setPriceEdited(true);
                      setPriceMax(e.target.value.replace(/[^\d.]/g, ""));
                    }}
                    placeholder="最高价"
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </FormField>
            </div>

            {/* Competitor links */}
            <FormField
              label="参考竞品链接"
              hint="选填 · 最多 3 条，建议填写以获得更好的生成效果"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 rounded-lg bg-white border-border/70 text-xs font-medium text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  onClick={handleGenerateInsight}
                  disabled={insightLoading}
                >
                  {insightLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      分析中
                    </>
                  ) : (
                    <>
                      <Search className="w-3 h-3 mr-1" />
                      生成竞品洞察
                    </>
                  )}
                </Button>
              }
            >
              <div>
                <textarea
                  value={competitorLinks}
                  onChange={(e) => setCompetitorLinks(e.target.value)}
                  placeholder="粘贴 1-3 个竞品笔记链接，AI 将扫描并提取洞察"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-muted-foreground/50"
                />
              </div>
            </FormField>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => toast.success("草稿已保存")}
              >
                保存草稿
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 px-6"
                onClick={handleNext}
                disabled={nextLoading}
              >
                {nextLoading ? (
                  <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />分析商品中…</>
                ) : (
                  <>下一步：内容策略<ArrowRight className="w-4 h-4 ml-1.5" /></>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Competitor Insight Panel (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Competitor Insight */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">竞品洞察</span>
              </div>

              <AnimatePresence mode="wait">
                {insightLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 flex flex-col items-center gap-3"
                  >
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">正在分析竞品笔记...</p>
                    <div className="w-full max-w-[200px] h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ) : insightGenerated ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2.5"
                  >
                    {insights.map((item, i) => (
                      <InsightCard key={i} item={item} index={i} insights={insights} setInsights={setInsights} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-6 text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/60 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">还未生成竞品洞察</p>
                    <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-[240px] mx-auto">
                      建议在左侧填写 1-3 条竞品链接，可以帮助 AI 提炼真实痛点，让生成内容更有针对性
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Understanding */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">AI 理解预览</span>
              </div>
              <AIUnderstanding
                name={name}
                sellingPoints={sellingPoints}
                audience={audience}
                wordCount={wordCount}
                description={description}
                productKeywords={inferredSemantics.productKeywords}
              />
            </div>

            {/* History drafts */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold">历史草稿</span>
                </div>
                <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  查看
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                你之前有 3 份未完成的笔记
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </CreateLayout>
  );
}

/* --- Sub-components --- */

function AIUnderstanding({
  name,
  description,
  sellingPoints,
  audience,
  wordCount,
  productKeywords,
}: {
  name: string;
  description: string;
  sellingPoints: string[];
  audience: string[];
  wordCount: string;
  productKeywords: string[];
}) {
  const aiText = useMemo(() => {
    const parts: string[] = [];
    if (audience.length > 0) parts.push(`为 **${audience.join("、")}**`);
    if (name.trim()) parts.push(`推荐一款 **${name}**`);
    if (description.trim()) {
      const clipped = description.trim().slice(0, 28);
      parts.push(`定位为 **${clipped}${description.trim().length > 28 ? "..." : ""}**`);
    }
    if (sellingPoints.length > 0) parts.push(`主打 **${sellingPoints.join("、")}**`);
    if (productKeywords.length > 0) parts.push(`关键词 **${productKeywords.slice(0, 5).join("、")}**`);
    if (wordCount.trim()) parts.push(`字数约 **${wordCount.replace(/\s/g, "")}字**`);
    return parts.length > 0 ? `"我要${parts.join("，")} 的记忆点。"` : "";
  }, [name, description, sellingPoints, audience, productKeywords, wordCount]);

  if (!aiText) {
    return (
      <div className="p-4 rounded-xl bg-secondary/50 text-center">
        <p className="text-sm text-muted-foreground">开始填写左侧表单，AI 理解将实时更新</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
      <p
        className="text-sm leading-relaxed text-foreground"
        dangerouslySetInnerHTML={{
          __html: aiText.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-primary">$1</span>'),
        }}
      />
    </div>
  );
}

function InsightCard({
  item,
  index,
  insights,
  setInsights,
}: {
  item: InsightItem;
  index: number;
  insights: InsightItem[];
  setInsights: (items: InsightItem[]) => void;
}) {
  const toggleStatus = () => {
    const updated = [...insights];
    updated[index] = {
      ...item,
      status: item.status === "adopted" ? "pending" : "adopted",
    };
    setInsights(updated);
    toast.success(item.status === "adopted" ? "已取消采纳" : "已采纳");
  };

  return (
    <div className={`p-3 rounded-xl border transition-all ${
      item.status === "adopted"
        ? "border-primary/20 bg-primary/5"
        : "border-border/60 bg-white hover:border-primary/15"
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="text-xs font-semibold text-muted-foreground mb-1">{item.label}</div>
          <div className="text-sm text-foreground leading-relaxed">{item.detail}</div>
        </div>
        <button
          onClick={toggleStatus}
          className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
            item.status === "adopted"
              ? "bg-primary/10 text-primary"
              : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {item.status === "adopted" ? "已采纳" : "采纳"}
        </button>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  hint,
  action,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-baseline gap-2 min-w-0">
          <label className="text-sm font-semibold text-foreground shrink-0">
            {label}
            {required && <span className="text-primary ml-0.5">*</span>}
          </label>
          {hint && <span className="text-[11px] text-muted-foreground/60 truncate">{hint}</span>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

function TagChip({
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
      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
        selected
          ? "bg-primary/10 text-primary border-primary/25 shadow-sm"
          : "bg-white text-foreground/60 border-border hover:border-primary/20 hover:bg-primary/5"
      }`}
    >
      {label}
      {selected && <X className="w-3 h-3 ml-0.5 opacity-60" />}
    </button>
  );
}
