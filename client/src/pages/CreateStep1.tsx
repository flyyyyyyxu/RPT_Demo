/*
 * Step 1: 填写商品信息
 * Layout: 左60% 表单 + 右40% AI理解回显面板
 * 参考截图但做了 UI 优化以适配主页风格
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  X,
  Plus,
  Lightbulb,
  Clock,
  FileText,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";

const SELLING_POINT_PRESETS = [
  "温和", "小红瓶", "学生党", "氨基酸", "保湿", "控油", "敏感肌适用", "大牌平替",
];
const AUDIENCE_PRESETS = [
  "敏感肌", "学生", "职场新人", "宝妈", "熬夜党", "油皮", "干皮",
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

  const filledCount = useMemo(() => {
    let count = 0;
    if (name.trim()) count++;
    if (sellingPoints.length > 0) count++;
    if (audience.length > 0) count++;
    if (wordCount.trim()) count++;
    if (priceRange.trim()) count++;
    if (competitorLinks.trim()) count++;
    return count;
  }, [name, sellingPoints, audience, wordCount, priceRange, competitorLinks]);

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
    });
    navigate("/create/strategy");
  };

  // Build AI understanding text
  const aiText = useMemo(() => {
    const parts: string[] = [];
    if (audience.length > 0) parts.push(`为 **${audience.join("、")}**`);
    if (name.trim()) parts.push(`推荐一款 **${name}**`);
    if (sellingPoints.length > 0) parts.push(`主打 **${sellingPoints.join("、")}**`);
    if (wordCount.trim()) parts.push(`字数约 **${wordCount.replace(/\s/g, "")}**`);
    return parts.length > 0 ? `"我要${parts.join("，")} 的记忆点。"` : "";
  }, [name, sellingPoints, audience, wordCount]);

  return (
    <CreateLayout
      currentStep={1}
      rightAction={
        <span className="text-xs text-muted-foreground hidden sm:inline">
          自动保存 · 10 秒前
        </span>
      }
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1.5">填写商品信息</h1>
            <p className="text-sm text-muted-foreground">
              告诉 AI 你要推荐什么，AI 会据此撰写笔记。必填项 3 个，预计 1 分钟。
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground shrink-0 ml-4">
            <span className="font-semibold text-foreground">{filledCount}</span> / 6 已填
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form (3/5) */}
          <div className="lg:col-span-3 space-y-7">
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

            {/* Selling points */}
            <FormField label="核心卖点" required hint="最多 5 个">
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
              {/* Selected tags */}
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
              <p className="text-[11px] text-muted-foreground mt-2">
                系统会据此组织卖点顺序，顺序影响最终笔记的叙述重点。
              </p>
            </FormField>

            {/* Target audience */}
            <FormField label="目标人群" hint="选填">
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
              <FormField label="期望字数">
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

            {/* Competitor links */}
            <FormField label="参考商品链接" hint="选填 · 最多 3 条">
              <textarea
                value={competitorLinks}
                onChange={(e) => setCompetitorLinks(e.target.value)}
                placeholder="粘贴 1-3 个竞品笔记链接，AI 将扫描并提取洞察"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none placeholder:text-muted-foreground/50"
              />
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

          {/* Right: AI Understanding Panel (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* AI Understanding */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                AI 将如何理解这些信息
              </div>
              {aiText ? (
                <div className="p-4 rounded-xl bg-coral-light/30 border border-primary/10">
                  <p
                    className="text-sm leading-relaxed text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: aiText
                        .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-primary">$1</span>'),
                    }}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground">开始填写左侧表单，AI 理解将实时更新</p>
                </div>
              )}
            </div>

            {/* Writing tips */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-warm-orange" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  填写建议 · 让生成更准
                </span>
              </div>
              <div className="space-y-3">
                <TipItem
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald" />}
                  text='卖点越具体，越能避免"大路货"文案。可加入成分、规格、使用场景。'
                  active
                />
                <TipItem
                  icon={<CircleDot className="w-4 h-4 text-muted-foreground/50" />}
                  text="建议加 1-3 条竞品链接，AI 可提炼真实痛点，生成更有针对性。"
                />
                <TipItem
                  icon={<CircleDot className="w-4 h-4 text-muted-foreground/50" />}
                  text="人群标签不超过 3 个效果最好，过多会让 AI 笔记主题分散。"
                />
              </div>
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
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
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

function TipItem({
  icon,
  text,
  active,
}: {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2.5 p-2.5 rounded-lg ${active ? "bg-emerald-light/30" : ""}`}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <p className={`text-xs leading-relaxed ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {text}
      </p>
    </div>
  );
}
