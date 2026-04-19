/*
 * 图片编辑 - 步骤 2: 封面文字与样式
 * 选择封面、编辑主文字/副标题、文字样式、字号
 * 注意：已移除"调整文字在图上的位置"框
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Check,
  Sparkles,
  Type,
  Lightbulb,
  Pen,
} from "lucide-react";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";

const MAIN_TEXT_STYLES = [
  { id: "bold-shadow", label: "爆款", desc: "粗体阴影" },
  { id: "stroke", label: "描边", desc: "描边字" },
  { id: "gradient", label: "渐变", desc: "渐变字" },
  { id: "sticker", label: "贴纸", desc: "彩色贴纸" },
];

const SUB_TEXT_STYLES = [
  { id: "handwrite", label: "手写", desc: "手写感" },
  { id: "minimal", label: "简约", desc: "克制极简" },
  { id: "bold", label: "粗体", desc: "粗体阴影" },
  { id: "sticker", label: "贴纸", desc: "彩色贴纸" },
];

// Mock cover images with scores
const MOCK_COVER_DATA = [
  { url: "https://placehold.co/300x400/ffe0e6/e8445a?text=Cover+01", score: "A+", style: "产品实拍风" },
  { url: "https://placehold.co/300x400/ffe0e6/e8445a?text=Cover+02", score: "A", style: "前后对比风" },
  { url: "https://placehold.co/300x400/ffe0e6/e8445a?text=Cover+03", score: "A", style: "文字海报风" },
  { url: "https://placehold.co/300x400/ffe0e6/e8445a?text=Cover+04", score: "B+", style: "产品实拍风" },
];

interface ImageStep2TextProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ImageStep2Text({ onNext, onBack }: ImageStep2TextProps) {
  const { imageConfig, setImageConfig, productInfo } = useCreateContext();

  const [selectedCover, setSelectedCover] = useState(imageConfig.selectedCoverIndex);
  const [mainText, setMainText] = useState(imageConfig.mainText || "姐妹们!这瓶我回购3次了");
  const [mainTextSize, setMainTextSize] = useState(imageConfig.mainTextSize);
  const [mainTextStyle, setMainTextStyle] = useState(imageConfig.mainTextStyle);
  const [subText, setSubText] = useState(imageConfig.subText || "敏感肌亲测");
  const [subTextSize, setSubTextSize] = useState(imageConfig.subTextSize);
  const [subTextStyle, setSubTextStyle] = useState(imageConfig.subTextStyle);

  const mainTextCount = mainText.length;
  const subTextCount = subText.length;

  // Text analysis
  const textAnalysis = useMemo(() => {
    const len = mainText.length;
    let wordCountLabel = "";
    let wordCountColor = "";
    if (len >= 6 && len <= 12) {
      wordCountLabel = `${len} 字 · 最佳`;
      wordCountColor = "text-emerald-600";
    } else if (len > 0 && len < 6) {
      wordCountLabel = `${len} 字 · 偏短`;
      wordCountColor = "text-amber-500";
    } else if (len > 12) {
      wordCountLabel = `${len} 字 · 偏长`;
      wordCountColor = "text-amber-500";
    } else {
      wordCountLabel = "0 字";
      wordCountColor = "text-muted-foreground";
    }

    const hasExclamation = /[!！？?]/.test(mainText);
    const hasNumber = /\d/.test(mainText);
    const emotionLevel = hasExclamation ? "高" : "中";

    let hookType = "叙述式";
    if (hasNumber) hookType = "数字式";
    else if (hasExclamation) hookType = "情绪式";

    return { wordCountLabel, wordCountColor, emotionLevel, hookType };
  }, [mainText]);

  const handleNext = () => {
    setImageConfig({
      ...imageConfig,
      selectedCoverIndex: selectedCover,
      mainText,
      mainTextSize,
      mainTextStyle,
      subText,
      subTextSize,
      subTextStyle,
    });
    onNext();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left: Config (3/5) */}
      <div className="lg:col-span-3 space-y-7">
        {/* Section header */}
        <div>
          <h2 className="text-base font-bold text-foreground mb-1">选择封面并设计文字</h2>
          <p className="text-[11px] text-muted-foreground">
            从候选中选一张作为封面，编辑文字内容与样式
          </p>
        </div>

        {/* Cover candidates */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            候选封面
            <span className="text-[11px] font-normal text-muted-foreground/60 ml-2">选中一张作为封面</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {MOCK_COVER_DATA.map((cover, i) => (
              <button
                key={i}
                onClick={() => setSelectedCover(i)}
                className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                  selectedCover === i
                    ? "border-primary shadow-md"
                    : "border-border/60 hover:border-primary/20"
                }`}
              >
                <img src={cover.url} alt="" className="w-full h-full object-cover" />
                {/* Score badge */}
                <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-md bg-white/90 font-bold text-foreground">
                  {cover.score}
                </span>
                {/* Selected check */}
                {selectedCover === i && (
                  <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                {/* Text overlay preview for selected */}
                {selectedCover === i && mainText && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-black/10">
                    <span className="text-white text-xs font-bold text-center drop-shadow-md leading-tight">
                      {mainText}
                    </span>
                    {subText && (
                      <span className="text-white/80 text-[10px] mt-1 drop-shadow-md">
                        {subText}
                      </span>
                    )}
                  </div>
                )}
                {/* Style label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                  <span className="text-[10px] text-white/90">{cover.style} · {String(i + 1).padStart(2, "0")}</span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => toast.info("再生成一批（用 1 次额度）")}
            className="w-full mt-3 py-2.5 rounded-xl border border-border/60 bg-white text-sm text-muted-foreground font-medium hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            再生成一批（用 1 次额度）
          </button>
        </div>

        {/* Main text + Sub text side by side on larger screens */}
        <div className="space-y-6">
          {/* Main text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Type className="w-4 h-4 text-primary" />
                主文字 <span className="text-primary">*</span>
              </label>
              <span className="text-[11px] text-muted-foreground">{mainTextCount} / 16 字</span>
            </div>
            <textarea
              value={mainText}
              onChange={(e) => setMainText(e.target.value.slice(0, 16))}
              placeholder="输入封面主文字"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50 resize-none"
            />
            {/* AI suggestion */}
            <div className="mt-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                AI 建议：试试 <span className="text-primary font-medium">"洗完不紧绷! 敏感肌救星"</span>（使用痛点词更吸引点击）
              </p>
            </div>

            {/* Font size */}
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground shrink-0">字号</span>
                <Slider
                  value={[mainTextSize]}
                  onValueChange={([v]) => setMainTextSize(v)}
                  min={20}
                  max={80}
                  step={1}
                  className="flex-1"
                />
                <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">大</span>
              </div>
            </div>

            {/* Text style */}
            <div className="mt-4">
              <label className="text-[11px] text-muted-foreground mb-2 block">文字样式</label>
              <div className="grid grid-cols-4 gap-2">
                {MAIN_TEXT_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setMainTextStyle(style.id)}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                      mainTextStyle === style.id
                        ? "border-primary bg-primary/5"
                        : "border-border/60 bg-white hover:border-primary/20"
                    }`}
                  >
                    <div className="text-sm font-bold">{style.label}</div>
                    <div className="text-[10px] text-muted-foreground">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Type className="w-4 h-4 text-muted-foreground" />
                副标题 <span className="text-[11px] font-normal text-muted-foreground/60">选填</span>
              </label>
              <span className="text-[11px] text-muted-foreground">{subTextCount} / 12 字</span>
            </div>
            <input
              type="text"
              value={subText}
              onChange={(e) => setSubText(e.target.value.slice(0, 12))}
              placeholder="输入副标题（选填）"
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
            />

            {/* Font size */}
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground shrink-0">字号</span>
                <Slider
                  value={[subTextSize]}
                  onValueChange={([v]) => setSubTextSize(v)}
                  min={12}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <span className="text-[11px] font-medium text-foreground w-6 text-right shrink-0">小</span>
              </div>
            </div>

            {/* Text style */}
            <div className="mt-4">
              <label className="text-[11px] text-muted-foreground mb-2 block">文字样式</label>
              <div className="grid grid-cols-4 gap-2">
                {SUB_TEXT_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSubTextStyle(style.id)}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                      subTextStyle === style.id
                        ? "border-primary bg-primary/5"
                        : "border-border/60 bg-white hover:border-primary/20"
                    }`}
                  >
                    <div className="text-sm font-bold">{style.label}</div>
                    <div className="text-[10px] text-muted-foreground">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            className="bg-white"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            返回制作封面
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 px-6"
            onClick={handleNext}
          >
            下一步：上传配图
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Right: Analysis + Tips (2/5) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="lg:col-span-2 space-y-5"
      >
        {/* Text analysis */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">封面文字分析</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/40">
              <div className="text-[10px] text-muted-foreground mb-1">字数</div>
              <div className={`text-sm font-bold ${textAnalysis.wordCountColor}`}>
                {textAnalysis.wordCountLabel}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/40">
              <div className="text-[10px] text-muted-foreground mb-1">情绪强度</div>
              <div className="text-sm font-bold text-primary">{textAnalysis.emotionLevel}</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/40">
              <div className="text-[10px] text-muted-foreground mb-1">钩子类型</div>
              <div className="text-sm font-bold text-primary">{textAnalysis.hookType}</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/40">
              <div className="text-[10px] text-muted-foreground mb-1">预测点击率</div>
              <div className="text-sm font-bold text-primary">A+ · 前 15%</div>
            </div>
          </div>
        </div>

        {/* Text tips */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">封面文字小贴士</span>
          </div>
          <div className="space-y-3">
            <TipItem
              title="加感叹号或问号"
              text="情绪更强，能显著提升用户停留"
            />
            <TipItem
              title="数字比形容词有力"
              text={`"回购3次""优于""超好用"`}
            />
            <TipItem
              title="痛点词胜过卖点词"
              text={`"紧绷""闷痘"等痛点词更能吸引目标人群`}
            />
            <TipItem
              title="主副文字建议对比"
              text="主文字粗体冲击，副标题手写或简约，层次更分明"
            />
          </div>
        </div>

        {/* Advanced editing hint */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex items-start gap-2">
            <Pen className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-1">需要更精细的调整？</p>
              <p className="text-[11px] text-blue-600/80 leading-relaxed">
                合成后可用<span className="font-medium text-blue-600 underline underline-offset-2 cursor-pointer">进阶图片编辑器</span>微调字体、颜色、贴纸等
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TipItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/40">
      <div className="text-xs font-semibold text-foreground mb-1">{title}</div>
      <div className="text-[11px] text-muted-foreground leading-relaxed">{text}</div>
    </div>
  );
}
