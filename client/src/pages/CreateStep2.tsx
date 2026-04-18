/*
 * Step 2: 内容策略设置
 * Layout: 左栏参数配置 + 右栏实时预览 & 竞品洞察
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Sparkles,
  Eye,
  Search,
  Zap,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import CreateLayout from "@/components/create/CreateLayout";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";

const NOTE_TYPES = [
  { id: "种草推荐", title: "种草推荐", desc: "突出产品利益与使用场景，适合新品曝光、种草首发。" },
  { id: "真实体验", title: "真实体验", desc: "以第一人称分享使用感受，信任感更高，适合复购种草。" },
  { id: "干货科普", title: "干货科普", desc: "用知识或成分对比切入，再自然带出商品，适合成分党人群。" },
];

const TONE_OPTIONS = ["亲切", "专业", "搞笑", "温柔"];
const PERSPECTIVE_OPTIONS = ["第一人称", "闺蜜推荐", "专家"];
const STRATEGY_TEMPLATES = ["新品首发", "双 11 冲量", "老客复购", "专业人群"];

export default function CreateStep2() {
  const [, navigate] = useLocation();
  const { productInfo, contentStrategy, setContentStrategy } = useCreateContext();

  const [noteType, setNoteType] = useState(contentStrategy.noteType);
  const [tone, setTone] = useState(contentStrategy.toneStyle);
  const [perspective, setPerspective] = useState(contentStrategy.perspective);
  const [heatLevel, setHeatLevel] = useState(contentStrategy.heatLevel);
  const [genCount, setGenCount] = useState(contentStrategy.generateCount);
  const [autoTags, setAutoTags] = useState(contentStrategy.autoTags);

  const previewText = useMemo(() => {
    const name = productInfo.name || "这款产品";
    const audience = productInfo.targetAudience.length > 0 ? productInfo.targetAudience[0] : "";
    const point = productInfo.sellingPoints.length > 0 ? productInfo.sellingPoints[0] : "";

    if (noteType === "种草推荐") {
      return `"姐妹们！终于找到这瓶 <strong>${point}又不拔干</strong> 的洁面了，${audience ? audience + "闭眼冲" : "闭眼冲"}——"`;
    } else if (noteType === "真实体验") {
      return `"用了一个月的 ${name}，说说我的真实感受。作为${audience || "敏感肌"}，<strong>洗完脸不紧绷</strong>这点真的太重要了……"`;
    } else {
      return `"氨基酸 vs 皂基洁面，到底该怎么选？今天就来聊聊${audience ? "适合" + audience + "的" : ""}洁面成分，顺便分享一款我最近在用的 <strong>${point}</strong> 洁面——"`;
    }
  }, [noteType, productInfo]);

  const handleGenerate = () => {
    setContentStrategy({
      noteType,
      toneStyle: tone,
      perspective,
      heatLevel,
      generateCount: genCount,
      autoTags,
    });
    navigate("/create/result");
  };

  return (
    <CreateLayout
      currentStep={2}
      rightAction={
        <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-2">
          <span>剩余生成额度</span>
          <span className="font-bold text-foreground">32 / 50</span>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1.5">内容策略设置</h1>
            <p className="text-sm text-muted-foreground">
              选择笔记形态、语气与结构，AI 将据此撰写正文。可随时返回上一步修改商品信息。
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground shrink-0 ml-4">
            预计用 <span className="font-bold text-foreground">{genCount}</span> 次额度
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Config (3/5) */}
          <div className="lg:col-span-3 space-y-7">
            {/* Note type */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                笔记类型 <span className="text-primary">*</span>
              </label>
              <div className="space-y-3">
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

            {/* Tone + Perspective */}
            <div className="grid sm:grid-cols-2 gap-6">
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
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">叙述视角</label>
                <div className="flex flex-wrap gap-2">
                  {PERSPECTIVE_OPTIONS.map((opt) => (
                    <ChoiceChip
                      key={opt}
                      label={opt}
                      selected={perspective === opt}
                      onClick={() => setPerspective(opt)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Heat level slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">文章热度</label>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">
                  AI 推荐 · 中
                </span>
              </div>
              <Slider
                value={[heatLevel]}
                onValueChange={([v]) => setHeatLevel(v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                <span>平实</span>
                <span>爆感</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                越靠右，开头更钩子化；平实更适合成熟人群与信任型商品。
              </p>
            </div>

            {/* Generate count */}
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
                <p className="text-[11px] text-muted-foreground mt-2">
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

            {/* Competitor reference */}
            {productInfo.competitorLinks && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  竞品参考
                  <span className="text-[11px] font-normal text-muted-foreground ml-2">已扫描 18 篇</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/15">
                    竞品 A · 温和洁面
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/15">
                    竞品 B · 氨基酸科普
                  </span>
                  <button className="px-3 py-1.5 rounded-full text-xs text-muted-foreground border border-dashed border-border hover:border-primary/30 transition-colors">
                    + 粘贴更多链接
                  </button>
                </div>
              </div>
            )}

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
                onClick={handleGenerate}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                开始生成 · 用 {genCount} 次额度
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
            {/* Live preview */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview · 开头示例 · 随参数实时变化
                </span>
              </div>
              <div className="p-4 rounded-xl bg-coral-light/30 border border-primary/10">
                <p
                  className="text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: previewText }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[noteType, tone, perspective, heatLevel > 60 ? "中等热度" : "平实"].map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Competitor insight */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-warm-orange" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  竞品洞察 · 将被 AI 融入
                </span>
              </div>
              <div className="space-y-3">
                <InsightRow
                  label='用户高频痛点 · "闷痘"'
                  status="suggest"
                  statusText="建议回应"
                />
                <InsightRow
                  label='热词 · "学生党"'
                  status="hit"
                  statusText="已命中"
                />
                <InsightRow
                  label='情感锚点 · "早八通勤"'
                  status="hit"
                  statusText="已命中"
                />
                <InsightRow
                  label='成分对比 · "氨基酸 vs 皂基"'
                  status="skip"
                  statusText="未采纳"
                />
              </div>
              {noteType === "干货科普" && (
                <p className="text-[11px] text-muted-foreground mt-3 p-2 rounded-lg bg-secondary/50">
                  切换到"干货科普"类型时，成分对比会被自动启用。
                </p>
              )}
            </div>

            {/* Strategy templates */}
            <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-indigo" />
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

function InsightRow({
  label,
  status,
  statusText,
}: {
  label: string;
  status: "hit" | "suggest" | "skip";
  statusText: string;
}) {
  const colors = {
    hit: "bg-emerald/10 text-emerald border-emerald/20",
    suggest: "bg-primary/10 text-primary border-primary/20",
    skip: "bg-secondary text-muted-foreground border-border/40",
  };
  const icons = {
    hit: <CheckCircle2 className="w-3 h-3" />,
    suggest: <AlertCircle className="w-3 h-3" />,
    skip: <XCircle className="w-3 h-3" />,
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border ${colors[status]}`}
      >
        {icons[status]}
        {statusText}
      </span>
    </div>
  );
}
