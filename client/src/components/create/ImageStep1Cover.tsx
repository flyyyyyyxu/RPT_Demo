/*
 * 图片编辑 - 步骤 1: 制作封面图
 * 封面图来源选择、上传、场景描述、风格选择、比例、生成数量
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  Wand2,
  Sparkles,
  Loader2,
  ArrowLeft,
  BookOpen,
  Save,
  Lightbulb,
  X,
} from "lucide-react";
import { useCreateContext } from "@/contexts/CreateContext";
import { toast } from "sonner";

const COVER_SOURCES = [
  {
    id: "upload" as const,
    icon: Upload,
    title: "上传产品图",
    desc: "直接使用已有产品图或拍摄素材，真实感最强",
    recommended: true,
  },
  {
    id: "ai-optimize" as const,
    icon: Wand2,
    title: "上传 + AI 优化",
    desc: "上传后 AI 帮你换背景、调色、生成多个风格版本",
    recommended: false,
  },
];

const SCENE_TAGS_MAP: Record<string, string[]> = {
  default: ["清新自然光", "温柔治愈感", "浴室白色台面", "敏感肌友好", "氨基酸成分", "绵密泡沫", "学生党平价", "医药级质感", "极简干净", "早八通勤场景"],
};

const COVER_STYLES = [
  { id: "product-real", label: "产品实拍风", desc: "干净背景 + 产品特写", badge: "推荐" },
  { id: "comparison", label: "前后对比风", desc: "用前/用后效果对比", badge: "高互动" },
  { id: "text-overlay", label: "文字海报风", desc: "大字标题 + 产品图", badge: "推荐" },
  { id: "lifestyle", label: "生活场景风", desc: "融入使用场景氛围感", badge: "" },
  { id: "flat-lay", label: "平铺摆拍风", desc: "俯拍角度 + 精致摆放", badge: "" },
  { id: "info-graphic", label: "成分信息图", desc: "图文混排，高收藏率", badge: "" },
];

const ASPECT_RATIOS = [
  { id: "3:4", label: "3:4", desc: "竖版（推荐）", recommended: true },
  { id: "1:1", label: "1:1", desc: "方形", recommended: false },
  { id: "4:3", label: "4:3", desc: "横版", recommended: false },
  { id: "9:16", label: "9:16", desc: "全屏", recommended: false },
];

// Mock generated covers
const MOCK_COVERS = [
  "https://placehold.co/360x480/fff0f0/e8445a?text=Cover+1",
  "https://placehold.co/360x480/fff0f0/e8445a?text=Cover+2",
  "https://placehold.co/360x480/fff0f0/e8445a?text=Cover+3",
  "https://placehold.co/360x480/fff0f0/e8445a?text=Cover+4",
  "https://placehold.co/360x480/fff0f0/e8445a?text=Cover+5",
  "https://placehold.co/360x480/fff0f0/e8445a?text=Cover+6",
];

interface ImageStep1CoverProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export default function ImageStep1Cover({ onNext, onBack, onSkip }: ImageStep1CoverProps) {
  const { imageConfig, setImageConfig, productInfo } = useCreateContext();

  const [coverSource, setCoverSource] = useState(imageConfig.coverSource);
  const [coverStyle, setCoverStyle] = useState(imageConfig.coverStyle);
  const [aspectRatio, setAspectRatio] = useState(imageConfig.aspectRatio);
  const [imageCount, setImageCount] = useState(imageConfig.imageCount);
  const [sceneDesc, setSceneDesc] = useState(imageConfig.sceneDescription);
  const [selectedTags, setSelectedTags] = useState<string[]>(imageConfig.sceneTags);
  const [uploadedImages, setUploadedImages] = useState<string[]>(imageConfig.uploadedImages);
  const [generating, setGenerating] = useState(false);

  const sceneTags = SCENE_TAGS_MAP.default;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleUpload = () => {
    const mockUrl = `https://placehold.co/360x480/fef3c7/d97706?text=Product+${uploadedImages.length + 1}`;
    setUploadedImages([...uploadedImages, mockUrl]);
    toast.success("图片上传成功");
  };

  const handleGenerate = () => {
    if (uploadedImages.length === 0) {
      toast.error("请先上传产品图");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setImageConfig({
        ...imageConfig,
        coverSource,
        coverStyle,
        aspectRatio,
        imageCount,
        sceneDescription: sceneDesc,
        sceneTags: selectedTags,
        uploadedImages,
        generatedImages: MOCK_COVERS.slice(0, imageCount),
      });
      setGenerating(false);
      toast.success(`已生成 ${imageCount} 张封面`);
      onNext();
    }, 2500);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      {/* Left: Config (3/5) */}
      <div className="lg:col-span-3 space-y-7">
        {/* Cover source */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">封面图来源</label>
          <p className="text-[11px] text-muted-foreground mb-3">
            封面图决定点击率，3:4 竖版封面比横版点击率高 40%
          </p>
          <div className="grid grid-cols-2 gap-3">
            {COVER_SOURCES.map((src) => {
              const Icon = src.icon;
              return (
                <button
                  key={src.id}
                  onClick={() => setCoverSource(src.id)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    coverSource === src.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/60 bg-white hover:border-primary/20"
                  }`}
                >
                  {src.recommended && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-medium">
                      推荐
                    </span>
                  )}
                  <Icon className={`w-5 h-5 mb-2 ${coverSource === src.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-sm font-bold mb-0.5">{src.title}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{src.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload area */}
        <div>
          {uploadedImages.length === 0 ? (
            <div
              className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
              onClick={handleUpload}
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm font-medium mb-1">点击或拖拽上传产品图</p>
              <p className="text-xs text-muted-foreground">支持 JPG / PNG，单张不超过 10MB</p>
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                已上传 {uploadedImages.length} 张
              </label>
              <div className="flex gap-3 flex-wrap">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl border border-border/60 overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleUpload}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[10px]">添加</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scene description */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            描述你想要的画面
            <span className="text-[11px] font-normal text-muted-foreground/60 ml-2">让 AI 生成更贴近你意图的封面</span>
          </label>
          <textarea
            value={sceneDesc}
            onChange={(e) => setSceneDesc(e.target.value)}
            placeholder="清新自然光，温柔治愈感，浴室白色台面"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50 resize-none"
          />
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] text-muted-foreground">
                基于品类 <span className="text-primary font-medium">美妆护肤·洁面</span> 为你推荐
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sceneTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-primary/10 text-primary border-primary/25"
                        : "bg-white text-foreground/50 border-border hover:border-primary/20 hover:bg-primary/5"
                    }`}
                  >
                    + {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cover style */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-1.5 block">
            封面风格
            <span className="text-[11px] font-normal text-muted-foreground/60 ml-2">AI 会基于你的图和描述生成多个风格版本</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {COVER_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setCoverStyle(style.id)}
                className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                  coverStyle === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border/60 bg-white hover:border-primary/20"
                }`}
              >
                {style.badge && (
                  <span
                    className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      style.badge === "推荐"
                        ? "bg-primary text-white"
                        : "bg-emerald-light text-emerald-dark"
                    }`}
                    style={style.badge === "高互动" ? { background: "oklch(0.92 0.05 160)", color: "oklch(0.4 0.15 160)" } : {}}
                  >
                    {style.badge}
                  </span>
                )}
                <div className="text-sm font-medium">{style.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect ratio + Image count */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Aspect ratio */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">封面比例</label>
            <div className="grid grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    aspectRatio === ratio.id
                      ? "border-primary bg-primary/5"
                      : "border-border/60 bg-white hover:border-primary/20"
                  }`}
                >
                  <div className="text-base font-bold mb-0.5">{ratio.label}</div>
                  <div className="text-[10px] text-muted-foreground">{ratio.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image count */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">
                生成数量
              </label>
              <span className="text-sm font-bold text-primary">{imageCount} 张</span>
            </div>
            <Slider
              value={[imageCount]}
              onValueChange={([v]) => setImageCount(v)}
              min={2}
              max={6}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
              <span>2 张</span>
              <span>6 张</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Tips (2/5) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="lg:col-span-2 space-y-5"
      >
        {/* 小红书封面指南 */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">小红书封面指南</span>
          </div>
          <div className="space-y-3">
            <TipItem
              title="竖版点击率高 40%"
              text="信息流中 3:4 占比最大，首选竖版封面"
            />
            <TipItem
              title="文字要大且醒目"
              text="用户在信息流中快速滑动，封面文字建议 6-12 字"
            />
            <TipItem
              title="真实感比精致更重要"
              text="小红书用户反感过度修图的广告感，真实产品图更受欢迎"
            />
            <TipItem
              title="多版本对比选最优"
              text="生成 3-4 版不同风格，发布后对比数据选最好的那版"
            />
          </div>
        </div>

        {/* Prompt 写作技巧 */}
        <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold">Prompt 写作技巧</span>
          </div>
          <div className="space-y-3">
            <TipItem
              title="描述光线和氛围"
              text={`"自然光""暖色调""清冷感"比笼统的"漂亮"更有用`}
            />
            <TipItem
              title="指定场景而非技术词"
              text={`"早晨浴室""比""景深 f/2.8"对 AI 更友好`}
            />
            <TipItem
              title="加入情绪词"
              text={`"治愈""元气""精致"能让画面调性更一致`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button
            variant="outline"
            className="bg-white"
            onClick={() => toast.success("草稿已保存")}
          >
            <Save className="w-4 h-4 mr-1.5" />
            保存草稿
          </Button>
          <Button
            variant="outline"
            className="bg-white"
            onClick={onSkip}
          >
            跳过图片编辑
          </Button>
          <Button
            variant="outline"
            className="bg-white"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            返回上一步
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1.5" />
                生成封面
              </>
            )}
          </Button>
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
