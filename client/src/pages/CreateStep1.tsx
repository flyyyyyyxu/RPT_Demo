/*
 * Step 1: 商品信息
 * Layout: 左60% 表单 + 右40% 竞品洞察面板
 * Changes:
 * - "写作信息" → "商品信息"
 * - "5/6已填" → "本次预计消耗2额度" (moved to CreateLayout)
 * - Added "上传商品图" above 核心卖点
 * - Competitor links moved below product images, with "一键生成竞品洞察" button
 * - Tips moved inline as gray hint text after labels
 * - Right panel: competitor insight results (or placeholder)
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext, type InsightItem } from "@/contexts/CreateContext";
import { toast } from "sonner";

const SELLING_POINT_PRESETS = [
  "温和", "小红瓶", "学生党", "氨基酸", "保湿", "控油", "敏感肌适用", "大牌平替",
];
const AUDIENCE_PRESETS = [
  "敏感肌", "学生", "职场新人", "宝妈", "熬夜党", "油皮", "干皮",
];

// Mock competitor insight data
const MOCK_INSIGHTS: InsightItem[] = [
  { label: "用户高频痛点", detail: "「闷痘」— 清洁力不够导致反复闷痘", status: "pending" },
  { label: "热词", detail: "「学生党」— 高频出现在爆文标题中", status: "adopted" },
  { label: "情感锚点", detail: "「早八通勤」— 快速洁面场景共鸣强", status: "adopted" },
  { label: "成分对比", detail: "「氨基酸 vs 皂基」— 科普型内容互动率高", status: "pending" },
  { label: "价格锚点", detail: "「60块一大瓶」— 性价比话术转化率高", status: "pending" },
];

export default function CreateStep1() {
  const [, navigate] = useLocation();
  const { productInfo, setProductInfo } = useCreateContext();

  const [name, setName] = useState(productInfo.name);
  const [sellingPoints, setSellingPoints] = useState<string[]>(productInfo.sellingPoints);
  const [audience, setAudience] = useState<string[]>(productInfo.targetAudience);
  const [wordCount, setWordCount] = useState(productInfo.wordCount);
  const [priceRange, setPriceRange] = useState(productInfo.priceRange);
  const [competitorLinks, setCompetitorLinks] = useState(productInfo.competitorLinks);
  const [importMode, setImportMode] = useState(productInfo.importFromLibrary);
  const [customPoint, setCustomPoint] = useState("");
  const [productImages, setProductImages] = useState<string[]>(productInfo.productImages);
  const [insightGenerated, setInsightGenerated] = useState(productInfo.competitorInsight?.generated ?? false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insights, setInsights] = useState<InsightItem[]>(productInfo.competitorInsight?.items ?? []);

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

  const handleGenerateInsight = () => {
    if (!competitorLinks.trim()) {
      toast.error("请先粘贴竞品链接");
      return;
    }
    setInsightLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      setInsights(MOCK_INSIGHTS);
      setInsightGenerated(true);
      setInsightLoading(false);
      toast.success("竞品洞察生成完成");
    }, 2500);
  };

  const handleUploadImage = () => {
    // Simulate image upload
    const mockUrl = `https://placehold.co/400x400/fff5f5/e8445a?text=商品图${productImages.length + 1}`;
    setProductImages([...productImages, mockUrl]);
    toast.success("图片上传成功");
  };

  const handleNext = () => {
    if (!name.trim()) {
      toast.error("请填写商品名称");
      return;
    }
    if (sellingPoints.length === 0) {
      toast.error("请至少选择一个核心卖点");
      return;
    }
    setProductInfo({
      name,
      sellingPoints,
      targetAudience: audience,
      wordCount,
      priceRange,
      competitorLinks,
      importFromLibrary: importMode,
      productImages,
      competitorInsight: insightGenerated ? { generated: true, items: insights } : null,
    });
    navigate("/create/strategy");
  };

  return (
    <CreateLayout currentStep={1} costCredits={2}>
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
            {/* Import toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">从商品库导入</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">推荐 · 省时</span>
              </div>
              <Switch checked={importMode} onCheckedChange={setImportMode} />
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

            {/* Upload product images */}
            <FormField label="上传商品图" hint="支持 JPG/PNG，建议正方形或 3:4 比例">
              <div className="flex flex-wrap gap-3">
                {productImages.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl border border-border/60 overflow-hidden group">
                    <img src={img} alt={`商品图${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setProductImages(productImages.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {productImages.length < 5 && (
                  <button
                    onClick={handleUploadImage}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px]">上传</span>
                  </button>
                )}
              </div>
            </FormField>

            {/* Selling points */}
            <FormField label="核心卖点" required hint="最多 5 个，卖点越具体生成效果越好">
              <div className="flex flex-wrap gap-2 mb-3">
                {SELLING_POINT_PRESETS.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    selected={sellingPoints.includes(tag)}
                    onClick={() => toggleTag(tag, sellingPoints, setSellingPoints, 5)}
                  />
                ))}
              </div>
              {sellingPoints.filter((t) => !SELLING_POINT_PRESETS.includes(t)).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {sellingPoints
                    .filter((t) => !SELLING_POINT_PRESETS.includes(t))
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPoint}
                  onChange={(e) => setCustomPoint(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomPoint()}
                  placeholder="+ 自定义卖点"
                  className="flex-1 px-3 py-2 rounded-lg border border-dashed border-border text-sm focus:outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/50"
                />
                <Button size="sm" variant="outline" onClick={addCustomPoint} className="shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </FormField>

            {/* Target audience */}
            <FormField label="目标人群" hint="选填，不超过 3 个效果最好">
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_PRESETS.map((tag) => (
                  <TagChip
                    key={tag}
                    label={tag}
                    selected={audience.includes(tag)}
                    onClick={() => toggleTag(tag, audience, setAudience, 3)}
                  />
                ))}
              </div>
            </FormField>

            {/* Word count + Price */}
            <div className="grid sm:grid-cols-2 gap-5">
              <FormField label="期望字数" hint="选填">
                <input
                  type="text"
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  placeholder="300 – 450 字"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                />
              </FormField>
              <FormField label="价格区间" hint="选填">
                <input
                  type="text"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="¥59 – 79"
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                />
              </FormField>
            </div>

            {/* Competitor links - moved below images */}
            <FormField label="参考竞品链接" hint="选填 · 最多 3 条，建议填写以获得更好的生成效果">
              <div className="space-y-3">
                <textarea
                  value={competitorLinks}
                  onChange={(e) => setCompetitorLinks(e.target.value)}
                  placeholder="粘贴 1-3 个竞品笔记链接，AI 将扫描并提取洞察"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-muted-foreground/50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-primary/20 text-primary hover:bg-primary/5"
                  onClick={handleGenerateInsight}
                  disabled={insightLoading}
                >
                  {insightLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      正在分析竞品...
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5 mr-1.5" />
                      一键生成竞品洞察
                    </>
                  )}
                </Button>
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
              >
                下一步：内容策略
                <ArrowRight className="w-4 h-4 ml-1.5" />
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
  sellingPoints,
  audience,
  wordCount,
}: {
  name: string;
  sellingPoints: string[];
  audience: string[];
  wordCount: string;
}) {
  const aiText = useMemo(() => {
    const parts: string[] = [];
    if (audience.length > 0) parts.push(`为 **${audience.join("、")}**`);
    if (name.trim()) parts.push(`推荐一款 **${name}**`);
    if (sellingPoints.length > 0) parts.push(`主打 **${sellingPoints.join("、")}**`);
    if (wordCount.trim()) parts.push(`字数约 **${wordCount.replace(/\s/g, "")}**`);
    return parts.length > 0 ? `"我要${parts.join("，")} 的记忆点。"` : "";
  }, [name, sellingPoints, audience, wordCount]);

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
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2.5">
        <label className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="text-primary ml-0.5">*</span>}
        </label>
        {hint && <span className="text-[11px] text-muted-foreground/60">{hint}</span>}
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
