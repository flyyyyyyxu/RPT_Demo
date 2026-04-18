/*
 * Step 2: 内容策略设置
 * Changes from requirements:
 * - 5.1 新增笔记类型：避坑指南、对比评测
 * - 5.2 新增"标题风格"维度
 * - 5.3 语气风格改为：闺蜜安利感 / 素人真实感 / 专业测评感 / 搞笑吐槽感
 * - 5.4 "叙述视角" → "文章样式"：痛点式 / 反转式 / 数字式 / 疑问悬念式
 * - 5.5 文章热度拆为：情绪浓度 + 节奏感
 * - 5.6 Preview 预览标题和开头
 * - 5.7 竞品洞察未采纳点可框选+一键融入
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Eye,
  Search,
  Zap,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext, type InsightItem } from "@/contexts/CreateContext";
import { toast } from "sonner";

const NOTE_TYPES = [
  { id: "种草推荐", title: "种草推荐", desc: "突出产品利益与使用场景，适合新品曝光、种草首发。" },
  { id: "真实体验", title: "真实体验", desc: "以第一人称分享使用感受，信任感更高，适合复购种草。" },
  { id: "干货科普", title: "干货科普", desc: "用知识或成分对比切入，再自然带出商品，适合成分党人群。" },
  { id: "避坑指南", title: "避坑指南", desc: "从踩坑经验出发，反向推荐产品，可信度高，适合决策期用户。" },
  { id: "对比评测", title: "对比评测", desc: "横向对比多款产品，突出自家优势，适合竞品替代场景。" },
];

const TONE_OPTIONS = ["闺蜜安利感", "素人真实感", "专业测评感", "搞笑吐槽感"];
const TITLE_STYLE_OPTIONS = ["数字清单型", "情绪共鸣型", "悬念反转型", "直接利益型"];
const ARTICLE_STYLE_OPTIONS = ["痛点式", "反转式", "数字式", "疑问悬念式"];
const STRATEGY_TEMPLATES = ["新品首发", "双 11 冲量", "老客复购", "专业人群"];

// Mock insights from Step1 (would come from context in real app)
const DEFAULT_INSIGHTS: InsightItem[] = [
  { label: "用户高频痛点", detail: "「闷痘」", status: "pending" },
  { label: "热词", detail: "「学生党」", status: "adopted" },
  { label: "情感锚点", detail: "「早八通勤」", status: "adopted" },
  { label: "成分对比", detail: "「氨基酸 vs 皂基」", status: "pending" },
  { label: "价格锚点", detail: "「60块一大瓶」", status: "pending" },
];

export default function CreateStep2() {
  const [, navigate] = useLocation();
  const { productInfo, contentStrategy, setContentStrategy } = useCreateContext();

  const [noteType, setNoteType] = useState(contentStrategy.noteType);
  const [tone, setTone] = useState(contentStrategy.toneStyle);
  const [titleStyle, setTitleStyle] = useState(contentStrategy.titleStyle);
  const [articleStyle, setArticleStyle] = useState(contentStrategy.articleStyle);
  const [emotionLevel, setEmotionLevel] = useState(contentStrategy.emotionLevel);
  const [rhythmLevel, setRhythmLevel] = useState(contentStrategy.rhythmLevel);
  const [genCount, setGenCount] = useState(contentStrategy.generateCount);
  const [autoTags, setAutoTags] = useState(contentStrategy.autoTags);

  // Competitor insights from Step1 or defaults
  const [insights, setInsights] = useState<InsightItem[]>(
    productInfo.competitorInsight?.items ?? DEFAULT_INSIGHTS
  );

  // Generate preview title + opening based on current settings
  const previewTitle = useMemo(() => {
    const name = productInfo.name || "这款产品";
    const point = productInfo.sellingPoints.length > 0 ? productInfo.sellingPoints[0] : "好用";

    if (titleStyle === "数字清单型") return `5 个理由告诉你为什么${name}值得入`;
    if (titleStyle === "悬念反转型") return `被骂了三年的${point}洁面，我居然真香了？`;
    if (titleStyle === "直接利益型") return `${point}又不拔干！这瓶洁面${productInfo.targetAudience[0] || "敏感肌"}闭眼冲`;
    // 情绪共鸣型 default
    return `姐妹们！这瓶洁面真的是我今年最爱没有之一 😭`;
  }, [titleStyle, productInfo]);

  const previewOpening = useMemo(() => {
    const audience = productInfo.targetAudience.length > 0 ? productInfo.targetAudience[0] : "";
    const point = productInfo.sellingPoints.length > 0 ? productInfo.sellingPoints[0] : "";

    if (noteType === "种草推荐") {
      return `作为${audience || "敏感肌"} + 学生党，我对洁面真的挑到不行…最近用的这瓶 <strong>${point}又不拔干</strong> 的洁面了，${audience ? audience + "闭眼冲" : "闭眼冲"}——`;
    } else if (noteType === "真实体验") {
      return `用了一个月的 ${productInfo.name}，说说我的真实感受。作为${audience || "敏感肌"}，<strong>洗完脸不紧绷</strong>这点真的太重要了……`;
    } else if (noteType === "避坑指南") {
      return `踩了无数坑之后，终于找到了真正适合${audience || "敏感肌"}的洁面。今天把我的<strong>血泪避坑经验</strong>分享给大家——`;
    } else if (noteType === "对比评测") {
      return `把市面上最火的 3 款氨基酸洁面放在一起对比了一下，结果让我意外的是<strong>${productInfo.name}</strong>居然……`;
    } else {
      return `氨基酸 vs 皂基洁面，到底该怎么选？今天就来聊聊${audience ? "适合" + audience + "的" : ""}洁面成分，顺便分享一款我最近在用的 <strong>${point}</strong> 洁面——`;
    }
  }, [noteType, productInfo]);

  const handleNext = () => {
    setContentStrategy({
      noteType,
      toneStyle: tone,
      titleStyle,
      articleStyle,
      emotionLevel,
      rhythmLevel,
      generateCount: genCount,
      autoTags,
    });
    navigate("/create/images");
  };

  const toggleInsight = (index: number) => {
    const updated = [...insights];
    updated[index] = {
      ...updated[index],
      status: updated[index].status === "adopted" ? "pending" : "adopted",
    };
    setInsights(updated);
    toast.success(updated[index].status === "adopted" ? "已融入正文" : "已取消融入");
  };

  return (
    <CreateLayout currentStep={2} costCredits={genCount}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">内容策略设置</h1>
          <p className="text-sm text-muted-foreground">
            选择笔记形态、语气与结构，AI 将据此撰写正文。可随时返回上一步修改商品信息。
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Config (3/5) */}
          <div className="lg:col-span-3 space-y-7">
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

            {/* Tone style */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">语气风格</label>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((opt) => (
                  <ChoiceChip
                    key={opt}
                    label={opt}
                    selected={tone === opt}
                    onClick={() => setTone(opt)}
                  />
                ))}
              </div>
            </div>

            {/* Title style - NEW */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                标题风格
                <span className="text-[11px] font-normal text-muted-foreground/60 ml-2">影响标题的写法和吸引力</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TITLE_STYLE_OPTIONS.map((opt) => (
                  <ChoiceChip
                    key={opt}
                    label={opt}
                    selected={titleStyle === opt}
                    onClick={() => setTitleStyle(opt)}
                  />
                ))}
              </div>
            </div>

            {/* Article style (was 叙述视角) */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                文章样式
                <span className="text-[11px] font-normal text-muted-foreground/60 ml-2">影响正文的叙事结构</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ARTICLE_STYLE_OPTIONS.map((opt) => (
                  <ChoiceChip
                    key={opt}
                    label={opt}
                    selected={articleStyle === opt}
                    onClick={() => setArticleStyle(opt)}
                  />
                ))}
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

            {/* Generate count + Auto tags */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">生成数量</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setGenCount(n)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        genCount === n
                          ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                          : "border-border/60 bg-white text-foreground hover:border-primary/20"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/60 mt-2">
                  每版用一次额度，并行产出。
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">是否加入话题标签</label>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-white">
                  <span className="text-sm">自动推荐热门标签</span>
                  <Switch checked={autoTags} onCheckedChange={setAutoTags} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                className="bg-white"
                onClick={() => navigate("/create")}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                返回上一步
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 px-6"
                onClick={handleNext}
              >
                下一步：图片生成
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Right: Preview + Insight (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
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
                {[noteType, tone, titleStyle, articleStyle].map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                    {tag}
                  </span>
                ))}
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
                    onClick={() => toast.info(`已套用「${tpl}」策略模板`)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border border-border/60 bg-white hover:border-primary/20 hover:bg-primary/5 transition-all"
                  >
                    {tpl}
                  </button>
                ))}
              </div>
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
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
        selected
          ? "bg-primary/10 text-primary border-primary/25 shadow-sm"
          : "bg-white text-foreground/60 border-border hover:border-primary/20 hover:bg-primary/5"
      }`}
    >
      {label}
    </button>
  );
}
